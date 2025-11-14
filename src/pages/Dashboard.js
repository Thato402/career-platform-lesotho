import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { 
  getStudentApplications, 
  getInstitutionApplications, 
  getCourses,
  getCompanies,
  getJobs,
  getInstitutions,
  getUserProfile
} from '../services/realtimeDb';
import './Dashboard.css';

// Helper function for stat icons
const getStatIcon = (statKey) => {
  const iconMap = {
    applications: 'file-alt',
    messages: 'envelope',
    pending: 'clock',
    profileComplete: 'user-check',
    courses: 'book',
    students: 'user-graduate',
    jobs: 'briefcase',
    interviews: 'calendar-alt',
    users: 'users',
    institutions: 'university',
    companies: 'building',
    revenue: 'rupee-sign',
    health: 'heartbeat',
    totalCourses: 'book',
    newApplications: 'file-alt',
    pendingReviews: 'clock',
    enrollmentRate: 'chart-line',
    activeStudents: 'user-graduate',
    activeJobs: 'briefcase',
    newApplicants: 'users',
    hireRate: 'chart-line',
    openPositions: 'briefcase',
    totalHires: 'user-check',
    totalUsers: 'users',
    activeInstitutions: 'university',
    systemHealth: 'heartbeat',
    pendingApprovals: 'clock',
    upcomingInterviews: 'calendar-alt',
    recommendedCourses: 'book',
    qualifiedCourses: 'graduation-cap',
    transcriptStatus: 'file-contract'
  };
  
  return iconMap[statKey] || 'chart-line';
};

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const role = user.role || 'student';
        
        let dashboardStats = {};
        let activityData = [];

        switch (role) {
          case 'student':
            const studentData = await fetchStudentData(user.uid);
            dashboardStats = studentData.stats;
            activityData = studentData.activity;
            break;
          case 'institute':
            const instituteData = await fetchInstituteData(user.uid);
            dashboardStats = instituteData.stats;
            activityData = instituteData.activity;
            break;
          case 'company':
            const companyData = await fetchCompanyData(user.uid);
            dashboardStats = companyData.stats;
            activityData = companyData.activity;
            break;
          case 'admin':
            const adminData = await fetchAdminData();
            dashboardStats = adminData.stats;
            activityData = adminData.activity;
            break;
          default:
            dashboardStats = {};
            activityData = [];
        }

        setStats(dashboardStats);
        setRecentActivity(activityData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Fetch real data for students
  const fetchStudentData = async (userId) => {
    try {
      const [applications, courses, jobs, userProfile] = await Promise.all([
        getStudentApplications(userId),
        getCourses(),
        getJobs(),
        getUserProfile(userId)
      ]);

      const pendingApplications = applications.filter(app => app.status === 'pending');
      const acceptedApplications = applications.filter(app => app.status === 'accepted');
      
      // Calculate profile completion percentage
      const profileComplete = calculateProfileCompletion(userProfile);
      
      // Get qualified courses based on results
      const qualifiedCourses = userProfile?.qualifications ? 
        courses.filter(course => isCourseQualified(course, userProfile.qualifications)).length : 0;

      const stats = {
        applications: applications.length,
        pending: pendingApplications.length,
        accepted: acceptedApplications.length,
        profileComplete: profileComplete,
        qualifiedCourses: qualifiedCourses,
        activeJobs: jobs.length,
        transcriptStatus: userProfile?.results ? 'Completed' : 'Pending'
      };

      const activity = applications.slice(0, 5).map(app => ({
        id: app.applicationId,
        message: `Application for ${app.courseName} at ${app.institutionName}`,
        status: app.status,
        time: formatTimeAgo(new Date(app.appliedAt))
      }));

      // Add transcript status activity if available
      if (userProfile?.results) {
        activity.unshift({
          id: 'transcript',
          message: 'LGCSE results processed and qualifications calculated',
          status: 'completed',
          time: formatTimeAgo(new Date(userProfile.processedAt))
        });
      }

      return { stats, activity };
    } catch (error) {
      console.error('Error fetching student data:', error);
      return { stats: {}, activity: [] };
    }
  };

  // Fetch real data for institutions
  const fetchInstituteData = async (institutionId) => {
    try {
      const [applications, courses, userProfile] = await Promise.all([
        getInstitutionApplications(institutionId),
        getCourses(institutionId),
        getUserProfile(institutionId)
      ]);

      const pendingApplications = applications.filter(app => app.status === 'pending');
      const newApplications = applications.filter(app => 
        new Date(app.appliedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );

      const totalStudents = [...new Set(applications.map(app => app.studentId))].length;
      const enrollmentRate = applications.length > 0 ? 
        Math.round((applications.filter(app => app.status === 'accepted').length / applications.length) * 100) : 0;

      const stats = {
        totalCourses: courses.length,
        newApplications: newApplications.length,
        pendingReviews: pendingApplications.length,
        enrollmentRate: enrollmentRate,
        activeStudents: totalStudents,
        totalApplications: applications.length
      };

      const activity = applications.slice(0, 5).map(app => ({
        id: app.applicationId,
        message: `New application from ${app.studentName} for ${app.courseName}`,
        status: app.status,
        time: formatTimeAgo(new Date(app.appliedAt))
      }));

      return { stats, activity };
    } catch (error) {
      console.error('Error fetching institute data:', error);
      return { stats: {}, activity: [] };
    }
  };

  // Fetch real data for companies
  const fetchCompanyData = async (companyId) => {
    try {
      const [jobs, companies] = await Promise.all([
        getJobs(),
        getCompanies()
      ]);

      const companyJobs = jobs.filter(job => job.companyId === companyId);
      const activeJobs = companyJobs.filter(job => job.status === 'active');
      
      // Calculate total applicants across all jobs (this would need enhancement in real implementation)
      const totalApplicants = companyJobs.reduce((total, job) => total + (job.applicants || 0), 0);

      const stats = {
        activeJobs: activeJobs.length,
        totalJobs: companyJobs.length,
        newApplicants: totalApplicants,
        openPositions: activeJobs.length,
        totalCompanies: companies.length,
        hireRate: '0%' // This would need actual hire data
      };

      const activity = companyJobs.slice(0, 5).map(job => ({
        id: job.id,
        message: `Job posting: ${job.title}`,
        status: job.status === 'active' ? 'active' : 'closed',
        time: formatTimeAgo(new Date(job.postedAt))
      }));

      return { stats, activity };
    } catch (error) {
      console.error('Error fetching company data:', error);
      return { stats: {}, activity: [] };
    }
  };

  // Fetch real data for admin
  const fetchAdminData = async () => {
    try {
      const [institutions, companies, jobs, courses] = await Promise.all([
        getInstitutions(),
        getCompanies(),
        getJobs(),
        getCourses()
      ]);

      const activeInstitutions = institutions.filter(inst => inst.isActive !== false);
      const activeCompanies = companies.filter(comp => comp.isActive !== false);
      const activeJobs = jobs.filter(job => job.status === 'active');

      const stats = {
        totalUsers: 0, // This would need user count from database
        activeInstitutions: activeInstitutions.length,
        companies: activeCompanies.length,
        totalCourses: courses.length,
        activeJobs: activeJobs.length,
        systemHealth: '98%'
      };

      const activity = [
        ...institutions.slice(0, 3).map(inst => ({
          id: inst.id,
          message: `Institution: ${inst.name} registered`,
          status: 'completed',
          time: formatTimeAgo(new Date(inst.createdAt))
        })),
        ...companies.slice(0, 2).map(comp => ({
          id: comp.id,
          message: `Company: ${comp.name} joined platform`,
          status: 'completed',
          time: formatTimeAgo(new Date(comp.createdAt))
        }))
      ];

      return { stats, activity };
    } catch (error) {
      console.error('Error fetching admin data:', error);
      return { stats: {}, activity: [] };
    }
  };

  // Helper function to calculate profile completion percentage
  const calculateProfileCompletion = (userProfile) => {
    if (!userProfile) return 0;
    
    let completedFields = 0;
    const totalFields = 5; // Adjust based on your required fields
    
    if (userProfile.name) completedFields++;
    if (userProfile.email) completedFields++;
    if (userProfile.results) completedFields++;
    if (userProfile.qualifications) completedFields++;
    if (userProfile.applications && userProfile.applications.length > 0) completedFields++;
    
    return Math.round((completedFields / totalFields) * 100);
  };

  // Helper function to check if student qualifies for a course
  const isCourseQualified = (course, qualifications) => {
    if (!course.requirements || !qualifications) return true;
    
    const req = course.requirements;
    
    // Check minimum points
    if (req.minPoints && qualifications.totalPoints < req.minPoints) {
      return false;
    }
    
    // Check subject requirements
    if (req.subjects) {
      if (req.subjects.mathematics && !['A', 'B', 'C'].includes(qualifications.subjectGrades?.mathematics)) {
        return false;
      }
      if (req.subjects.english && !['A', 'B', 'C'].includes(qualifications.subjectGrades?.english)) {
        return false;
      }
      if (req.subjects.science && !['A', 'B', 'C'].includes(qualifications.subjectGrades?.science)) {
        return false;
      }
    }
    
    return true;
  };

  // Helper function to format time ago
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  // Authentication check
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const getDashboardContent = () => {
    const role = user.role || 'student';
    
    switch (role) {
      case 'student':
        return {
          title: 'Student Dashboard',
          welcomeMessage: 'Ready to advance your career?',
          cards: [
            { 
              icon: 'fas fa-search', 
              title: 'Browse Courses', 
              description: 'Discover and apply to courses from top institutions', 
              link: '/courses',
              stats: `${stats.qualifiedCourses || 0} qualified`,
              color: 'primary'
            },
            { 
              icon: 'fas fa-file-alt', 
              title: 'My Applications', 
              description: 'Track your application status and updates', 
              link: '/applications',
              stats: `${stats.applications || 0} total`,
              color: 'info'
            },
            { 
              icon: 'fas fa-file-contract', 
              title: 'Academic Profile', 
              description: 'Manage your transcripts and credentials', 
              link: '/transcripts',
              stats: stats.transcriptStatus || 'Not Started',
              color: 'success'
            },
            { 
              icon: 'fas fa-briefcase', 
              title: 'Career Opportunities', 
              description: 'Find internships and job placements', 
              link: '/jobs',
              stats: `${stats.activeJobs || 0} available`,
              color: 'warning'
            }
          ]
        };
      case 'institute':
        return {
          title: 'Institution Dashboard',
          welcomeMessage: 'Manage your educational programs efficiently',
          cards: [
            { 
              icon: 'fas fa-university', 
              title: 'Course Management', 
              description: 'Add and update course offerings and curriculum', 
              link: '/institution/courses',
              stats: `${stats.totalCourses || 0} courses`,
              color: 'primary'
            },
            { 
              icon: 'fas fa-users', 
              title: 'Applications Review', 
              description: 'Review and process student applications', 
              link: '/institution/applications',
              stats: `${stats.pendingReviews || 0} pending`,
              color: 'info'
            },
            { 
              icon: 'fas fa-chart-bar', 
              title: 'Analytics & Reports', 
              description: 'View admission statistics and performance metrics', 
              link: '/institution/analytics',
              stats: `${stats.enrollmentRate || 0}% enrollment`,
              color: 'success'
            },
            { 
              icon: 'fas fa-user-graduate', 
              title: 'Student Management', 
              description: 'Manage enrolled students and academic records', 
              link: '/institution/students',
              stats: `${stats.activeStudents || 0} students`,
              color: 'warning'
            }
          ]
        };
      case 'company':
        return {
          title: 'Company Dashboard',
          welcomeMessage: 'Find the perfect talent for your organization',
          cards: [
            { 
              icon: 'fas fa-briefcase', 
              title: 'Job Postings', 
              description: 'Create and manage job opportunities', 
              link: '/jobs',
              stats: `${stats.activeJobs || 0} active`,
              color: 'primary'
            },
            { 
              icon: 'fas fa-users', 
              title: 'Candidate Pipeline', 
              description: 'View and manage qualified applicants', 
              link: '/candidates',
              stats: `${stats.newApplicants || 0} applicants`,
              color: 'info'
            },
            { 
              icon: 'fas fa-chart-line', 
              title: 'Hiring Analytics', 
              description: 'Track recruitment metrics and performance', 
              link: '/analytics',
              stats: `${stats.hireRate || '0%'} hire rate`,
              color: 'success'
            },
            { 
              icon: 'fas fa-handshake', 
              title: 'Interview Management', 
              description: 'Schedule and conduct candidate interviews', 
              link: '/interviews',
              stats: `${stats.openPositions || 0} positions`,
              color: 'warning'
            }
          ]
        };
      case 'admin':
        return {
          title: 'Admin Dashboard',
          welcomeMessage: 'Monitor and manage the entire platform',
          cards: [
            { 
              icon: 'fas fa-cogs', 
              title: 'System Settings', 
              description: 'Manage platform configuration and features', 
              link: '/admin/settings',
              stats: `${stats.systemHealth || '100%'} health`,
              color: 'primary'
            },
            { 
              icon: 'fas fa-users-cog', 
              title: 'User Management', 
              description: 'Monitor and manage registered users', 
              link: '/admin/users',
              stats: `${stats.totalUsers || 0} users`,
              color: 'info'
            },
            { 
              icon: 'fas fa-university', 
              title: 'Institution Management', 
              description: 'Approve and manage educational institutions', 
              link: '/admin/institutions',
              stats: `${stats.activeInstitutions || 0} active`,
              color: 'success'
            },
            { 
              icon: 'fas fa-building', 
              title: 'Company Management', 
              description: 'Manage corporate partners and verifications', 
              link: '/admin/companies',
              stats: `${stats.companies || 0} companies`,
              color: 'warning'
            }
          ]
        };
      default:
        return { 
          title: 'Dashboard', 
          welcomeMessage: 'Welcome to your dashboard',
          cards: [] 
        };
    }
  };

  const dashboard = getDashboardContent();

  const handleExploreClick = (link) => {
    navigate(link);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
      case 'upcoming':
        return 'fas fa-clock text-warning';
      case 'completed':
      case 'success':
      case 'accepted':
      case 'active':
        return 'fas fa-check-circle text-success';
      case 'warning':
      case 'alert':
        return 'fas fa-exclamation-triangle text-warning';
      case 'new':
      case 'unread':
        return 'fas fa-circle text-primary';
      case 'cancelled':
      case 'rejected':
        return 'fas fa-times-circle text-danger';
      default:
        return 'fas fa-info-circle text-info';
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="container-fluid">
          <div className="loading-section">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container-fluid">
        {/* Header Section */}
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>Welcome back, {user.name || user.email}! </h1>
            <p className="welcome-message">{dashboard.welcomeMessage}</p>
          </div>
          <div className="quick-actions">
            <button className="btn btn-outline-primary">
              <i className="fas fa-bell"></i>
              Notifications
            </button>
            <button className="btn btn-outline-secondary">
              <i className="fas fa-cog"></i>
              Settings
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="stats-overview">
          {Object.entries(stats).slice(0, 4).map(([key, value], index) => (
            <div key={key} className="stat-card">
              <div className="stat-content">
                <div className="stat-value">{value}</div>
                <div className="stat-label">
                  {key.split(/(?=[A-Z])/).join(' ')}
                </div>
              </div>
              <div className={`stat-icon stat-color-${index % 4}`}>
                <i className={`fas fa-${getStatIcon(key)}`}></i>
              </div>
            </div>
          ))}
        </div>

        {/* Explore Shortcuts */}
        <div className="explore-section">
          <h2>Quick Access</h2>
          <div className="dashboard-cards">
            {dashboard.cards.map((card, index) => (
              <div key={index} className={`explore-card card-${card.color}`}>
                <div className="card-header">
                  <i className={card.icon}></i>
                  <span className="card-stats">{card.stats}</span>
                </div>
                <div className="card-body">
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
                <div className="card-footer">
                  <button 
                    className="btn btn-explore" 
                    onClick={() => handleExploreClick(card.link)}
                  >
                    Explore <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <div className="recent-activity">
            <div className="activity-header">
              <h3>Recent Activity</h3>
              <button className="btn btn-link">View All</button>
            </div>
            <div className="activity-list">
              {recentActivity.map((activity, index) => (
                <div key={activity.id || index} className="activity-item">
                  <div className="activity-icon">
                    <i className={getStatusIcon(activity.status)}></i>
                  </div>
                  <div className="activity-content">
                    <p className="activity-message">{activity.message}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
