import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getStudentApplications, createApplication, deleteApplication } from '../services/realtimeDb';
import { getCourses, getInstitutions } from '../services/realtimeDb';

const Applications = ({ user, userProfile }) => {
  const [applications, setApplications] = useState([]);
  const [courses, setCourses] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (user && userProfile?.role === 'student') {
        try {
          const [apps, coursesData, institutionsData] = await Promise.all([
            getStudentApplications(user.uid),
            getCourses(),
            getInstitutions()
          ]);
          setApplications(apps);
          setCourses(coursesData);
          setInstitutions(institutionsData);
          setFilteredCourses(coursesData);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, userProfile]);

  useEffect(() => {
    if (selectedInstitution) {
      const filtered = courses.filter(course => course.institutionId === selectedInstitution);
      setFilteredCourses(filtered);
      setSelectedCourse(''); // Reset course selection when institution changes
    } else {
      setFilteredCourses(courses);
    }
  }, [selectedInstitution, courses]);

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse) return;

    setSubmitting(true);
    try {
      const course = courses.find(c => c.id === selectedCourse);
      const institution = institutions.find(inst => inst.id === course.institutionId);
      
      // Check if student already has 2 applications for this institution
      const institutionApplications = applications.filter(app => 
        app.institutionId === course.institutionId
      );
      
      if (institutionApplications.length >= 2) {
        throw new Error(`You can only apply to maximum 2 courses at ${institution.name}`);
      }

      await createApplication({
        studentId: user.uid,
        studentName: userProfile?.name || user.email,
        studentEmail: user.email,
        courseId: selectedCourse,
        courseName: course.name,
        institutionId: course.institutionId,
        institutionName: course.institutionName,
        status: 'pending',
        appliedDate: new Date().toISOString()
      });

      // Refresh applications
      const updatedApps = await getStudentApplications(user.uid);
      setApplications(updatedApps);
      setShowApplicationForm(false);
      setSelectedCourse('');
      setSelectedInstitution('');
      alert('Application submitted successfully!');
    } catch (error) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteApplication = async (applicationId) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      try {
        await deleteApplication(applicationId);
        const updatedApps = await getStudentApplications(user.uid);
        setApplications(updatedApps);
        alert('Application withdrawn successfully!');
      } catch (error) {
        alert('Error withdrawing application: ' + error.message);
      }
    }
  };

  const getApplicationsByInstitution = () => {
    const institutionMap = {};
    applications.forEach(app => {
      if (!institutionMap[app.institutionId]) {
        institutionMap[app.institutionId] = {
          institutionName: app.institutionName,
          applications: []
        };
      }
      institutionMap[app.institutionId].applications.push(app);
    });
    return institutionMap;
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (userProfile?.role !== 'student') {
    return (
      <div className="container" style={{ padding: '50px 0', textAlign: 'center' }}>
        <h2>Applications are only available for students</h2>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'admitted': return 'var(--success)';
      case 'rejected': return 'var(--danger)';
      case 'pending': return 'var(--warning)';
      default: return 'var(--gray)';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'admitted': return 'Admitted ✅';
      case 'rejected': return 'Rejected ❌';
      case 'pending': return 'Pending Review ⏳';
      default: return status;
    }
  };

  const institutionApplications = getApplicationsByInstitution();

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>My Applications</h1>
          <p>Track your course applications and admission status</p>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <button 
            className="btn btn-primary"
            onClick={() => setShowApplicationForm(true)}
          >
            <i className="fas fa-plus"></i> New Application
          </button>
        </div>

        {showApplicationForm && (
          <div className="form-container" style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>Apply for a Course</h3>
              <button 
                className="btn btn-outline" 
                onClick={() => {
                  setShowApplicationForm(false);
                  setSelectedCourse('');
                  setSelectedInstitution('');
                }}
                style={{ border: 'none', fontSize: '1.2rem' }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(76, 201, 240, 0.1)', borderRadius: 'var(--radius)' }}>
              <p><strong>Application Rules:</strong></p>
              <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
                <li>Maximum 2 applications per institution</li>
                <li>You can apply to multiple institutions</li>
                <li>Applications can be withdrawn anytime before review</li>
              </ul>
            </div>

            <form onSubmit={handleApplicationSubmit}>
              <div className="form-group">
                <label>Select Institution</label>
                <select
                  value={selectedInstitution}
                  onChange={(e) => setSelectedInstitution(e.target.value)}
                  required
                  disabled={submitting}
                >
                  <option value="">Choose an institution first...</option>
                  {institutions.map(institution => (
                    <option key={institution.id} value={institution.id}>
                      {institution.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Select Course</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  required
                  disabled={submitting || !selectedInstitution}
                >
                  <option value="">Choose a course...</option>
                  {filteredCourses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.name} - {course.duration} - M{course.fee}
                    </option>
                  ))}
                </select>
                {!selectedInstitution && (
                  <small style={{ color: 'var(--gray)' }}>Please select an institution first</small>
                )}
              </div>

              {selectedCourse && (
                <div style={{ 
                  padding: '15px', 
                  background: 'rgba(67, 97, 238, 0.05)', 
                  borderRadius: 'var(--radius)',
                  marginBottom: '20px'
                }}>
                  <h4>Course Details:</h4>
                  {filteredCourses.find(c => c.id === selectedCourse)?.description && (
                    <p><strong>Description:</strong> {filteredCourses.find(c => c.id === selectedCourse).description}</p>
                  )}
                  {filteredCourses.find(c => c.id === selectedCourse)?.requirements && (
                    <div>
                      <strong>Requirements:</strong>
                      <ul>
                        {filteredCourses.find(c => c.id === selectedCourse).requirements.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={submitting || !selectedCourse}
                >
                  {submitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Submitting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i> Submit Application
                    </>
                  )}
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={() => {
                    setShowApplicationForm(false);
                    setSelectedCourse('');
                    setSelectedInstitution('');
                  }}
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center' }}>
            <div className="spinner"></div>
            <p>Loading applications...</p>
          </div>
        ) : (
          <div>
            {Object.keys(institutionApplications).length > 0 ? (
              Object.entries(institutionApplications).map(([institutionId, data]) => (
                <div key={institutionId} style={{ marginBottom: '40px' }}>
                  <h3 style={{ 
                    color: 'var(--primary)', 
                    borderBottom: '2px solid var(--primary)',
                    paddingBottom: '10px',
                    marginBottom: '20px'
                  }}>
                    {data.institutionName}
                    <span style={{ 
                      fontSize: '0.8rem', 
                      background: 'var(--primary)', 
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '20px',
                      marginLeft: '10px'
                    }}>
                      {data.applications.length}/2 applications
                    </span>
                  </h3>
                  
                  <div className="features-grid">
                    {data.applications.map(application => (
                      <div key={application.id} className="feature-card">
                        <div style={{ 
                          background: getStatusColor(application.status),
                          color: 'white',
                          padding: '10px 15px',
                          borderRadius: 'var(--radius)',
                          marginBottom: '15px',
                          textAlign: 'center',
                          fontWeight: '600',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <span>{getStatusText(application.status)}</span>
                          {application.status === 'pending' && (
                            <button 
                              onClick={() => handleDeleteApplication(application.id)}
                              style={{ 
                                background: 'transparent', 
                                border: 'none', 
                                color: 'white',
                                cursor: 'pointer'
                              }}
                              title="Withdraw Application"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          )}
                        </div>
                        
                        <h3>{application.courseName}</h3>
                        
                        <div style={{ marginBottom: '15px' }}>
                          <strong>Applied:</strong>{' '}
                          {application.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : 'N/A'}
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                          <strong>Application ID:</strong>{' '}
                          <span style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                            {application.id.slice(0, 8)}...
                          </span>
                        </div>

                        {application.status === 'admitted' && (
                          <button className="btn btn-success" style={{ width: '100%', marginBottom: '10px' }}>
                            <i className="fas fa-check-circle"></i> Accept Admission
                          </button>
                        )}
                        
                        {application.status === 'pending' && (
                          <div style={{ fontSize: '0.9rem', color: 'var(--gray)', textAlign: 'center' }}>
                            <i className="fas fa-clock"></i> Under review by institution
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray)' }}>
                <i className="fas fa-file-alt" style={{ fontSize: '3rem', marginBottom: '20px' }}></i>
                <h3>No applications yet</h3>
                <p>Start by applying to your preferred courses.</p>
                <button 
                  className="btn btn-primary" 
                  style={{ marginTop: '20px' }}
                  onClick={() => setShowApplicationForm(true)}
                >
                  <i className="fas fa-plus"></i> Create Your First Application
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
