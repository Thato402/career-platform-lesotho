import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getStudentApplications, createApplication, deleteApplication } from '../services/realtimeDb';
import { getCourses, getInstitutions } from '../services/realtimeDb';
import './Applications.css';

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
  
  // Form state
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '',
      dateOfBirth: '',
      gender: '',
      nationalId: '',
      phoneNumber: '',
      address: ''
    },
    academicBackground: {
      secondarySchool: '',
      completionYear: new Date().getFullYear(),
      lgcseResults: [],
      sittingNumber: '',
      examYear: new Date().getFullYear()
    },
    guardianInfo: {
      guardianName: '',
      guardianPhone: '',
      guardianEmail: '',
      relationship: '',
      occupation: ''
    },
    supportingDocuments: {
      idCopy: false,
      birthCertificate: false,
      lgcseResults: false,
      passportPhotos: false,
      recommendationLetter: false
    },
    declaration: false
  });

  // LGCSE Subjects common in Lesotho
  const lgceseSubjects = [
    'English Language', 'Sesotho', 'Mathematics', 'Additional Mathematics',
    'Physical Science', 'Biology', 'Chemistry', 'Physics',
    'Geography', 'History', 'Development Studies', 'Accounting',
    'Commerce', 'Computer Studies', 'Agriculture', 'Food and Nutrition',
    'Fashion and Fabrics', 'Art and Design', 'Music', 'Religious Studies'
  ];

  const grades = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'U'];

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
          
          // Pre-fill form with user data
          if (userProfile) {
            setFormData(prev => ({
              ...prev,
              personalInfo: {
                ...prev.personalInfo,
                fullName: userProfile.name || '',
                phoneNumber: userProfile.phone || '',
                email: user.email || ''
              }
            }));
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

  useEffect(() => {
    if (selectedInstitution) {
      const filtered = courses.filter(course => course.institutionId === selectedInstitution);
      setFilteredCourses(filtered);
      setSelectedCourse('');
    } else {
      setFilteredCourses(courses);
    }
  }, [selectedInstitution, courses]);

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleLgceseResultChange = (index, field, value) => {
    const updatedResults = [...formData.academicBackground.lgcseResults];
    updatedResults[index] = {
      ...updatedResults[index],
      [field]: value
    };
    handleInputChange('academicBackground', 'lgcseResults', updatedResults);
  };

  const addLgceseSubject = () => {
    if (formData.academicBackground.lgcseResults.length < 8) {
      handleInputChange('academicBackground', 'lgcseResults', [
        ...formData.academicBackground.lgcseResults,
        { subject: '', grade: '' }
      ]);
    }
  };

  const removeLgceseSubject = (index) => {
    const updatedResults = formData.academicBackground.lgcseResults.filter((_, i) => i !== index);
    handleInputChange('academicBackground', 'lgcseResults', updatedResults);
  };

  const validateForm = () => {
    const { personalInfo, academicBackground, guardianInfo, declaration } = formData;
    
    if (!personalInfo.fullName || !personalInfo.dateOfBirth || !personalInfo.gender || 
        !personalInfo.nationalId || !personalInfo.phoneNumber || !personalInfo.address) {
      alert('Please fill in all personal information fields');
      return false;
    }

    if (!academicBackground.secondarySchool || !academicBackground.sittingNumber || 
        academicBackground.lgcseResults.length === 0) {
      alert('Please provide your academic background including LGCSE results');
      return false;
    }

    // Validate LGCSE results
    for (const result of academicBackground.lgcseResults) {
      if (!result.subject || !result.grade) {
        alert('Please complete all LGCSE subject entries');
        return false;
      }
    }

    if (!guardianInfo.guardianName || !guardianInfo.guardianPhone || !guardianInfo.relationship) {
      alert('Please provide guardian information');
      return false;
    }

    if (!declaration) {
      alert('Please accept the declaration to proceed');
      return false;
    }

    if (!selectedCourse) {
      alert('Please select a course to apply for');
      return false;
    }

    return true;
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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

      const applicationData = {
        studentId: user.uid,
        studentName: formData.personalInfo.fullName,
        studentEmail: user.email,
        courseId: selectedCourse,
        courseName: course.name,
        institutionId: course.institutionId,
        institutionName: course.institutionName,
        status: 'pending',
        appliedDate: new Date().toISOString(),
        formData: formData, // Include all form data
        applicationType: 'undergraduate',
        applicationYear: new Date().getFullYear()
      };

      await createApplication(applicationData);

      // Refresh applications
      const updatedApps = await getStudentApplications(user.uid);
      setApplications(updatedApps);
      setShowApplicationForm(false);
      setSelectedCourse('');
      setSelectedInstitution('');
      resetForm();
      alert('Application submitted successfully! The institution will contact you for next steps.');
    } catch (error) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      personalInfo: {
        fullName: userProfile?.name || '',
        dateOfBirth: '',
        gender: '',
        nationalId: '',
        phoneNumber: userProfile?.phone || '',
        address: ''
      },
      academicBackground: {
        secondarySchool: '',
        completionYear: new Date().getFullYear(),
        lgcseResults: [],
        sittingNumber: '',
        examYear: new Date().getFullYear()
      },
      guardianInfo: {
        guardianName: '',
        guardianPhone: '',
        guardianEmail: '',
        relationship: '',
        occupation: ''
      },
      supportingDocuments: {
        idCopy: false,
        birthCertificate: false,
        lgcseResults: false,
        passportPhotos: false,
        recommendationLetter: false
      },
      declaration: false
    });
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
          <h1>Course Applications</h1>
          <p>Apply for tertiary education courses in Lesotho institutions</p>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <button 
            className="btn btn-primary"
            onClick={() => setShowApplicationForm(true)}
          >
            <i className="fas fa-plus"></i> New Course Application
          </button>
        </div>

        {showApplicationForm && (
          <div className="application-form-container">
            <div className="form-header">
              <h2>Course Application Form</h2>
              <p>Complete this form to apply for tertiary education in Lesotho</p>
              <button 
                className="btn btn-outline close-btn" 
                onClick={() => {
                  setShowApplicationForm(false);
                  resetForm();
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleApplicationSubmit} className="application-form">
              {/* Course Selection Section */}
              <div className="form-section">
                <h3>1. Course Selection</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Select Institution *</label>
                    <select
                      value={selectedInstitution}
                      onChange={(e) => setSelectedInstitution(e.target.value)}
                      required
                      disabled={submitting}
                    >
                      <option value="">Choose an institution...</option>
                      {institutions.map(institution => (
                        <option key={institution.id} value={institution.id}>
                          {institution.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Select Course *</label>
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
                  </div>
                </div>

                {selectedCourse && (
                  <div className="course-details">
                    <h4>Selected Course Details:</h4>
                    <div className="course-info">
                      <p><strong>Course:</strong> {filteredCourses.find(c => c.id === selectedCourse)?.name}</p>
                      <p><strong>Duration:</strong> {filteredCourses.find(c => c.id === selectedCourse)?.duration}</p>
                      <p><strong>Tuition Fee:</strong> M{filteredCourses.find(c => c.id === selectedCourse)?.fee} per year</p>
                      <p><strong>Requirements:</strong> {filteredCourses.find(c => c.id === selectedCourse)?.requirements?.join(', ')}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Personal Information Section */}
              <div className="form-section">
                <h3>2. Personal Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      value={formData.personalInfo.fullName}
                      onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
                      required
                      placeholder="As it appears on your ID"
                    />
                  </div>
                  <div className="form-group">
                    <label>Date of Birth *</label>
                    <input
                      type="date"
                      value={formData.personalInfo.dateOfBirth}
                      onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Gender *</label>
                    <select
                      value={formData.personalInfo.gender}
                      onChange={(e) => handleInputChange('personalInfo', 'gender', e.target.value)}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>National ID Number *</label>
                    <input
                      type="text"
                      value={formData.personalInfo.nationalId}
                      onChange={(e) => handleInputChange('personalInfo', 'nationalId', e.target.value)}
                      required
                      placeholder="e.g., 123456789"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      value={formData.personalInfo.phoneNumber}
                      onChange={(e) => handleInputChange('personalInfo', 'phoneNumber', e.target.value)}
                      required
                      placeholder="+266 1234 5678"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="disabled-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Residential Address *</label>
                  <textarea
                    value={formData.personalInfo.address}
                    onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                    required
                    placeholder="Full physical address including village/town"
                    rows="3"
                  />
                </div>
              </div>

              {/* Academic Background Section */}
              <div className="form-section">
                <h3>3. Academic Background</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Secondary School *</label>
                    <input
                      type="text"
                      value={formData.academicBackground.secondarySchool}
                      onChange={(e) => handleInputChange('academicBackground', 'secondarySchool', e.target.value)}
                      required
                      placeholder="Name of your high school"
                    />
                  </div>
                  <div className="form-group">
                    <label>Year of Completion *</label>
                    <input
                      type="number"
                      value={formData.academicBackground.completionYear}
                      onChange={(e) => handleInputChange('academicBackground', 'completionYear', e.target.value)}
                      required
                      min="2010"
                      max={new Date().getFullYear()}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>LGCSE Sitting Number *</label>
                    <input
                      type="text"
                      value={formData.academicBackground.sittingNumber}
                      onChange={(e) => handleInputChange('academicBackground', 'sittingNumber', e.target.value)}
                      required
                      placeholder="Examination sitting number"
                    />
                  </div>
                  <div className="form-group">
                    <label>Examination Year *</label>
                    <input
                      type="number"
                      value={formData.academicBackground.examYear}
                      onChange={(e) => handleInputChange('academicBackground', 'examYear', e.target.value)}
                      required
                      min="2010"
                      max={new Date().getFullYear()}
                    />
                  </div>
                </div>

                <div className="lgcse-results-section">
                  <h4>LGCSE Results *</h4>
                  <p className="form-help">Add your LGCSE subjects and grades (minimum 5 subjects required)</p>
                  
                  {formData.academicBackground.lgcseResults.map((result, index) => (
                    <div key={index} className="lgcse-subject-row">
                      <select
                        value={result.subject}
                        onChange={(e) => handleLgceseResultChange(index, 'subject', e.target.value)}
                        required
                      >
                        <option value="">Select Subject</option>
                        {lgceseSubjects.map(subject => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </select>
                      
                      <select
                        value={result.grade}
                        onChange={(e) => handleLgceseResultChange(index, 'grade', e.target.value)}
                        required
                      >
                        <option value="">Select Grade</option>
                        {grades.map(grade => (
                          <option key={grade} value={grade}>{grade}</option>
                        ))}
                      </select>
                      
                      <button
                        type="button"
                        className="btn btn-danger remove-subject-btn"
                        onClick={() => removeLgceseSubject(index)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                  
                  {formData.academicBackground.lgcseResults.length < 8 && (
                    <button
                      type="button"
                      className="btn btn-outline add-subject-btn"
                      onClick={addLgceseSubject}
                    >
                      <i className="fas fa-plus"></i> Add Subject
                    </button>
                  )}
                </div>
              </div>

              {/* Guardian Information Section */}
              <div className="form-section">
                <h3>4. Guardian/Parent Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Guardian's Full Name *</label>
                    <input
                      type="text"
                      value={formData.guardianInfo.guardianName}
                      onChange={(e) => handleInputChange('guardianInfo', 'guardianName', e.target.value)}
                      required
                      placeholder="Guardian or parent's full name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Relationship *</label>
                    <select
                      value={formData.guardianInfo.relationship}
                      onChange={(e) => handleInputChange('guardianInfo', 'relationship', e.target.value)}
                      required
                    >
                      <option value="">Select Relationship</option>
                      <option value="father">Father</option>
                      <option value="mother">Mother</option>
                      <option value="guardian">Guardian</option>
                      <option value="sibling">Sibling</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Guardian's Phone Number *</label>
                    <input
                      type="tel"
                      value={formData.guardianInfo.guardianPhone}
                      onChange={(e) => handleInputChange('guardianInfo', 'guardianPhone', e.target.value)}
                      required
                      placeholder="+266 1234 5678"
                    />
                  </div>
                  <div className="form-group">
                    <label>Guardian's Email</label>
                    <input
                      type="email"
                      value={formData.guardianInfo.guardianEmail}
                      onChange={(e) => handleInputChange('guardianInfo', 'guardianEmail', e.target.value)}
                      placeholder="guardian@email.com"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Guardian's Occupation</label>
                  <input
                    type="text"
                    value={formData.guardianInfo.occupation}
                    onChange={(e) => handleInputChange('guardianInfo', 'occupation', e.target.value)}
                    placeholder="Occupation or profession"
                  />
                </div>
              </div>

              {/* Supporting Documents Section */}
              <div className="form-section">
                <h3>5. Supporting Documents Checklist</h3>
                <p className="form-help">Please ensure you have the following documents ready for submission:</p>
                
                <div className="documents-checklist">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.supportingDocuments.idCopy}
                      onChange={(e) => handleInputChange('supportingDocuments', 'idCopy', e.target.checked)}
                    />
                    <span>Certified copy of National ID/Birth Certificate</span>
                  </label>
                  
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.supportingDocuments.lgcseResults}
                      onChange={(e) => handleInputChange('supportingDocuments', 'lgcseResults', e.target.checked)}
                    />
                    <span>Certified copy of LGCSE Results</span>
                  </label>
                  
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.supportingDocuments.passportPhotos}
                      onChange={(e) => handleInputChange('supportingDocuments', 'passportPhotos', e.target.checked)}
                    />
                    <span>Two recent passport-sized photographs</span>
                  </label>
                  
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.supportingDocuments.recommendationLetter}
                      onChange={(e) => handleInputChange('supportingDocuments', 'recommendationLetter', e.target.checked)}
                    />
                    <span>School recommendation letter (if available)</span>
                  </label>
                </div>
              </div>

              {/* Declaration Section */}
              <div className="form-section">
                <h3>6. Declaration</h3>
                <div className="declaration-box">
                  <p>
                    I hereby declare that the information provided in this application is true and correct to the best of my knowledge. 
                    I understand that any false information may lead to the rejection of my application or termination of admission. 
                    I agree to abide by the rules and regulations of the institution if admitted.
                  </p>
                  
                  <label className="checkbox-label declaration-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.declaration}
                      onChange={(e) => handleInputChange('declaration', 'declaration', e.target.checked)}
                      required
                    />
                    <span>I accept the above declaration and terms *</span>
                  </label>
                </div>
              </div>

              {/* Application Rules */}
              <div className="application-rules">
                <h4>Application Rules & Information:</h4>
                <ul>
                  <li>Maximum 2 applications per institution allowed</li>
                  <li>Applications will be processed within 2-4 weeks</li>
                  <li>You will be contacted for any additional requirements</li>
                  <li>Keep your documents ready for verification</li>
                  <li>Application fee (if any) will be communicated by the institution</li>
                </ul>
              </div>

              {/* Submit Buttons */}
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary submit-btn"
                  disabled={submitting || !selectedCourse}
                >
                  {submitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Submitting Application...
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
                    resetForm();
                  }}
                  disabled={submitting}
                >
                  Cancel Application
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Existing applications display code remains the same */}
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
