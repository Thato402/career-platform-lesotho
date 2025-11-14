import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getInstitutions, getCourses, getStudentApplications } from '../services/realtimeDb';

const AdminDashboard = ({ user, userProfile }) => {
  const [institutions, setInstitutions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [systemMetrics, setSystemMetrics] = useState({
    uptime: '99.98%',
    responseTime: '124ms',
    activeSessions: '1,247',
    serverLoad: '23%'
  });

  const navigate = useNavigate();

  // Mock data
  const mockInstitutions = [
    {
      id: 1,
      name: 'National University of Lesotho',
      location: 'Roma, Lesotho',
      description: 'Premier higher education institution...',
    }
  ];

  const mockApplications = [
    {
      id: 1,
      studentName: 'Tumelo Molapo',
      courseName: 'Computer Science',
      status: 'pending',
      applicationDate: '2024-03-15'
    }
  ];

  const mockUsers = [
    { 
      id: 1, 
      name: 'Pule Student', 
      email: 'pule@student.ls', 
      role: 'student', 
      status: 'active',
      joinDate: '2024-01-15',
      lastActive: '2024-03-20',
      institution: 'National University of Lesotho'
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (user && userProfile?.role === 'admin') {
        try {
          const [institutionsData, coursesData, applicationsData] = await Promise.all([
            getInstitutions(),
            getCourses(),
            getStudentApplications()
          ]);
          setInstitutions(institutionsData || mockInstitutions);
          setCourses(coursesData || []);
          setApplications(applicationsData || mockApplications);
          setUsers(mockUsers);
        } catch (error) {
          console.error('Error fetching data:', error);
          setInstitutions(mockInstitutions);
          setApplications(mockApplications);
          setUsers(mockUsers);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, userProfile]);

  // Quick action handlers - now navigate to specific pages
  const handleQuickAction = (page) => {
    navigate(`/admin/${page}`);
  };

  const getStats = () => {
    const totalStudents = users.filter(user => user.role === 'student').length;
    const totalInstitutionUsers = users.filter(user => user.role === 'institute').length;
    const totalCompanies = users.filter(user => user.role === 'company').length;
    
    return {
      totalInstitutions: institutions?.length || 0,
      totalCourses: courses?.length || 0,
      totalApplications: applications?.length || 0,
      pendingApplications: applications?.filter(app => app.status === 'pending').length || 0,
      totalUsers: users.length,
      pendingApprovals: users.filter(user => user.status === 'pending').length,
      totalStudents,
      totalInstitutionUsers,
      totalCompanies
    };
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'var(--success)', icon: 'fa-check-circle' },
      pending: { color: 'var(--warning)', icon: 'fa-clock' },
      suspended: { color: 'var(--danger)', icon: 'fa-ban' },
      admitted: { color: 'var(--success)', icon: 'fa-graduation-cap' },
      rejected: { color: 'var(--danger)', icon: 'fa-times-circle' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
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
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (userProfile?.role !== 'admin') {
    return (
      <div className="container" style={{ padding: '50px 0', textAlign: 'center' }}>
        <div style={{ color: 'var(--danger)', fontSize: '4rem', marginBottom: '20px' }}>
          <i className="fas fa-shield-alt"></i>
        </div>
        <h2>Administrative Access Required</h2>
        <p>This dashboard is exclusively available for platform administrators with appropriate privileges.</p>
        <button 
          className="btn btn-primary" 
          onClick={() => window.history.back()}
          style={{ marginTop: '20px' }}
        >
          <i className="fas fa-arrow-left"></i> Return to Previous Page
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: '50px 0', textAlign: 'center' }}>
        <div style={{ color: 'var(--primary)', fontSize: '3rem', marginBottom: '20px' }}>
          <i className="fas fa-spinner fa-spin"></i>
        </div>
        <h3>Loading Admin Dashboard...</h3>
      </div>
    );
  }

  const stats = getStats();

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
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
            border-left: 4px solid var(--primary);
            cursor: pointer;
            border: 1px solid #e0e0e0;
          }
          
          .quick-action-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.12);
          }

          .explore-button {
            margin-top: 10px;
            padding: 8px 16px;
            background: var(--primary);
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 0.8rem;
            cursor: pointer;
          }
        `}
      </style>
      
      <div className="container">
        <div className="dashboard-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h1>Administrative Dashboard</h1>
              <p>Comprehensive platform management and real-time monitoring system</p>
            </div>
            <div style={{ 
              background: 'rgba(76, 201, 240, 0.1)', 
              padding: '15px 20px', 
              borderRadius: '12px',
              border: '1px solid rgba(76, 201, 240, 0.2)'
            }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--gray)', marginBottom: '5px' }}>Last System Update</div>
              <div style={{ fontWeight: '600', color: 'var(--secondary)' }}>
                {new Date().toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Bar - Now navigates to specific pages */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px', 
          marginBottom: '30px' 
        }}>
          <div className="quick-action-card" onClick={() => handleQuickAction('users')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
              <div style={{ 
                background: 'var(--primary)', 
                width: '50px', 
                height: '50px', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.2rem'
              }}>
                <i className="fas fa-users-cog"></i>
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 5px 0', color: 'var(--secondary)' }}>User Management</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--gray)' }}>Monitor registered users</p>
              </div>
            </div>
            <button className="explore-button" onClick={(e) => { e.stopPropagation(); handleQuickAction('users'); }}>
              <i className="fas fa-arrow-right"></i> Explore
            </button>
          </div>
          
          <div className="quick-action-card" onClick={() => handleQuickAction('institutions')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
              <div style={{ 
                background: 'var(--secondary)', 
                width: '50px', 
                height: '50px', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.2rem'
              }}>
                <i className="fas fa-university"></i>
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 5px 0', color: 'var(--secondary)' }}>Institutions</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--gray)' }}>Manage educational partners</p>
              </div>
            </div>
            <button className="explore-button" onClick={(e) => { e.stopPropagation(); handleQuickAction('institutions'); }}>
              <i className="fas fa-arrow-right"></i> Explore
            </button>
          </div>
          
          <div className="quick-action-card" onClick={() => handleQuickAction('reports')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
              <div style={{ 
                background: 'var(--accent)', 
                width: '50px', 
                height: '50px', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.2rem'
              }}>
                <i className="fas fa-chart-network"></i>
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 5px 0', color: 'var(--secondary)' }}>Analytics</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--gray)' }}>Platform performance insights</p>
              </div>
            </div>
            <button className="explore-button" onClick={(e) => { e.stopPropagation(); handleQuickAction('reports'); }}>
              <i className="fas fa-arrow-right"></i> Explore
            </button>
          </div>
          
          <div className="quick-action-card" onClick={() => handleQuickAction('settings')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
              <div style={{ 
                background: 'var(--success)', 
                width: '50px', 
                height: '50px', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.2rem'
              }}>
                <i className="fas fa-cog"></i>
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 5px 0', color: 'var(--secondary)' }}>System Settings</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--gray)' }}>Platform configuration</p>
              </div>
            </div>
            <button className="explore-button" style={{ background: 'var(--success)' }} onClick={(e) => { e.stopPropagation(); handleQuickAction('settings'); }}>
              <i className="fas fa-arrow-right"></i> Configure
            </button>
          </div>
        </div>

        {/* Overview Content Only */}
        <div>
          <h2>Platform Overview</h2>
          
          {/* Enhanced Metrics Grid */}
          <div className="features-grid" style={{ marginBottom: '30px' }}>
            <div className="metric-card system-health">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '2rem', fontWeight: '700' }}>{systemMetrics.uptime}</h3>
                  <p style={{ margin: 0, opacity: 0.9 }}>System Uptime</p>
                </div>
                <i className="fas fa-server" style={{ fontSize: '2rem', opacity: 0.8 }}></i>
              </div>
              <div style={{ marginTop: '15px', fontSize: '0.9rem', opacity: 0.9 }}>
                <i className="fas fa-trend-up"></i> 30d reliability
              </div>
            </div>
            
            <div className="metric-card performance-metric">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '2rem', fontWeight: '700' }}>{systemMetrics.responseTime}</h3>
                  <p style={{ margin: 0, opacity: 0.9 }}>Avg Response Time</p>
                </div>
                <i className="fas fa-bolt" style={{ fontSize: '2rem', opacity: 0.8 }}></i>
              </div>
              <div style={{ marginTop: '15px', fontSize: '0.9rem', opacity: 0.9 }}>
                <i className="fas fa-check-circle"></i> Optimal performance
              </div>
            </div>
            
            <div className="metric-card user-growth">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '2rem', fontWeight: '700' }}>+24%</h3>
                  <p style={{ margin: 0, opacity: 0.9 }}>User Growth</p>
                </div>
                <i className="fas fa-chart-line" style={{ fontSize: '2rem', opacity: 0.8 }}></i>
              </div>
              <div style={{ marginTop: '15px', fontSize: '0.9rem', opacity: 0.9 }}>
                <i className="fas fa-users"></i> This month
              </div>
            </div>
            
            <div className="metric-card platform-activity">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '2rem', fontWeight: '700' }}>{systemMetrics.activeSessions}</h3>
                  <p style={{ margin: 0, opacity: 0.9 }}>Active Sessions</p>
                </div>
                <i className="fas fa-globe" style={{ fontSize: '2rem', opacity: 0.8 }}></i>
              </div>
              <div style={{ marginTop: '15px', fontSize: '0.9rem', opacity: 0.9 }}>
                <i className="fas fa-eye"></i> Real-time monitoring
              </div>
            </div>
          </div>

          {/* Platform Statistics */}
          <div className="features-grid" style={{ marginBottom: '30px' }}>
            <div className="feature-card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <i className="fas fa-university" style={{ fontSize: '2.5rem', marginBottom: '15px', opacity: 0.9 }}></i>
              <h3 style={{ fontSize: '2.5rem', margin: '10px 0', fontWeight: '700' }}>{stats.totalInstitutions}</h3>
              <p style={{ margin: 0, opacity: 0.9 }}>Partner Institutions</p>
              <div style={{ marginTop: '10px', fontSize: '0.9rem', opacity: 0.8 }}>
                Educational partners onboarded
              </div>
            </div>
            
            <div className="feature-card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
              <i className="fas fa-graduation-cap" style={{ fontSize: '2.5rem', marginBottom: '15px', opacity: 0.9 }}></i>
              <h3 style={{ fontSize: '2.5rem', margin: '10px 0', fontWeight: '700' }}>{stats.totalCourses}</h3>
              <p style={{ margin: 0, opacity: 0.9 }}>Available Courses</p>
              <div style={{ marginTop: '10px', fontSize: '0.9rem', opacity: 0.8 }}>
                Career-focused programs
              </div>
            </div>
            
            <div className="feature-card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
              <i className="fas fa-file-contract" style={{ fontSize: '2.5rem', marginBottom: '15px', opacity: 0.9 }}></i>
              <h3 style={{ fontSize: '2.5rem', margin: '10px 0', fontWeight: '700' }}>{stats.totalApplications}</h3>
              <p style={{ margin: 0, opacity: 0.9 }}>Total Applications</p>
              <div style={{ marginTop: '10px', fontSize: '0.9rem', opacity: 0.8 }}>
                {stats.pendingApplications} pending review
              </div>
            </div>
            
            <div className="feature-card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
              <i className="fas fa-users" style={{ fontSize: '2.5rem', marginBottom: '15px', opacity: 0.9 }}></i>
              <h3 style={{ fontSize: '2.5rem', margin: '10px 0', fontWeight: '700' }}>{stats.totalUsers}</h3>
              <p style={{ margin: 0, opacity: 0.9 }}>Registered Users</p>
              <div style={{ marginTop: '10px', fontSize: '0.9rem', opacity: 0.8 }}>
                {stats.pendingApprovals} awaiting approval
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '40px' }}>
            <div className="form-container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}>Recent Platform Activity</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600' }}>
                  Last 24 hours
                </span>
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {applications.slice(0, 6).map(application => (
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
                        Applied to <strong>{application.courseName}</strong>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--light-gray)', marginTop: '4px' }}>
                        {new Date(application.applicationDate).toLocaleDateString()}
                      </div>
                    </div>
                    <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                      <i className="fas fa-eye"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-container">
              <h3 style={{ marginBottom: '20px' }}>System Health & Performance</h3>
              {/* System health content remains here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
