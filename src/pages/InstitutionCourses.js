import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const InstitutionCourses = ({ user, userProfile }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const mockCourses = [
    {
      id: 1,
      name: 'Bachelor of Science in Computer Science',
      code: 'CS101',
      faculty: 'Science and Technology',
      department: 'Computer Science',
      duration: '4 years',
      credits: 120,
      status: 'Active',
      enrolledStudents: 285,
      capacity: 300,
      coordinator: 'Dr. John Molapo',
      description: 'Comprehensive program covering software development, algorithms, and computer systems.',
      requirements: ['Mathematics A', 'Physics B'],
      tuition: '25,000 LSL/year',
      applicationDeadline: '2024-08-30'
    },
    {
      id: 2,
      name: 'Bachelor of Business Administration',
      code: 'BBA201',
      faculty: 'Business and Management',
      department: 'Business Administration',
      duration: '3 years',
      credits: 90,
      status: 'Active',
      enrolledStudents: 420,
      capacity: 450,
      coordinator: 'Prof. Mary Khotle',
      description: 'Business management program focusing on leadership, strategy, and entrepreneurship.',
      requirements: ['Mathematics C', 'English B'],
      tuition: '22,000 LSL/year',
      applicationDeadline: '2024-08-15'
    },
    {
      id: 3,
      name: 'Bachelor of Engineering',
      code: 'ENG301',
      faculty: 'Engineering',
      department: 'Engineering',
      duration: '5 years',
      credits: 150,
      status: 'Active',
      enrolledStudents: 180,
      capacity: 200,
      coordinator: 'Dr. Peter Sello',
      description: 'Engineering program with specializations in civil, electrical, and mechanical engineering.',
      requirements: ['Mathematics A', 'Physics A', 'Chemistry B'],
      tuition: '30,000 LSL/year',
      applicationDeadline: '2024-09-01'
    }
  ];

  useEffect(() => {
    if (user && userProfile?.role === 'institute') {
      setCourses(mockCourses);
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
          <h1>Academic Program Management</h1>
          <p>Manage your institution's course catalog and program offerings</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className={`btn ${activeTab === 'all' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('all')}
            >
              All Programs
            </button>
            <button 
              className={`btn ${activeTab === 'active' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('active')}
            >
              Active
            </button>
            <button 
              className={`btn ${activeTab === 'draft' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('draft')}
            >
              Draft
            </button>
          </div>
          <button className="btn btn-primary">
            <i className="fas fa-plus"></i> Add New Program
          </button>
        </div>

        <div className="features-grid">
          {courses.map(course => (
            <div key={course.id} className="feature-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <h3 style={{ color: 'var(--secondary)', margin: 0 }}>{course.name}</h3>
                <span style={{ 
                  background: course.status === 'Active' ? 'var(--success)' : 'var(--warning)',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '0.8rem'
                }}>
                  {course.status}
                </span>
              </div>
              
              <div style={{ color: 'var(--primary)', marginBottom: '10px' }}>
                <i className="fas fa-code"></i> {course.code} • {course.faculty}
              </div>
              
              <p style={{ color: 'var(--gray)', fontSize: '0.9rem', marginBottom: '15px' }}>
                {course.description}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '15px' }}>
                <div>
                  <strong>Duration:</strong> {course.duration}
                </div>
                <div>
                  <strong>Credits:</strong> {course.credits}
                </div>
                <div>
                  <strong>Coordinator:</strong> {course.coordinator}
                </div>
                <div>
                  <strong>Enrollment:</strong> {course.enrolledStudents}/{course.capacity}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button className="btn btn-primary">
                  <i className="fas fa-edit"></i> Edit
                </button>
                <button className="btn btn-outline">
                  <i className="fas fa-chart-bar"></i> Analytics
                </button>
                <button className="btn btn-outline">
                  <i className="fas fa-users"></i> Students
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstitutionCourses;