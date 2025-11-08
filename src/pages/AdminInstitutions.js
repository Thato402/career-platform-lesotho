import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getInstitutions } from '../services/realtimeDb';

const AdminInstitutions = ({ user, userProfile }) => {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock institutions data
  const mockInstitutions = [
    {
      id: 1,
      name: 'National University of Lesotho',
      location: 'Roma, Lesotho',
      description: 'Premier higher education institution offering diverse academic programs and research opportunities.',
      coursesCount: 45,
      studentsCount: 8500,
      successRate: 92
    },
    {
      id: 2,
      name: 'Limkokwing University',
      location: 'Maseru, Lesotho',
      description: 'Innovative university focusing on creative technology and entrepreneurship education.',
      coursesCount: 28,
      studentsCount: 3200,
      successRate: 88
    },
    {
      id: 3,
      name: 'Botho University',
      location: 'Maseru, Lesotho',
      description: 'Leading private university with strong industry partnerships and career-focused programs.',
      coursesCount: 32,
      studentsCount: 2800,
      successRate: 90
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (user && userProfile?.role === 'admin') {
        try {
          const institutionsData = await getInstitutions();
          setInstitutions(institutionsData || mockInstitutions);
        } catch (error) {
          console.error('Error fetching institutions:', error);
          setInstitutions(mockInstitutions);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, userProfile]);

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
        <h3>Loading Institutions...</h3>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Educational Institution Management</h1>
          <p>Manage educational institutions and partners</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h3>Partner Institutions</h3>
          <button className="btn btn-primary">
            <i className="fas fa-plus"></i> Add Institution
          </button>
        </div>

        <div className="features-grid">
          {institutions.map(institution => (
            <div key={institution.id} className="feature-card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ 
                position: 'absolute', 
                top: '0', 
                right: '0', 
                background: 'var(--primary)', 
                color: 'white', 
                padding: '4px 12px', 
                borderRadius: '0 0 0 12px',
                fontSize: '0.8rem',
                fontWeight: '600'
              }}>
                Partner
              </div>
              
              <h3 style={{ color: 'var(--secondary)', marginBottom: '10px' }}>{institution.name}</h3>
              <p style={{ color: 'var(--primary)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-map-marker-alt"></i> {institution.location}
              </p>
              <p style={{ color: 'var(--gray)', fontSize: '0.9rem', lineHeight: '1.5' }}>{institution.description}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0', padding: '15px 0', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>{institution.coursesCount}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>Courses</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--secondary)' }}>{institution.studentsCount}+</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>Students</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--accent)' }}>{institution.successRate}%</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>Success Rate</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button className="btn btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <i className="fas fa-edit"></i> Manage
                </button>
                <button className="btn btn-outline" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <i className="fas fa-chart-bar"></i> Analytics
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminInstitutions;