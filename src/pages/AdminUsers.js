import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getInstitutions, getCourses, getStudentApplications } from '../services/realtimeDb';

const AdminUsers = ({ user, userProfile }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock user data
  const mockUsers = [
    { 
      id: 1, 
      name: 'John Student', 
      email: 'john@student.ls', 
      role: 'student', 
      status: 'active',
      joinDate: '2024-01-15',
      lastActive: '2024-03-20',
      institution: 'National University of Lesotho'
    },
    { 
      id: 2, 
      name: 'NUL Administration', 
      email: 'admin@nul.ls', 
      role: 'institute', 
      status: 'active',
      joinDate: '2024-01-10',
      lastActive: '2024-03-20',
      institution: 'National University of Lesotho'
    },
    { 
      id: 3, 
      name: 'Tech Corp HR', 
      email: 'hr@techcorp.ls', 
      role: 'company', 
      status: 'pending',
      joinDate: '2024-03-18',
      lastActive: '2024-03-18',
      institution: 'Tech Corporation'
    },
    { 
      id: 4, 
      name: 'Sarah Educator', 
      email: 'sarah@limkokwing.ls', 
      role: 'institute', 
      status: 'active',
      joinDate: '2024-02-22',
      lastActive: '2024-03-19',
      institution: 'Limkokwing University'
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (user && userProfile?.role === 'admin') {
        try {
          // In a real app, you would fetch users from your database
          setUsers(mockUsers);
        } catch (error) {
          console.error('Error fetching data:', error);
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

  const approveUser = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: 'active' } : user
    ));
    showNotification('User approved successfully!', 'success');
  };

  const suspendUser = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: 'suspended' } : user
    ));
    showNotification('User suspended successfully!', 'warning');
  };

  const activateUser = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: 'active' } : user
    ));
    showNotification('User activated successfully!', 'success');
  };

  const showNotification = (message, type = 'info') => {
    alert(message);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'var(--success)', icon: 'fa-check-circle' },
      pending: { color: 'var(--warning)', icon: 'fa-clock' },
      suspended: { color: 'var(--danger)', icon: 'fa-ban' }
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

  const getRoleBadge = (role) => {
    const roleConfig = {
      student: { color: 'var(--primary)', icon: 'fa-user-graduate' },
      institute: { color: 'var(--secondary)', icon: 'fa-university' },
      company: { color: 'var(--accent)', icon: 'fa-building' },
      admin: { color: 'var(--danger)', icon: 'fa-shield-alt' }
    };
    
    const config = roleConfig[role] || roleConfig.student;
    
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
        {role.charAt(0).toUpperCase() + role.slice(1)}
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
        <p>This page is exclusively available for platform administrators.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: '50px 0', textAlign: 'center' }}>
        <div style={{ color: 'var(--primary)', fontSize: '3rem', marginBottom: '20px' }}>
          <i className="fas fa-spinner fa-spin"></i>
        </div>
        <h3>Loading User Data...</h3>
      </div>
    );
  }

  const stats = {
    totalStudents: users.filter(user => user.role === 'student').length,
    totalInstitutions: users.filter(user => user.role === 'institute').length,
    totalCompanies: users.filter(user => user.role === 'company').length,
    pendingApprovals: users.filter(user => user.status === 'pending').length,
    totalUsers: users.length
  };

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>User Management</h1>
          <p>Monitor and manage all platform users</p>
        </div>

        {/* User Statistics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '8px' }}>{stats.totalStudents}</div>
            <div style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>Student Accounts</div>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--secondary)', marginBottom: '8px' }}>{stats.totalInstitutions}</div>
            <div style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>Institution Partners</div>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent)', marginBottom: '8px' }}>{stats.totalCompanies}</div>
            <div style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>Corporate Partners</div>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--warning)', marginBottom: '8px' }}>{stats.pendingApprovals}</div>
            <div style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>Pending Approvals</div>
          </div>
        </div>

        <div className="form-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h3>User Management & Analytics</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-outline">
                <i className="fas fa-download"></i> Export Data
              </button>
              <button className="btn btn-primary">
                <i className="fas fa-user-plus"></i> Add User
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--primary)' }}>
                  <th style={{ textAlign: 'left', padding: '15px', fontWeight: '600', color: 'var(--secondary)' }}>User Profile</th>
                  <th style={{ textAlign: 'left', padding: '15px', fontWeight: '600', color: 'var(--secondary)' }}>Role & Affiliation</th>
                  <th style={{ textAlign: 'left', padding: '15px', fontWeight: '600', color: 'var(--secondary)' }}>Account Status</th>
                  <th style={{ textAlign: 'left', padding: '15px', fontWeight: '600', color: 'var(--secondary)' }}>Last Active</th>
                  <th style={{ textAlign: 'left', padding: '15px', fontWeight: '600', color: 'var(--secondary)' }}>Administrative Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #f0f0f0', transition: 'background 0.3s ease' }} className="hover-effect">
                    <td style={{ padding: '15px' }}>
                      <div>
                        <strong style={{ color: 'var(--secondary)', display: 'block', marginBottom: '4px' }}>{user.name}</strong>
                        <div style={{ fontSize: '0.85rem', color: 'var(--gray)', marginBottom: '4px' }}>{user.email}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--light-gray)' }}>
                          Joined: {new Date(user.joinDate).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {getRoleBadge(user.role)}
                        {user.institution && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>
                            {user.institution}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '15px' }}>
                      {getStatusBadge(user.status)}
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--gray)' }}>
                        {new Date(user.lastActive).toLocaleDateString()}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--light-gray)' }}>
                        {new Date(user.lastActive).toLocaleTimeString()}
                      </div>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {user.status === 'pending' && (
                          <button 
                            className="btn btn-success"
                            onClick={() => approveUser(user.id)}
                            style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <i className="fas fa-check"></i> Approve
                          </button>
                        )}
                        {user.status === 'suspended' && (
                          <button 
                            className="btn btn-success"
                            onClick={() => activateUser(user.id)}
                            style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <i className="fas fa-play"></i> Activate
                          </button>
                        )}
                        {user.status === 'active' && (
                          <button 
                            className="btn btn-warning"
                            onClick={() => suspendUser(user.id)}
                            style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <i className="fas fa-pause"></i> Suspend
                          </button>
                        )}
                        <button 
                          className="btn btn-outline"
                          style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button 
                          className="btn btn-danger"
                          style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <i className="fas fa-trash"></i> Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;