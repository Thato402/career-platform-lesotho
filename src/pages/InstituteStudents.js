// src/pages/institute/InstituteStudents.js
import React, { useState } from 'react';
import './InstitutePages.css';

const InstituteStudents = () => {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'Aarav Sharma',
      studentId: 'STU2024001',
      course: 'Computer Science Engineering',
      enrollmentDate: '2023-08-01',
      year: '2nd Year',
      email: 'aarav.sharma@student.edu',
      phone: '+91 9876543210',
      status: 'active',
      attendance: 92,
      cgpa: 8.7,
      fees: { total: 250000, paid: 225000, due: 25000 }
    },
    {
      id: 2,
      name: 'Priya Patel',
      studentId: 'STU2024002',
      course: 'Business Administration',
      enrollmentDate: '2023-08-01',
      year: '2nd Year',
      email: 'priya.patel@student.edu',
      phone: '+91 9876543211',
      status: 'active',
      attendance: 88,
      cgpa: 8.2,
      fees: { total: 300000, paid: 300000, due: 0 }
    },
    {
      id: 3,
      name: 'Rahul Kumar',
      studentId: 'STU2024003',
      course: 'Electrical Engineering',
      enrollmentDate: '2023-08-01',
      year: '2nd Year',
      email: 'rahul.kumar@student.edu',
      phone: '+91 9876543212',
      status: 'active',
      attendance: 95,
      cgpa: 9.1,
      fees: { total: 240000, paid: 240000, due: 0 }
    },
    {
      id: 4,
      name: 'Sneha Gupta',
      studentId: 'STU2024004',
      course: 'Computer Science Engineering',
      enrollmentDate: '2023-08-01',
      year: '2nd Year',
      email: 'sneha.gupta@student.edu',
      phone: '+91 9876543213',
      status: 'inactive',
      attendance: 76,
      cgpa: 7.8,
      fees: { total: 250000, paid: 200000, due: 50000 }
    }
  ]);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [view, setView] = useState('grid'); // 'grid' or 'list'

  const getStatusBadge = (status) => {
    return status === 'active' ? 'active' : 'inactive';
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 90) return 'excellent';
    if (percentage >= 80) return 'good';
    if (percentage >= 70) return 'average';
    return 'poor';
  };

  return (
    <div className="institute-page">
      <div className="page-header">
        <h1>Student Management</h1>
        <p>Manage enrolled students and academic records</p>
        <div className="header-actions">
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${view === 'grid' ? 'active' : ''}`}
              onClick={() => setView('grid')}
            >
              <i className="fas fa-th"></i>
            </button>
            <button 
              className={`toggle-btn ${view === 'list' ? 'active' : ''}`}
              onClick={() => setView('list')}
            >
              <i className="fas fa-list"></i>
            </button>
          </div>
          <button className="btn btn-primary">
            <i className="fas fa-plus"></i> Add Student
          </button>
          <button className="btn btn-outline">
            <i className="fas fa-download"></i> Export
          </button>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="students-stats">
        <div className="stat-card">
          <div className="stat-value">{students.length}</div>
          <div className="stat-label">Total Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{students.filter(s => s.status === 'active').length}</div>
          <div className="stat-label">Active Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {Math.round(students.reduce((acc, student) => acc + student.attendance, 0) / students.length)}%
          </div>
          <div className="stat-label">Avg. Attendance</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {students.reduce((acc, student) => acc + student.fees.due, 0).toLocaleString('en-IN', {
              style: 'currency',
              currency: 'INR',
              maximumFractionDigits: 0
            })}
          </div>
          <div className="stat-label">Total Fees Due</div>
        </div>
      </div>

      {/* Students Grid/List View */}
      {view === 'grid' ? (
        <div className="students-grid">
          {students.map(student => (
            <div key={student.id} className="student-card">
              <div className="student-header">
                <div className="student-avatar">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="student-basic-info">
                  <h3>{student.name}</h3>
                  <p>{student.studentId}</p>
                  <span className={`status-badge ${getStatusBadge(student.status)}`}>
                    {student.status}
                  </span>
                </div>
              </div>
              
              <div className="student-details">
                <div className="detail-item">
                  <i className="fas fa-graduation-cap"></i>
                  <span>{student.course}</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-calendar"></i>
                  <span>{student.year}</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-envelope"></i>
                  <span>{student.email}</span>
                </div>
              </div>

              <div className="student-performance">
                <div className="performance-item">
                  <label>Attendance</label>
                  <div className="progress-container">
                    <div 
                      className={`progress-fill ${getPerformanceColor(student.attendance)}`}
                      style={{ width: `${student.attendance}%` }}
                    ></div>
                    <span>{student.attendance}%</span>
                  </div>
                </div>
                <div className="performance-item">
                  <label>CGPA</label>
                  <div className="cgpa-display">
                    <span className={`cgpa ${getPerformanceColor(student.cgpa * 10)}`}>
                      {student.cgpa}
                    </span>
                  </div>
                </div>
              </div>

              <div className="student-fees">
                <div className="fees-info">
                  <span>Fees Paid: ₹{student.fees.paid.toLocaleString()}</span>
                  <span>Due: ₹{student.fees.due.toLocaleString()}</span>
                </div>
                {student.fees.due > 0 && (
                  <button className="btn btn-warning btn-sm">
                    Send Reminder
                  </button>
                )}
              </div>

              <div className="student-actions">
                <button 
                  className="btn btn-outline"
                  onClick={() => setSelectedStudent(student)}
                >
                  <i className="fas fa-eye"></i> View
                </button>
                <button className="btn btn-primary">
                  <i className="fas fa-edit"></i> Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="students-table">
          <div className="table-header">
            <div className="col">Student</div>
            <div className="col">Course</div>
            <div className="col">Year</div>
            <div className="col">Attendance</div>
            <div className="col">CGPA</div>
            <div className="col">Fees Status</div>
            <div className="col">Actions</div>
          </div>
          <div className="table-body">
            {students.map(student => (
              <div key={student.id} className="table-row">
                <div className="col">
                  <div className="student-info">
                    <div className="student-name">{student.name}</div>
                    <div className="student-id">{student.studentId}</div>
                  </div>
                </div>
                <div className="col">{student.course}</div>
                <div className="col">{student.year}</div>
                <div className="col">
                  <div className="attendance-display">
                    <div className="progress-container">
                      <div 
                        className={`progress-fill ${getPerformanceColor(student.attendance)}`}
                        style={{ width: `${student.attendance}%` }}
                      ></div>
                    </div>
                    <span>{student.attendance}%</span>
                  </div>
                </div>
                <div className="col">
                  <span className={`cgpa ${getPerformanceColor(student.cgpa * 10)}`}>
                    {student.cgpa}
                  </span>
                </div>
                <div className="col">
                  <span className={`fees-status ${student.fees.due === 0 ? 'paid' : 'pending'}`}>
                    {student.fees.due === 0 ? 'Paid' : `Due: ₹${student.fees.due.toLocaleString()}`}
                  </span>
                </div>
                <div className="col">
                  <div className="action-buttons">
                    <button 
                      className="btn btn-sm btn-outline"
                      onClick={() => setSelectedStudent(student)}
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="btn btn-sm btn-primary">
                      <i className="fas fa-edit"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h3>Student Details - {selectedStudent.name}</h3>
              <button 
                className="close-btn"
                onClick={() => setSelectedStudent(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="student-detail">
              <div className="detail-section">
                <h4>Personal Information</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Student ID:</label>
                    <span>{selectedStudent.studentId}</span>
                  </div>
                  <div className="info-item">
                    <label>Name:</label>
                    <span>{selectedStudent.name}</span>
                  </div>
                  <div className="info-item">
                    <label>Email:</label>
                    <span>{selectedStudent.email}</span>
                  </div>
                  <div className="info-item">
                    <label>Phone:</label>
                    <span>{selectedStudent.phone}</span>
                  </div>
                  <div className="info-item">
                    <label>Course:</label>
                    <span>{selectedStudent.course}</span>
                  </div>
                  <div className="info-item">
                    <label>Year:</label>
                    <span>{selectedStudent.year}</span>
                  </div>
                  <div className="info-item">
                    <label>Enrollment Date:</label>
                    <span>{selectedStudent.enrollmentDate}</span>
                  </div>
                  <div className="info-item">
                    <label>Status:</label>
                    <span className={`status-badge ${getStatusBadge(selectedStudent.status)}`}>
                      {selectedStudent.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Academic Performance</h4>
                <div className="performance-grid">
                  <div className="performance-card">
                    <div className="performance-value">{selectedStudent.attendance}%</div>
                    <div className="performance-label">Attendance</div>
                  </div>
                  <div className="performance-card">
                    <div className="performance-value">{selectedStudent.cgpa}</div>
                    <div className="performance-label">CGPA</div>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Fee Details</h4>
                <div className="fee-details">
                  <div className="fee-item">
                    <span>Total Fees:</span>
                    <span>₹{selectedStudent.fees.total.toLocaleString()}</span>
                  </div>
                  <div className="fee-item">
                    <span>Paid Amount:</span>
                    <span>₹{selectedStudent.fees.paid.toLocaleString()}</span>
                  </div>
                  <div className="fee-item due">
                    <span>Due Amount:</span>
                    <span>₹{selectedStudent.fees.due.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstituteStudents;