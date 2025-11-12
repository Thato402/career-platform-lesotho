import React, { useState, useEffect } from 'react';
import { getInstitutions } from '../services/realtimeDb';

const Institutions = () => {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const institutionsData = await getInstitutions();
        setInstitutions(institutionsData);
      } catch (error) {
        console.error('Error fetching institutions:', error);
        // Fallback to mock data if API fails
        const mockInstitutions = getMockInstitutions();
        setInstitutions(mockInstitutions);
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutions();
  }, []);

  // Filter institutions based on search term
  const filteredInstitutions = institutions.filter(institution =>
    institution.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    institution.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    institution.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInstitutionTypeColor = (type) => {
    switch (type) {
      case 'Public University': return '#2ecc71';
      case 'Private University': return '#3498db';
      case 'Public College': return '#e74c3c';
      case 'Private College': return '#9b59b6';
      case 'Government Institute': return '#f39c12';
      default: return '#7f8c8d';
    }
  };

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

        {/* Search Bar */}
        <div style={{ marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
          <input
            type="text"
            placeholder="Search institutions by name, location, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '15px 20px',
              border: '2px solid #e9ecef',
              borderRadius: '10px',
              fontSize: '16px',
              transition: 'border-color 0.3s ease'
            }}
          />
        </div>

        {/* Institutions Count */}
        <div style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--gray)' }}>
          Showing {filteredInstitutions.length} of {institutions.length} institutions
        </div>

        <div className="features-grid">
          {filteredInstitutions.map(institution => (
            <div key={institution.id} className="feature-card" style={{ position: 'relative' }}>
              {/* Institution Type Badge */}
              <div 
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: getInstitutionTypeColor(institution.type),
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}
              >
                {institution.type}
              </div>

              <div className="feature-icon">
                <i className="fas fa-university"></i>
              </div>
              
              <h3>{institution.name}</h3>
              
              <p style={{ marginBottom: '15px', color: 'var(--primary)' }}>
                <i className="fas fa-map-marker-alt"></i> {institution.location}
              </p>
              
              <p style={{ marginBottom: '20px', minHeight: '60px' }}>
                {institution.description}
              </p>
              
              {/* Contact Information */}
              <div style={{ marginBottom: '20px', fontSize: '0.9rem' }}>
                {institution.contactEmail && (
                  <p style={{ margin: '5px 0' }}>
                    <i className="fas fa-envelope"></i> {institution.contactEmail}
                  </p>
                )}
                {institution.phone && (
                  <p style={{ margin: '5px 0' }}>
                    <i className="fas fa-phone"></i> {institution.phone}
                  </p>
                )}
                {institution.established && (
                  <p style={{ margin: '5px 0', color: 'var(--gray)' }}>
                    <i className="fas fa-calendar-alt"></i> Est. {institution.established}
                  </p>
                )}
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '20px',
                padding: '15px',
                background: '#f8f9fa',
                borderRadius: '8px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <strong style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>
                    {institution.coursesCount}
                  </strong>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>Courses</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <strong style={{ fontSize: '1.2rem', color: 'var(--success)' }}>
                    {institution.studentsCount?.toLocaleString()}+
                  </strong>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>Students</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-primary" style={{ flex: 1 }}>
                  <i className="fas fa-eye"></i> View Details
                </button>
                <button 
                  className="btn btn-outline" 
                  style={{ width: '50px' }}
                  onClick={() => window.open(institution.website, '_blank')}
                  title="Visit Website"
                >
                  <i className="fas fa-external-link-alt"></i>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredInstitutions.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px', color: 'var(--gray)' }}>
            <i className="fas fa-search" style={{ fontSize: '3rem', marginBottom: '20px' }}></i>
            <h3>No institutions found</h3>
            <p>Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Mock data fallback (same as your database)
const getMockInstitutions = () => {
  return [
    {
      id: '1',
      name: 'National University of Lesotho (NUL)',
      location: 'Roma, Maseru',
      description: 'The premier institution of higher learning in Lesotho offering diverse academic programs across multiple faculties. Established in 1945, it is the oldest and largest university in Lesotho.',
      coursesCount: 45,
      studentsCount: 8000,
      contactEmail: 'admissions@nul.ls',
      phone: '+266 2234 0000',
      website: 'https://www.nul.ls',
      established: '1945',
      type: 'Public University'
    },
    {
      id: '2',
      name: 'Limkokwing University of Creative Technology',
      location: 'Maseru',
      description: 'A global university with focus on creativity, innovation and technology. Known for its industry-relevant programs and modern teaching methods.',
      coursesCount: 32,
      studentsCount: 3500,
      contactEmail: 'info@limkokwing.ls',
      phone: '+266 2231 2135',
      website: 'https://www.limkokwing.ls',
      established: '2008',
      type: 'Private University'
    },
    {
      id: '3',
      name: 'Botho University',
      location: 'Maseru',
      description: 'Committed to providing quality education with industry-relevant programs. Part of an international network with campuses across Southern Africa.',
      coursesCount: 28,
      studentsCount: 2800,
      contactEmail: 'admissions@botho.ls',
      phone: '+266 2232 5757',
      website: 'https://www.botho.ls',
      established: '1997',
      type: 'Private University'
    },
    {
      id: '4',
      name: 'Lesotho College of Education',
      location: 'Maseru',
      description: 'The premier teacher training institution in Lesotho, dedicated to producing qualified educators for primary and secondary schools nationwide.',
      coursesCount: 15,
      studentsCount: 1200,
      contactEmail: 'registrar@lce.ac.ls',
      phone: '+266 2232 3561',
      website: 'https://www.lce.ac.ls',
      established: '1975',
      type: 'Public College'
    },
    {
      id: '5',
      name: 'Lesotho Agricultural College',
      location: 'Maseru',
      description: 'Specialized institution focused on agricultural sciences, agribusiness, and rural development. Contributing to food security and sustainable farming.',
      coursesCount: 12,
      studentsCount: 800,
      contactEmail: 'admissions@lac.edu.ls',
      phone: '+266 2231 0456',
      website: 'https://www.lac.edu.ls',
      established: '1955',
      type: 'Public College'
    },
    {
      id: '6',
      name: 'Lesotho Institute of Public Administration (LIPAM)',
      location: 'Maseru',
      description: 'Government institution providing training and development for public servants and offering degree programs in public administration and management.',
      coursesCount: 18,
      studentsCount: 1500,
      contactEmail: 'info@lipam.org.ls',
      phone: '+266 2231 2789',
      website: 'https://www.lipam.org.ls',
      established: '1980',
      type: 'Government Institute'
    },
    {
      id: '7',
      name: 'Centre for Accounting Studies (CAS)',
      location: 'Maseru',
      description: 'Specialized institution offering professional accounting qualifications and business-related degree programs. Recognized for producing qualified accountants.',
      coursesCount: 10,
      studentsCount: 600,
      contactEmail: 'admissions@cas.ac.ls',
      phone: '+266 2231 2345',
      website: 'https://www.cas.ac.ls',
      established: '1990',
      type: 'Private College'
    },
    {
      id: '8',
      name: 'Lesotho Nursing School',
      location: 'Queen Elizabeth II Hospital, Maseru',
      description: 'Leading institution for nursing and midwifery education, producing healthcare professionals to serve in hospitals and clinics across Lesotho.',
      coursesCount: 8,
      studentsCount: 400,
      contactEmail: 'principal@nursingschool.ls',
      phone: '+266 2231 2678',
      website: 'https://www.lesothonursing.edu.ls',
      established: '1963',
      type: 'Public College'
    }
  ];
};

export default Institutions;
