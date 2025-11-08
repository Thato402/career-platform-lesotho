// src/pages/institute/InstituteApplications.js
import React, { useState } from 'react';
import './InstitutePages.css';

const InstituteApplications = () => {
  const [applications, setApplications] = useState([
    {
      id: 1,
      studentName: 'Aarav Sharma',
      course: 'Computer Science Engineering',
      appliedDate: '2024-01-15',
      status: 'pending',
      email: 'aarav.sharma@email.com',
      phone: '+91 9876543210',
      qualifications: '12th Grade - 92%',
      documents: ['Transcript', 'ID Proof', 'Photo'],
      priority: 'high'
    },
    {
      id: 2,
      studentName: 'Priya Patel',
      course: 'Business Administration',
      appliedDate: '2024-01-14',
      status: 'under_review',
      email: 'priya.patel@email.com',
      phone: '+91 9876543211',
      qualifications: 'B.Com - 78%',
      documents: ['Transcript', 'ID Proof', 'Recommendation'],
      priority: 'medium'
    },
    {
      id: 3,
      studentName: 'Rahul Kumar',
      course: 'Electrical Engineering',
      appliedDate: '2024-01-13',
      status: 'approved',
      email: 'rahul.kumar@email.com',
      phone: '+91 9876543212',
      qualifications: '12th Grade - 85%',
      documents: ['Transcript', 'ID Proof'],
      priority: 'low'
    },
    {
      id: 4,
      studentName: 'Sneha Gupta',
      course: 'Computer Science Engineering',
      appliedDate: '2024-01-12',
      status: 'rejected',
      email: 'sneha.gupta@email.com',
      phone: '+91 9876543213',
      qualifications: '12th Grade - 88%',
      documents: ['Transcript', 'ID Proof', 'Portfolio'],
      priority: 'medium'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter);

  const handleStatusUpdate = (applicationId, newStatus) => {
    setApplications(applications.map(app => 
      app.id === applicationId ? { ...app, status: newStatus } : app
    ));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'pending', label: 'Pending' },
      under_review: { class: 'under-review', label: 'Under Review' },
      approved: { class: 'approved', label: 'Approved' },
      rejected: { class: 'rejected', label: 'Rejected' }
    };
    return statusConfig[status] || { class: 'pending', label: 'Pending' };
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: { class: 'high', label: 'High' },
      medium: { class: 'medium', label: 'Medium' },
      low: { class: 'low', label: 'Low' }
    };
    return priorityConfig[priority] || { class: 'medium', label: 'Medium' };
  };

  return (
    <div className="institute-page">
      <div className="page-header">
        <h1>Applications Review</h1>
        <p>Review and process student applications</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Applications
          </button>
          <button 
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={`filter-btn ${filter === 'under_review' ? 'active' : ''}`}
            onClick={() => setFilter('under_review')}
          >
            Under Review
          </button>
          <button 
            className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
            onClick={() => setFilter('approved')}
          >
            Approved
          </button>
        </div>
        <div className="stats-overview">
          <div className="stat">
            <div className="stat-number">{applications.length}</div>
            <div className="stat-label">Total Applications</div>
          </div>
          <div className="stat">
            <div className="stat-number">{applications.filter(a => a.status === 'pending').length}</div>
            <div className="stat-label">Pending Review</div>
          </div>
          <div className="stat">
            <div className="stat-number">{applications.filter(a => a.status === 'approved').length}</div>
            <div className="stat-label">Approved</div>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="applications-table">
        <div className="table-header">
          <div className="col">Student</div>
          <div className="col">Course</div>
          <div className="col">Applied Date</div>
          <div className="col">Priority</div>
          <div className="col">Status</div>
          <div className="col">Actions</div>
        </div>
        <div className="table-body">
          {filteredApplications.map(application => (
            <div key={application.id} className="table-row">
              <div className="col">
                <div className="student-info">
                  <div className="student-name">{application.studentName}</div>
                  <div className="student-contact">{application.email}</div>
                </div>
              </div>
              <div className="col">
                <div className="course-name">{application.course}</div>
              </div>
              <div className="col">
                <div className="applied-date">{application.appliedDate}</div>
              </div>
              <div className="col">
                <span className={`priority-badge ${getPriorityBadge(application.priority).class}`}>
                  {getPriorityBadge(application.priority).label}
                </span>
              </div>
              <div className="col">
                <span className={`status-badge ${getStatusBadge(application.status).class}`}>
                  {getStatusBadge(application.status).label}
                </span>
              </div>
              <div className="col">
                <div className="action-buttons">
                  <button 
                    className="btn btn-sm btn-outline"
                    onClick={() => setSelectedApplication(application)}
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  {application.status === 'pending' && (
                    <>
                      <button 
                        className="btn btn-sm btn-success"
                        onClick={() => handleStatusUpdate(application.id, 'under_review')}
                      >
                        <i className="fas fa-play"></i>
                      </button>
                    </>
                  )}
                  {application.status === 'under_review' && (
                    <>
                      <button 
                        className="btn btn-sm btn-success"
                        onClick={() => handleStatusUpdate(application.id, 'approved')}
                      >
                        <i className="fas fa-check"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleStatusUpdate(application.id, 'rejected')}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h3>Application Details</h3>
              <button 
                className="close-btn"
                onClick={() => setSelectedApplication(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="application-detail">
              <div className="detail-section">
                <h4>Student Information</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Name:</label>
                    <span>{selectedApplication.studentName}</span>
                  </div>
                  <div className="info-item">
                    <label>Email:</label>
                    <span>{selectedApplication.email}</span>
                  </div>
                  <div className="info-item">
                    <label>Phone:</label>
                    <span>{selectedApplication.phone}</span>
                  </div>
                  <div className="info-item">
                    <label>Qualifications:</label>
                    <span>{selectedApplication.qualifications}</span>
                  </div>
                </div>
              </div>
              
              <div className="detail-section">
                <h4>Application Details</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Course:</label>
                    <span>{selectedApplication.course}</span>
                  </div>
                  <div className="info-item">
                    <label>Applied Date:</label>
                    <span>{selectedApplication.appliedDate}</span>
                  </div>
                  <div className="info-item">
                    <label>Status:</label>
                    <span className={`status-badge ${getStatusBadge(selectedApplication.status).class}`}>
                      {getStatusBadge(selectedApplication.status).label}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Priority:</label>
                    <span className={`priority-badge ${getPriorityBadge(selectedApplication.priority).class}`}>
                      {getPriorityBadge(selectedApplication.priority).label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Documents</h4>
                <div className="documents-list">
                  {selectedApplication.documents.map((doc, index) => (
                    <div key={index} className="document-item">
                      <i className="fas fa-file-pdf"></i>
                      <span>{doc}</span>
                      <button className="btn btn-sm btn-outline">
                        <i className="fas fa-download"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstituteApplications;