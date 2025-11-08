import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const InstitutionProfile = ({ user, userProfile }) => {
  const [institutionData, setInstitutionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');

  const mockInstitutionData = {
    general: {
      name: 'National University of Lesotho',
      established: '1945',
      accreditation: 'Fully Accredited',
      type: 'Public University',
      motto: 'Excellence and Innovation',
      vision: 'To be a premier institution of higher learning in Africa',
      mission: 'To provide quality education, research, and community service'
    },
    contact: {
      email: 'admissions@nul.ls',
      phone: '+266 22340601',
      address: 'P.O. Roma 180, Roma, Lesotho',
      website: 'www.nul.ls',
      socialMedia: {
        facebook: 'facebook.com/nul',
        twitter: 'twitter.com/nul_lesotho',
        linkedin: 'linkedin.com/school/nul'
      }
    },
    academic: {
      faculties: 7,
      departments: 35,
      programs: 85,
      researchCenters: 12,
      libraryCollections: '500,000+ volumes',
      studentFacultyRatio: '18:1'
    },
    settings: {
      applicationFee: '200 LSL',
      admissionDeadline: '2024-08-31',
      academicCalendar: 'Semester System',
      gradingScale: '4.0 Scale',
      language: 'English'
    }
  };

  useEffect(() => {
    if (user && userProfile?.role === 'institute') {
      setInstitutionData(mockInstitutionData);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user, userProfile]);

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
        <p>This page is exclusively available for institutional administrators.</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Institution Profile & Settings</h1>
          <p>Manage your institution's profile and configuration</p>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid #e0e0e0' }}>
            <button 
              className={`btn ${activeTab === 'general' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('general')}
              style={{ border: 'none', borderBottom: activeTab === 'general' ? '2px solid var(--primary)' : 'none' }}
            >
              General Information
            </button>
            <button 
              className={`btn ${activeTab === 'contact' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('contact')}
              style={{ border: 'none', borderBottom: activeTab === 'contact' ? '2px solid var(--primary)' : 'none' }}
            >
              Contact Details
            </button>
            <button 
              className={`btn ${activeTab === 'academic' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('academic')}
              style={{ border: 'none', borderBottom: activeTab === 'academic' ? '2px solid var(--primary)' : 'none' }}
            >
              Academic Structure
            </button>
            <button 
              className={`btn ${activeTab === 'settings' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('settings')}
              style={{ border: 'none', borderBottom: activeTab === 'settings' ? '2px solid var(--primary)' : 'none' }}
            >
              System Settings
            </button>
          </div>
        </div>

        <div className="form-container">
          {activeTab === 'general' && (
            <div>
              <h3 style={{ marginBottom: '20px' }}>General Information</h3>
              <div style={{ display: 'grid', gap: '20px' }}>
                <div className="form-group">
                  <label>Institution Name</label>
                  <input type="text" value={institutionData?.general?.name} readOnly />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label>Established</label>
                    <input type="text" value={institutionData?.general?.established} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Accreditation Status</label>
                    <input type="text" value={institutionData?.general?.accreditation} readOnly />
                  </div>
                </div>
                <div className="form-group">
                  <label>Institution Motto</label>
                  <input type="text" value={institutionData?.general?.motto} readOnly />
                </div>
                <div className="form-group">
                  <label>Vision Statement</label>
                  <textarea rows="3" value={institutionData?.general?.vision} readOnly />
                </div>
                <div className="form-group">
                  <label>Mission Statement</label>
                  <textarea rows="3" value={institutionData?.general?.mission} readOnly />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div>
              <h3 style={{ marginBottom: '20px' }}>Contact Details</h3>
              <div style={{ display: 'grid', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" value={institutionData?.contact?.email} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="text" value={institutionData?.contact?.phone} readOnly />
                  </div>
                </div>
                <div className="form-group">
                  <label>Physical Address</label>
                  <textarea rows="2" value={institutionData?.contact?.address} readOnly />
                </div>
                <div className="form-group">
                  <label>Website</label>
                  <input type="url" value={institutionData?.contact?.website} readOnly />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'academic' && (
            <div>
              <h3 style={{ marginBottom: '20px' }}>Academic Structure</h3>
              <div className="features-grid">
                <div className="feature-card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)' }}>
                    {institutionData?.academic?.faculties}
                  </div>
                  <div>Faculties</div>
                </div>
                <div className="feature-card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--secondary)' }}>
                    {institutionData?.academic?.departments}
                  </div>
                  <div>Departments</div>
                </div>
                <div className="feature-card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent)' }}>
                    {institutionData?.academic?.programs}
                  </div>
                  <div>Programs</div>
                </div>
                <div className="feature-card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--success)' }}>
                    {institutionData?.academic?.researchCenters}
                  </div>
                  <div>Research Centers</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h3 style={{ marginBottom: '20px' }}>System Settings</h3>
              <div style={{ display: 'grid', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label>Application Fee</label>
                    <input type="text" value={institutionData?.settings?.applicationFee} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Admission Deadline</label>
                    <input type="text" value={institutionData?.settings?.admissionDeadline} readOnly />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label>Academic Calendar</label>
                    <input type="text" value={institutionData?.settings?.academicCalendar} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Grading Scale</label>
                    <input type="text" value={institutionData?.settings?.gradingScale} readOnly />
                  </div>
                </div>
                <div className="form-group">
                  <label>Primary Language</label>
                  <input type="text" value={institutionData?.settings?.language} readOnly />
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
            <button className="btn btn-primary">
              <i className="fas fa-save"></i> Save Changes
            </button>
            <button className="btn btn-outline" style={{ marginLeft: '10px' }}>
              <i className="fas fa-times"></i> Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionProfile;