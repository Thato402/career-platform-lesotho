import React, { useState, useEffect } from 'react';
import { getInstitutions } from '../services/realtimeDb';

const Institutions = () => {
  // ... component code remains the same, just change the import
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for institutions
    const mockInstitutions = [
      {
        id: 1,
        name: 'National University of Lesotho',
        location: 'Roma, Maseru',
        description: 'The premier institution of higher learning in Lesotho offering diverse academic programs.',
        coursesCount: 45,
        studentsCount: 8000
      },
      {
        id: 2,
        name: 'Limkokwing University',
        location: 'Maseru',
        description: 'A global university with focus on creativity, innovation and technology.',
        coursesCount: 32,
        studentsCount: 3500
      },
      {
        id: 3,
        name: 'Botho University',
        location: 'Maseru',
        description: 'Committed to providing quality education with industry-relevant programs.',
        coursesCount: 28,
        studentsCount: 2800
      }
    ];

    setTimeout(() => {
      setInstitutions(mockInstitutions);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ padding: '50px 0', textAlign: 'center' }}>
        <div className="spinner"></div>
        <p>Loading institutions...</p>
      </div>
    );
  }

  return (
    <div className="features" style={{ padding: '50px 0' }}>
      <div className="container">
        <div className="section-title">
          <h2>Higher Learning Institutions in Lesotho</h2>
          <p>Discover the best educational opportunities across the country</p>
        </div>

        <div className="features-grid">
          {institutions.map(institution => (
            <div key={institution.id} className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-university"></i>
              </div>
              <h3>{institution.name}</h3>
              <p style={{ marginBottom: '15px', color: 'var(--primary)' }}>
                <i className="fas fa-map-marker-alt"></i> {institution.location}
              </p>
              <p style={{ marginBottom: '20px' }}>{institution.description}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <strong>{institution.coursesCount}</strong>
                  <div style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>Courses</div>
                </div>
                <div>
                  <strong>{institution.studentsCount.toLocaleString()}+</strong>
                  <div style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>Students</div>
                </div>
              </div>
              
              <button className="btn btn-primary" style={{ width: '100%' }}>
                <i className="fas fa-eye"></i> View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Institutions;