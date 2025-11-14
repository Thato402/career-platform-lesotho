import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getInstitutions } from '../services/realtimeDb';

const AdminInstitutions = ({ user, userProfile }) => {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock institutions data with official websites
  const mockInstitutions = [
    {
      id: 1,
      name: 'National University of Lesotho',
      location: 'Roma, Lesotho',
      description: 'Premier higher education institution offering diverse academic programs and research opportunities.',
      website: 'https://www.nul.ls',
      contactEmail: 'admissions@nul.ls',
      phone: '+266 2234 0000'
    },
    {
      id: 2,
      name: 'Limkokwing University',
      location: 'Maseru, Lesotho',
      description: 'Innovative university focusing on creative technology and entrepreneurship education.',
      website: 'https://www.limkokwing.ls',
      contactEmail: 'info@limkokwing.ls',
      phone: '+266 2231 2135'
    },
    {
      id: 3,
      name: 'Botho University',
      location: 'Maseru, Lesotho',
      description: 'Leading private university with strong industry partnerships and career-focused programs.',
      website: 'https://www.botho.ls',
      contactEmail: 'admissions@botho.ls',
      phone: '+266 2232 5757'
    },
    {
      id: 4,
      name: 'Lesotho College of Education',
      location: 'Maseru, Lesotho',
      description: 'The premier teacher training institution in Lesotho, dedicated to producing qualified educators.',
      website: 'https://www.lce.ac.ls',
      contactEmail: 'registrar@lce.ac.ls',
      phone: '+266 2232 3561'
    },
    {
      id: 5,
      name: 'Lesotho Agricultural College',
      location: 'Maseru, Lesotho',
      description: 'Specialized institution focused on agricultural sciences, agribusiness, and rural development.',
      website: 'https://www.lac.edu.ls',
      contactEmail: 'admissions@lac.edu.ls',
      phone: '+266 2231 0456'
    },
    {
      id: 6,
      name: 'Lesotho Institute of Public Administration',
      location: 'Maseru, Lesotho',
      description: 'Government institution providing training and development for public servants.',
      website: 'https://www.lipam.org.ls',
      contactEmail: 'info@lipam.org.ls',
      phone: '+266 2231 2789'
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

  const handleViewDetails = (website) => {
    if (website) {
      window.open(website, '_blank', 'noopener,noreferrer');
    } else {
      alert('Website not available for this institution');
    }
  };

  const handleContact = (institution) => {
    if (institution.contactEmail) {
      window.location.href = `mailto:${institution.contactEmail}`;
    } else {
      alert('Contact information not available');
    }
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
          <h3>Partner Institutions ({institutions.length})</h3>
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
              <p style={{ color: 'var(--gray)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '20px' }}>
                {institution.description}
              </p>
              
              {/* Contact Information */}
              <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(76, 201, 240, 0.1)', borderRadius: 'var(--radius)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <i className="fas fa-globe" style={{ color: 'var(--primary)' }}></i>
                  <span style={{ fontSize: '0.9rem' }}>
                    {institution.website ? (
                      <a 
                        href={institution.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: 'var(--primary)', textDecoration: 'none' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Official Website
                      </a>
                    ) : (
                      'Website not available'
                    )}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <i className="fas fa-envelope" style={{ color: 'var(--secondary)' }}></i>
                  <span style={{ fontSize: '0.9rem' }}>
                    {institution.contactEmail || 'Email not available'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fas fa-phone" style={{ color: 'var(--accent)' }}></i>
                  <span style={{ fontSize: '0.9rem' }}>
                    {institution.phone || 'Phone not available'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  onClick={() => handleViewDetails(institution.website)}
                >
                  <i className="fas fa-external-link-alt"></i> View Details
                </button>
                <button 
                  className="btn btn-outline" 
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  onClick={() => handleContact(institution)}
                >
                  <i className="fas fa-envelope"></i> Contact
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {institutions.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px', color: 'var(--gray)' }}>
            <i className="fas fa-university" style={{ fontSize: '4rem', marginBottom: '20px' }}></i>
            <h3>No Institutions Found</h3>
            <p>Get started by adding the first educational institution to the platform.</p>
            <button className="btn btn-primary" style={{ marginTop: '20px' }}>
              <i className="fas fa-plus"></i> Add First Institution
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInstitutions;
