import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import './Dashboard.css';

// Helper function for stat icons (moved outside component)
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
    recommendedCourses: 'book'
  };
  
  return iconMap[statKey] || 'chart-line';
};

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);

  // Move useEffect to the top level - never call hooks conditionally
  useEffect(() => {
    if (!user) return; // Early return inside useEffect is fine

    // Simulate fetching dashboard data
    const fetchDashboardData = async () => {
      const role = user.role || 'student';
      
      // Mock stats based on role
      const mockStats = {
        student: {
          applications: 12,
          messages: 8,
          pending: 3,
          profileComplete: 85,
          upcomingInterviews: 2,
          recommendedCourses: 15
        },
        institute: {
          totalCourses: 45,
          newApplications: 23,
          pendingReviews: 12,
          enrollmentRate: 78,
          activeStudents: 1250,
          revenue: '₹4.2L'
        },
        company: {
          activeJobs: 8,
          newApplicants: 34,
          interviews: 15,
          hireRate: '22%',
          openPositions: 12,
          totalHires: 45
        },
        admin: {
          totalUsers: 12500,
          activeInstitutions: 245,
          companies: 567,
          systemHealth: '98%',
          pendingApprovals: 23,
          revenue: '₹25.4L'
        }
      };

      // Mock recent activity
      const mockActivity = {
        student: [
          { id: 1, type: 'application', message: 'Application submitted for Computer Science', time: '2 hours ago', status: 'pending' },
          { id: 2, type: 'message', message: 'New message from Admissions Team', time: '1 day ago', status: 'unread' },
          { id: 3, type: 'interview', message: 'Interview scheduled for Tomorrow', time: '2 days ago', status: 'upcoming' }
        ],
        institute: [
          { id: 1, type: 'application', message: '15 new applications received', time: '3 hours ago', status: 'new' },
          { id: 2, type: 'enrollment', message: '8 students enrolled in Engineering', time: '1 day ago', status: 'completed' },
          { id: 3, type: 'alert', message: 'Course approval pending', time: '2 days ago', status: 'warning' }
        ],
        company: [
          { id: 1, type: 'application', message: '12 new applicants for Developer role', time: '4 hours ago', status: 'new' },
          { id: 2, type: 'interview', message: 'Technical interviews scheduled', time: '1 day ago', status: 'scheduled' },
          { id: 3, type: 'hire', message: '2 candidates accepted offers', time: '3 days ago', status: 'completed' }
        ],
        admin: [
          { id: 1, type: 'user', message: '45 new user registrations', time: '5 hours ago', status: 'new' },
          { id: 2, type: 'institution', message: '3 institutions pending verification', time: '1 day ago', status: 'pending' },
          { id: 3, type: 'system', message: 'System backup completed', time: '2 days ago', status: 'completed' }
        ]
      };

      setStats(mockStats[role] || {});
      setRecentActivity(mockActivity[role] || []);
    };

    fetchDashboardData();
  }, [user]); // Add user as dependency

  // Authentication check - keep this before hooks
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
              stats: `${stats.recommendedCourses || 0} recommended`,
              color: 'primary'
            },
            { 
              icon: 'fas fa-file-alt', 
              title: 'My Applications', 
              description: 'Track your application status and updates', 
              link: '/applications',
              stats: `${stats.applications || 0} active`,
              color: 'info'
            },
            { 
              icon: 'fas fa-graduation-cap', 
              title: 'Academic Profile', 
              description: 'Manage your transcripts and credentials', 
              link: '/profile',
              stats: `${stats.profileComplete || 0}% complete`,
              color: 'success'
            },
            { 
              icon: 'fas fa-briefcase', 
              title: 'Career Opportunities', 
              description: 'Find internships and job placements', 
              link: '/jobs',
              stats: `${stats.upcomingInterviews || 0} interviews`,
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
              stats: `${stats.newApplications || 0} new`,
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
              stats: `${stats.newApplicants || 0} new`,
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
              stats: `${stats.interviews || 0} scheduled`,
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
        return 'fas fa-check-circle text-success';
      case 'warning':
      case 'alert':
        return 'fas fa-exclamation-triangle text-warning';
      case 'new':
      case 'unread':
        return 'fas fa-circle text-primary';
      default:
        return 'fas fa-info-circle text-info';
    }
  };

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
        <div className="recent-activity">
          <div className="activity-header">
            <h3>Recent Activity</h3>
            <button className="btn btn-link">View All</button>
          </div>
          <div className="activity-list">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="activity-item">
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
      </div>
    </div>
  );
};

export default Dashboard;