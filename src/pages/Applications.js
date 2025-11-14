import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getStudentApplications, createApplication, deleteApplication } from '../services/realtimeDb';
import { getCourses, getInstitutions } from '../services/realtimeDb';

const Applications = ({ user, userProfile }) => {
  const [applications, setApplications] = useState([]);
  const [courses, setCourses] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showResultsForm, setShowResultsForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [qualifiedCourses, setQualifiedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // LGCSE Results state
  const [lgcseResults, setLgcseResults] = useState({
    english: '',
    mathematics: '',
    science: '',
    sesotho: '',
    accounting: '',
    history: '',
    geography: '',
    business: '',
    computer: '',
    art: '',
    additionalSubjects: []
  });

  // Student information
  const [studentInfo, setStudentInfo] = useState({
    fullName: '',
    dateOfBirth: '',
    phoneNumber: '',
    address: '',
    highSchool: '',
    graduationYear: new Date().getFullYear()
  });

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
          
          // Check if student has existing results in profile
          if (userProfile.lgcseResults) {
            setLgcseResults(userProfile.lgcseResults);
            calculateQualifiedCourses(coursesData, userProfile.lgcseResults);
          }
          
          if (userProfile.studentInfo) {
            setStudentInfo(userProfile.studentInfo);
          }
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

  // Calculate which courses the student qualifies for based on LGCSE results
  const calculateQualifiedCourses = (coursesData, results) => {
    const qualified = coursesData.filter(course => {
      if (!course.requirements || course.requirements.length === 0) return true;
      
      return course.requirements.every(requirement => {
        return meetsRequirement(requirement, results);
      });
    });
    
    setQualifiedCourses(qualified);
    return qualified;
  };

  // Check if student meets a specific requirement
  const meetsRequirement = (requirement, results) => {
    const requirementLower = requirement.toLowerCase();
    
    // Extract grade and subject from requirement
    // Examples: "Mathematics B", "English C", "Science subject D"
    const gradeMatch = requirementLower.match(/([a-d])(?:\s|$)/i);
    if (!gradeMatch) return true; // If no grade specified, assume requirement is met
    
    const requiredGrade = gradeMatch[1].toUpperCase();
    const gradeValue = { 'A': 4, 'B': 3, 'C': 2, 'D': 1 };
    const requiredGradeValue = gradeValue[requiredGrade];
    
    // Check different subject patterns
    if (requirementLower.includes('english')) {
      return results.english && gradeValue[results.english.toUpperCase()] >= requiredGradeValue;
    }
    if (requirementLower.includes('mathematics') || requirementLower.includes('math')) {
      return results.mathematics && gradeValue[results.mathematics.toUpperCase()] >= requiredGradeValue;
    }
    if (requirementLower.includes('science')) {
      return results.science && gradeValue[results.science.toUpperCase()] >= requiredGradeValue;
    }
    if (requirementLower.includes('sesotho')) {
      return results.sesotho && gradeValue[results.sesotho.toUpperCase()] >= requiredGradeValue;
    }
    if (requirementLower.includes('accounting')) {
      return results.accounting && gradeValue[results.accounting.toUpperCase()] >= requiredGradeValue;
    }
    if (requirementLower.includes('history')) {
      return results.history && gradeValue[results.history.toUpperCase()] >= requiredGradeValue;
    }
    if (requirementLower.includes('geography')) {
      return results.geography && gradeValue[results.geography.toUpperCase()] >= requiredGradeValue;
    }
    if (requirementLower.includes('business')) {
      return results.business && gradeValue[results.business.toUpperCase()] >= requiredGradeValue;
    }
    if (requirementLower.includes('computer')) {
      return results.computer && gradeValue[results.computer.toUpperCase()] >= requiredGradeValue;
    }
    if (requirementLower.includes('art') || requirementLower.includes('design')) {
      return results.art && gradeValue[results.art.toUpperCase()] >= requiredGradeValue;
    }
    
    // Check for minimum LGCSE passes
    const passMatch = requirementLower.match(/(\d+)\s*lgcse\s*pass/i);
    if (passMatch) {
      const minPasses = parseInt(passMatch[1]);
      const totalPasses = Object.values(results).filter(grade => 
        grade && ['A', 'B', 'C', 'D'].includes(grade.toUpperCase())
      ).length;
      return totalPasses >= minPasses;
    }
    
    return true; // If requirement not recognized, assume it's met
  };

  const handleResultsSubmit = (e) => {
    e.preventDefault();
    const qualified = calculateQualifiedCourses(courses, lgcseResults);
    setShowResultsForm(false);
    setShowApplicationForm(true);
    
    if (qualified.length === 0) {
      alert('Based on your LGCSE results, you do not qualify for any courses at the moment. Please check the requirements or contact institutions directly.');
    } else {
      alert(`You qualify for ${qualified.length} courses! You can now apply to institutions.`);
    }
  };

  const handleLGCSEChange = (subject, value) => {
    setLgcseResults(prev => ({
      ...prev,
      [subject]: value.toUpperCase()
    }));
  };

  const handleStudentInfoChange = (field, value) => {
    setStudentInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
        studentName: studentInfo.fullName || userProfile?.name || user.email,
        studentEmail: user.email,
        studentPhone: studentInfo.phoneNumber,
        studentAddress: studentInfo.address,
        dateOfBirth: studentInfo.dateOfBirth,
        highSchool: studentInfo.highSchool,
        graduationYear: studentInfo.graduationYear,
        lgcseResults: lgcseResults,
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
          {!userProfile?.lgcseResults ? (
            <button 
              className="btn btn-primary"
              onClick={() => setShowResultsForm(true)}
            >
              <i className="fas fa-graduation-cap"></i> Start Application with LGCSE Results
            </button>
          ) : (
            <button 
              className="btn btn-primary"
              onClick={() => setShowApplicationForm(true)}
            >
              <i className="fas fa-plus"></i> New Application
            </button>
          )}
        </div>

        {/* LGCSE Results Form */}
        {showResultsForm && (
          <div className="form-container" style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>Enter Your LGCSE Results</h3>
              <button 
                className="btn btn-outline" 
                onClick={() => setShowResultsForm(false)}
                style={{ border: 'none', fontSize: '1.2rem' }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(76, 201, 240, 0.1)', borderRadius: 'var(--radius)' }}>
              <p><strong>Important:</strong> Enter your LGCSE grades (A, B, C, D, or leave blank if not taken). 
              The system will automatically show you courses you qualify for based on your results.</p>
            </div>

            <form onSubmit={handleResultsSubmit}>
              {/* Student Information */}
              <div style={{ marginBottom: '30px' }}>
                <h4>Student Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      value={studentInfo.fullName}
                      onChange={(e) => handleStudentInfoChange('fullName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Date of Birth *</label>
                    <input
                      type="date"
                      value={studentInfo.dateOfBirth}
                      onChange={(e) => handleStudentInfoChange('dateOfBirth', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      value={studentInfo.phoneNumber}
                      onChange={(e) => handleStudentInfoChange('phoneNumber', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Graduation Year *</label>
                    <input
                      type="number"
                      value={studentInfo.graduationYear}
                      onChange={(e) => handleStudentInfoChange('graduationYear', e.target.value)}
                      min="2000"
                      max={new Date().getFullYear()}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>High School *</label>
                  <input
                    type="text"
                    value={studentInfo.highSchool}
                    onChange={(e) => handleStudentInfoChange('highSchool', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Address *</label>
                  <textarea
                    value={studentInfo.address}
                    onChange={(e) => handleStudentInfoChange('address', e.target.value)}
                    required
                    rows="3"
                  />
                </div>
              </div>

              {/* LGCSE Results */}
              <h4>LGCSE Results</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>English</label>
                  <select
                    value={lgcseResults.english}
                    onChange={(e) => handleLGCSEChange('english', e.target.value)}
                  >
                    <option value="">Select Grade</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Mathematics</label>
                  <select
                    value={lgcseResults.mathematics}
                    onChange={(e) => handleLGCSEChange('mathematics', e.target.value)}
                  >
                    <option value="">Select Grade</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Science</label>
                  <select
                    value={lgcseResults.science}
                    onChange={(e) => handleLGCSEChange('science', e.target.value)}
                  >
                    <option value="">Select Grade</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Sesotho</label>
                  <select
                    value={lgcseResults.sesotho}
                    onChange={(e) => handleLGCSEChange('sesotho', e.target.value)}
                  >
                    <option value="">Select Grade</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Accounting</label>
                  <select
                    value={lgcseResults.accounting}
                    onChange={(e) => handleLGCSEChange('accounting', e.target.value)}
                  >
                    <option value="">Select Grade</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>History</label>
                  <select
                    value={lgcseResults.history}
                    onChange={(e) => handleLGCSEChange('history', e.target.value)}
                  >
                    <option value="">Select Grade</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Geography</label>
                  <select
                    value={lgcseResults.geography}
                    onChange={(e) => handleLGCSEChange('geography', e.target.value)}
                  >
                    <option value="">Select Grade</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Business Studies</label>
                  <select
                    value={lgcseResults.business}
                    onChange={(e) => handleLGCSEChange('business', e.target.value)}
                  >
                    <option value="">Select Grade</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Computer Studies</label>
                  <select
                    value={lgcseResults.computer}
                    onChange={(e) => handleLGCSEChange('computer', e.target.value)}
                  >
                    <option value="">Select Grade</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Art & Design</label>
                  <select
                    value={lgcseResults.art}
                    onChange={(e) => handleLGCSEChange('art', e.target.value)}
                  >
                    <option value="">Select Grade</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  <i className="fas fa-calculator"></i> Check Qualified Courses
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={() => setShowResultsForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Application Form */}
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
                <li>Only courses you qualify for are shown</li>
                <li>Applications can be withdrawn anytime before review</li>
              </ul>
            </div>

            {/* Qualified Courses Summary */}
            {qualifiedCourses.length > 0 && (
              <div style={{ 
                padding: '15px', 
                background: 'rgba(67, 97, 238, 0.05)', 
                borderRadius: 'var(--radius)',
                marginBottom: '20px'
              }}>
                <h4>
                  <i className="fas fa-check-circle" style={{ color: 'var(--success)' }}></i>
                  {' '}You qualify for {qualifiedCourses.length} courses
                </h4>
                <p>Based on your LGCSE results, you can apply to the following courses:</p>
              </div>
            )}

            <form onSubmit={handleApplicationSubmit}>
              <div className="form-group">
                <label>Select Institution</label>
                <select
                  value={selectedInstitution}
                  onChange={(e) => setSelectedInstitution(e.target.value)}
                  required
                  disabled={submitting}
                >
                  <option value="">Choose an institution...</option>
                  {Array.from(new Set(qualifiedCourses.map(course => course.institutionId))).map(institutionId => {
                    const institution = institutions.find(inst => inst.id === institutionId);
                    return institution ? (
                      <option key={institutionId} value={institutionId}>
                        {institution.name}
                      </option>
                    ) : null;
                  })}
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
                  {qualifiedCourses
                    .filter(course => !selectedInstitution || course.institutionId === selectedInstitution)
                    .map(course => (
                      <option key={course.id} value={course.id}>
                        {course.name} - {course.duration} - M{course.fee}
                      </option>
                    ))
                  }
                </select>
                {qualifiedCourses.length === 0 && (
                  <small style={{ color: 'var(--danger)' }}>
                    You don't qualify for any courses. Please check your LGCSE results or contact institutions directly.
                  </small>
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
                  {qualifiedCourses.find(c => c.id === selectedCourse)?.description && (
                    <p><strong>Description:</strong> {qualifiedCourses.find(c => c.id === selectedCourse).description}</p>
                  )}
                  {qualifiedCourses.find(c => c.id === selectedCourse)?.requirements && (
                    <div>
                      <strong>Requirements:</strong>
                      <ul>
                        {qualifiedCourses.find(c => c.id === selectedCourse).requirements.map((req, idx) => (
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
                  disabled={submitting || !selectedCourse || qualifiedCourses.length === 0}
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

        {/* Existing applications display remains the same */}
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
                <p>
                  {userProfile?.lgcseResults 
                    ? "Start by applying to courses you qualify for."
                    : "Enter your LGCSE results to see which courses you qualify for."
                  }
                </p>
                <button 
                  className="btn btn-primary" 
                  style={{ marginTop: '20px' }}
                  onClick={() => userProfile?.lgcseResults ? setShowApplicationForm(true) : setShowResultsForm(true)}
                >
                  <i className="fas fa-plus"></i> 
                  {userProfile?.lgcseResults ? ' Create Application' : ' Enter LGCSE Results'}
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
