import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const InstitutionDashboard = ({ user, userProfile }) => {
  const [institutionData, setInstitutionData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [applications, setApplications] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Mock data for institution
  const mockInstitutionData = {
    id: 1,
    name: 'National University of Lesotho',
    location: 'Roma, Lesotho',
    description: 'Premier higher education institution committed to academic excellence, research innovation, and community development. Offering diverse programs across multiple faculties.',
    established: '1945',
    accreditation: 'Fully Accredited',
    contact: {
      email: 'admissions@nul.ls',
      phone: '+266 22340601',
      address: 'P.O. Roma 180, Roma, Lesotho'
    },
    stats: {
      totalStudents: 12500,
      academicStaff: 450,
      administrativeStaff: 280,
      faculties: 7,
      programs: 85,
      researchCenters: 12,
      internationalPartnerships: 45
    }
  };

  const mockCourses = [
    {
      id: 1,
      name: 'Bachelor of Science in Computer Science',
      code: 'CS101',
      faculty: 'Science and Technology',
      duration: '4 years',
      credits: 120,
      status: 'Active',
      enrolledStudents: 285,
      capacity: 300,
      coordinator: 'Dr. John Molapo',
      description: 'Comprehensive program covering software development, algorithms, and computer systems.'
    },
    {
      id: 2,
      name: 'Bachelor of Business Administration',
      code: 'BBA201',
      faculty: 'Business and Management',
      duration: '3 years',
      credits: 90,
      status: 'Active',
      enrolledStudents: 420,
      capacity: 450,
      coordinator: 'Prof. Mary Khotle',
      description: 'Business management program focusing on leadership, strategy, and entrepreneurship.'
    },
    {
      id: 3,
      name: 'Bachelor of Engineering',
      code: 'ENG301',
      faculty: 'Engineering',
      duration: '5 years',
      credits: 150,
      status: 'Active',
      enrolledStudents: 180,
      capacity: 200,
      coordinator: 'Dr. Peter Sello',
      description: 'Engineering program with specializations in civil, electrical, and mechanical engineering.'
    }
  ];

  const mockApplications = [
    {
      id: 1,
      studentName: 'John Molapo',
      program: 'Computer Science',
      applicationDate: '2024-03-15',
      status: 'Under Review',
      priority: 'High',
      documents: ['Transcript', 'Recommendation', 'Personal Statement'],
      lastUpdated: '2024-03-18'
    },
    {
      id: 2,
      studentName: 'Mary Khotle',
      program: 'Business Administration',
      applicationDate: '2024-03-10',
      status: 'Admitted',
      priority: 'Medium',
      documents: ['Transcript', 'CV'],
      lastUpdated: '2024-03-12'
    },
    {
      id: 3,
      studentName: 'David Letsie',
      program: 'Engineering',
      applicationDate: '2024-03-18',
      status: 'Pending Documents',
      priority: 'Low',
      documents: ['Transcript'],
      lastUpdated: '2024-03-19'
    }
  ];

  const mockAnalytics = {
    admissionStats: {
      totalApplications: 1560,
      admitted: 450,
      enrolled: 380,
      acceptanceRate: '28.8%',
      yieldRate: '84.4%'
    },
    programPerformance: {
      mostPopular: 'Business Administration',
      highestRetention: 'Computer Science',
      fastestGrowing: 'Data Science'
    },
    studentDemographics: {
      local: '92%',
      international: '8%',
      male: '55%',
      female: '45%'
    },
    financials: {
      annualBudget: '25.8M LSL',
      researchGrants: '8.2M LSL',
      operationalCosts: '17.6M LSL'
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user && userProfile?.role === 'institute') {
        try {
          // In real implementation, fetch institution-specific data
          setInstitutionData(mockInstitutionData);
          setCourses(mockCourses);
          setApplications(mockApplications);
          setAnalytics(mockAnalytics);
        } catch (error) {
          console.error('Error fetching institution data:', error);
          // Fallback to mock data
          setInstitutionData(mockInstitutionData);
          setCourses(mockCourses);
          setApplications(mockApplications);
          setAnalytics(mockAnalytics);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, userProfile]);

  const handleExploreClick = (page) => {
    navigate(`/institution/${page}`);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Under Review': { color: 'var(--warning)', icon: 'fa-clock' },
      'Admitted': { color: 'var(--success)', icon: 'fa-check-circle' },
      'Pending Documents': { color: 'var(--danger)', icon: 'fa-exclamation-circle' },
      'Active': { color: 'var(--success)', icon: 'fa-check-circle' }
    };
    
    const config = statusConfig[status] || statusConfig['Under Review'];
    
    return (
      <span style={{ 
        background: config.color,
        color: 'white',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: '600',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        <i className={`fas ${config.icon}`}></i>
        {status}
      </span>
    );
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (userProfile?.role !== 'institute') {
    return (
      <div className="container" style={{ padding: '50px 0', textAlign: 'center' }}>
        <div style={{ color: 'var(--danger)', fontSize: '4rem', marginBottom: '20px' }}>
          <i className="fas fa-university"></i>
        </div>
        <h2>Institutional Access Required</h2>
        <p>This dashboard is exclusively available for institutional administrators.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: '50px 0', textAlign: 'center' }}>
        <div style={{ color: 'var(--primary)', fontSize: '3rem', marginBottom: '20px' }}>
          <i className="fas fa-spinner fa-spin"></i>
        </div>
        <h3>Loading Institution Dashboard...</h3>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <style>
        {`
          .metric-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          }
          
          .quick-action-card {
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
            border-left: 4px solid var(--secondary);
            cursor: pointer;
            border: 1px solid #e0e0e0;
            transition: all 0.3s ease;
          }
          
          .quick-action-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.12);
            border-left-color: var(--primary);
          }

          .explore-button {
            margin-top: 15px;
            padding: 10px 20px;
            background: var(--secondary);
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }

          .explore-button:hover {
            background: var(--primary);
            transform: translateY(-2px);
          }

          .stat-card {
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.08);
            text-align: center;
            border-top: 4px solid var(--secondary);
          }

          .hover-effect:hover {
            background: #f8f9fa;
            transition: background 0.3s ease;
          }
        `}
      </style>
      
      <div className="container">
        <div className="dashboard-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h1>Welcome back, {institutionData?.name}!</h1>
              <p>Institution Dashboard - Comprehensive academic management system</p>
            </div>
            <div style={{ 
              background: 'rgba(76, 201, 240, 0.1)', 
              padding: '15px 20px', 
              borderRadius: '12px',
              border: '1px solid rgba(76, 201, 240, 0.2)'
            }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--gray)', marginBottom: '5px' }}>Academic Year</div>
              <div style={{ fontWeight: '600', color: 'var(--secondary)' }}>
                2024/2025 - Semester 1
              </div>
            </div>
          </div>
        </div>

        {/* Institution Overview */}
        <div className="form-container" style={{ marginBottom: '30px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
            <div>
              <h3 style={{ color: 'var(--secondary)', marginBottom: '15px' }}>Institution Profile</h3>
              <p style={{ lineHeight: '1.6', marginBottom: '20px' }}>
                {institutionData?.description}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                <div>
                  <strong>Established:</strong> {institutionData?.established}
                </div>
                <div>
                  <strong>Accreditation:</strong> {institutionData?.accreditation}
                </div>
                <div>
                  <strong>Contact:</strong> {institutionData?.contact?.email}
                </div>
                <div>
                  <strong>Phone:</strong> {institutionData?.contact?.phone}
                </div>
              </div>
            </div>
            <div>
              <h4 style={{ color: 'var(--secondary)', marginBottom: '15px' }}>Quick Stats</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="stat-card">
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>
                    {institutionData?.stats?.totalStudents?.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>Total Students</div>
                </div>
                <div className="stat-card">
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--secondary)' }}>
                    {institutionData?.stats?.academicStaff}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>Academic Staff</div>
                </div>
                <div className="stat-card">
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--accent)' }}>
                    {institutionData?.stats?.programs}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>Academic Programs</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px', 
          marginBottom: '40px' 
        }}>
          <div className="quick-action-card" onClick={() => handleExploreClick('courses')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
              <div style={{ 
                background: 'var(--secondary)', 
                width: '60px', 
                height: '60px', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.5rem'
              }}>
                <i className="fas fa-book-open"></i>
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 8px 0', color: 'var(--secondary)' }}>Academic Programs</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--gray)' }}>
                  Manage course catalog, curriculum, and program offerings
                </p>
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--gray)', marginBottom: '10px' }}>
              <i className="fas fa-info-circle"></i> {courses.length} active programs
            </div>
            <button className="explore-button" onClick={(e) => { e.stopPropagation(); handleExploreClick('courses'); }}>
              <i className="fas fa-arrow-right"></i> Manage Programs
            </button>
          </div>
          
          <div className="quick-action-card" onClick={() => handleExploreClick('applications')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
              <div style={{ 
                background: 'var(--primary)', 
                width: '60px', 
                height: '60px', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.5rem'
              }}>
                <i className="fas fa-users"></i>
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 8px 0', color: 'var(--secondary)' }}>Admissions Center</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--gray)' }}>
                  Review applications, manage admissions, and track candidates
                </p>
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--gray)', marginBottom: '10px' }}>
              <i className="fas fa-clock"></i> {applications.filter(app => app.status === 'Under Review').length} pending reviews
            </div>
            <button className="explore-button" onClick={(e) => { e.stopPropagation(); handleExploreClick('applications'); }}>
              <i className="fas fa-arrow-right"></i> Review Applications
            </button>
          </div>
          
          <div className="quick-action-card" onClick={() => handleExploreClick('analytics')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
              <div style={{ 
                background: 'var(--accent)', 
                width: '60px', 
                height: '60px', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.5rem'
              }}>
                <i className="fas fa-chart-bar"></i>
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 8px 0', color: 'var(--secondary)' }}>Institutional Analytics</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--gray)' }}>
                  Comprehensive performance metrics and enrollment analytics
                </p>
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--gray)', marginBottom: '10px' }}>
              <i className="fas fa-trend-up"></i> {analytics.admissionStats?.acceptanceRate} acceptance rate
            </div>
            <button className="explore-button" onClick={(e) => { e.stopPropagation(); handleExploreClick('analytics'); }}>
              <i className="fas fa-arrow-right"></i> View Analytics
            </button>
          </div>
          
          <div className="quick-action-card" onClick={() => handleExploreClick('profile')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
              <div style={{ 
                background: 'var(--success)', 
                width: '60px', 
                height: '60px', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.5rem'
              }}>
                <i className="fas fa-cog"></i>
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 8px 0', color: 'var(--secondary)' }}>Institution Settings</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--gray)' }}>
                  Configure institutional profile, policies, and system preferences
                </p>
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--gray)', marginBottom: '10px' }}>
              <i className="fas fa-shield-alt"></i> Profile 95% complete
            </div>
            <button className="explore-button" style={{ background: 'var(--success)' }} onClick={(e) => { e.stopPropagation(); handleExploreClick('profile'); }}>
              <i className="fas fa-arrow-right"></i> Configure Settings
            </button>
          </div>
        </div>

        {/* Recent Activity & Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginTop: '20px' }}>
          <div className="form-container">
            <h3 style={{ marginBottom: '20px' }}>Recent Admission Applications</h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {applications.map(application => (
                <div key={application.id} style={{ 
                  padding: '15px', 
                  borderBottom: '1px solid #f0f0f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background 0.3s ease'
                }} className="hover-effect">
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                      <strong style={{ color: 'var(--secondary)' }}>{application.studentName}</strong>
                      {getStatusBadge(application.status)}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--gray)' }}>
                      Program: <strong>{application.program}</strong>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--light-gray)', marginTop: '4px' }}>
                      Applied: {new Date(application.applicationDate).toLocaleDateString()} • 
                      Documents: {application.documents.length} submitted
                    </div>
                  </div>
                  <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                    <i className="fas fa-eye"></i> Review
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-container">
            <h3 style={{ marginBottom: '20px' }}>Academic Overview</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ textAlign: 'center', padding: '15px', background: 'rgba(76, 201, 240, 0.1)', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>
                  {analytics.admissionStats?.totalApplications?.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>Total Applications</div>
              </div>
              <div style={{ textAlign: 'center', padding: '15px', background: 'rgba(72, 187, 120, 0.1)', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--success)' }}>
                  {analytics.admissionStats?.admitted}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>Students Admitted</div>
              </div>
              <div style={{ textAlign: 'center', padding: '15px', background: 'rgba(255, 193, 7, 0.1)', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--warning)' }}>
                  {analytics.admissionStats?.acceptanceRate}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>Acceptance Rate</div>
              </div>
              <div style={{ textAlign: 'center', padding: '15px', background: 'rgba(108, 117, 125, 0.1)', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--gray)' }}>
                  {institutionData?.stats?.faculties}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>Academic Faculties</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionDashboard;