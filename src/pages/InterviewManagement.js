// src/pages/InterviewManagement.js
import React, { useState, useEffect } from 'react';
import './InterviewManagement.css';

const InterviewManagement = ({ user, userProfile }) => {
  const [interviews, setInterviews] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState('grid'); // 'grid' or 'calendar'
  const [newInterview, setNewInterview] = useState({
    candidateId: '',
    position: '',
    interviewType: 'technical',
    scheduledDate: '',
    scheduledTime: '',
    duration: 60,
    interviewers: [],
    meetingLink: '',
    notes: ''
  });

  // Mock data - replace with API calls
  useEffect(() => {
    const mockCandidates = [
      {
      id: 1,
      name: 'Thabo Mokoena',
      position: 'Senior Developer',
      status: 'qualified',
      email: 'thabo.mokoena@email.com',
      phone: '+266 58012345', // Lesotho format
      experience: '5 years',
      skills: ['React', 'Node.js', 'TypeScript']
    },
    {
      id: 2,
      name: 'Naledi Dlamini',
      position: 'UX Designer',
      status: 'qualified',
      email: 'naledi.dlamini@email.com',
      phone: '+27 72 456 7890', // South Africa format
      experience: '3 years',
      skills: ['Figma', 'UI/UX', 'Prototyping']
    },
    {
      id: 3,
      name: 'Kabelo Ndlovu',
      position: 'Product Manager',
      status: 'qualified',
      email: 'kabelo.ndlovu@email.com',
      phone: '+267 71 234 567', // Botswana format
      experience: '6 years',
      skills: ['Agile', 'Scrum', 'Product Strategy']
    }
  ];

  const mockInterviews = [
    {
      id: 1,
      candidateId: 1,
      candidateName: 'Thabo Mokoena',
      position: 'Senior Developer',
      interviewType: 'technical',
      scheduledDate: '2024-01-20',
      scheduledTime: '14:00',
      duration: 60,
      status: 'scheduled',
      interviewers: ['Palesa Khumalo', 'Neo Sechele'],
      meetingLink: 'https://meet.google.com/abc-def-ghi',
      notes: 'Focus on React and Node.js experience',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      candidateId: 2,
      candidateName: 'Naledi Dlamini',
      position: 'UX Designer',
      interviewType: 'portfolio_review',
      scheduledDate: '2024-01-18',
      scheduledTime: '11:00',
      duration: 45,
      status: 'completed',
      interviewers: ['Neo Sechele'],
      meetingLink: 'https://meet.google.com/jkl-mno-pqr',
      notes: 'Review design portfolio and case studies',
      feedback: 'Strong portfolio, good communication skills',
      rating: 4,
      createdAt: '2024-01-10'
    },
    {
      id: 3,
      candidateId: 3,
      candidateName: 'Kabelo Ndlovu',
      position: 'Product Manager',
      interviewType: 'cultural_fit',
      scheduledDate: '2024-01-22',
      scheduledTime: '16:00',
      duration: 90,
      status: 'scheduled',
      interviewers: ['Palesa Khumalo', 'Boitumelo Maseko'],
      meetingLink: 'https://meet.google.com/stu-vwx-yz',
      notes: 'Discuss product strategy and team management',
      createdAt: '2024-01-12'
    }
    ];

    setCandidates(mockCandidates);
    setInterviews(mockInterviews);
  }, []);

  const filteredInterviews = filter === 'all' 
    ? interviews 
    : interviews.filter(interview => interview.status === filter);

  const upcomingInterviews = interviews.filter(interview => 
    interview.status === 'scheduled' && 
    new Date(interview.scheduledDate) >= new Date()
  );

  const todayInterviews = interviews.filter(interview => 
    interview.status === 'scheduled' && 
    interview.scheduledDate === new Date().toISOString().split('T')[0]
  );

  const handleScheduleInterview = (e) => {
    e.preventDefault();
    const candidate = candidates.find(c => c.id === parseInt(newInterview.candidateId));
    
    const interview = {
      id: interviews.length + 1,
      candidateId: newInterview.candidateId,
      candidateName: candidate?.name || 'Unknown Candidate',
      position: newInterview.position,
      interviewType: newInterview.interviewType,
      scheduledDate: newInterview.scheduledDate,
      scheduledTime: newInterview.scheduledTime,
      duration: newInterview.duration,
      status: 'scheduled',
      interviewers: newInterview.interviewers,
      meetingLink: newInterview.meetingLink,
      notes: newInterview.notes,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setInterviews([...interviews, interview]);
    setShowScheduleModal(false);
    setNewInterview({
      candidateId: '',
      position: '',
      interviewType: 'technical',
      scheduledDate: '',
      scheduledTime: '',
      duration: 60,
      interviewers: [],
      meetingLink: '',
      notes: ''
    });
  };

  const handleStatusUpdate = (interviewId, newStatus) => {
    setInterviews(interviews.map(interview =>
      interview.id === interviewId ? { ...interview, status: newStatus } : interview
    ));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      scheduled: { class: 'scheduled', label: 'Scheduled' },
      completed: { class: 'completed', label: 'Completed' },
      cancelled: { class: 'cancelled', label: 'Cancelled' },
      no_show: { class: 'no-show', label: 'No Show' }
    };
    return statusConfig[status] || { class: 'scheduled', label: 'Scheduled' };
  };

  const getInterviewType = (type) => {
    const typeConfig = {
      technical: 'Technical',
      cultural_fit: 'Cultural Fit',
      portfolio_review: 'Portfolio Review',
      hr_screening: 'HR Screening',
      final_round: 'Final Round'
    };
    return typeConfig[type] || type;
  };

  const getUpcomingWeekDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const getInterviewsForDate = (date) => {
    return interviews.filter(interview => 
      interview.scheduledDate === date && interview.status === 'scheduled'
    );
  };

  return (
    <div className="interview-management">
      <div className="container-fluid">
        {/* Header Section */}
        <div className="page-header">
          <div className="header-content">
            <h1>Interview Management</h1>
            <p>Schedule and conduct candidate interviews</p>
          </div>
          <div className="header-actions">
            <div className="view-toggle">
              <button 
                className={`toggle-btn ${view === 'grid' ? 'active' : ''}`}
                onClick={() => setView('grid')}
              >
                <i className="fas fa-th"></i> Grid View
              </button>
              <button 
                className={`toggle-btn ${view === 'calendar' ? 'active' : ''}`}
                onClick={() => setView('calendar')}
              >
                <i className="fas fa-calendar"></i> Calendar View
              </button>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => setShowScheduleModal(true)}
            >
              <i className="fas fa-plus"></i> Schedule Interview
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">
              <i className="fas fa-calendar-check"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{interviews.length}</div>
              <div className="stat-label">Total Interviews</div>
            </div>
          </div>
          <div className="stat-card success">
            <div className="stat-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{upcomingInterviews.length}</div>
              <div className="stat-label">Upcoming</div>
            </div>
          </div>
          <div className="stat-card warning">
            <div className="stat-icon">
              <i className="fas fa-calendar-day"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{todayInterviews.length}</div>
              <div className="stat-label">Today</div>
            </div>
          </div>
          <div className="stat-card info">
            <div className="stat-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">
                {interviews.filter(i => i.status === 'completed').length}
              </div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
        </div>

        {/* Today's Interviews Banner */}
        {todayInterviews.length > 0 && (
          <div className="today-banner">
            <div className="banner-header">
              <h3>
                <i className="fas fa-bell"></i>
                Today's Interviews ({todayInterviews.length})
              </h3>
              <span className="banner-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="today-interviews-grid">
              {todayInterviews.map(interview => (
                <div key={interview.id} className="today-interview-card">
                  <div className="time-slot">
                    <div className="time">{interview.scheduledTime}</div>
                    <div className="duration">{interview.duration}min</div>
                  </div>
                  <div className="interview-info">
                    <h4>{interview.candidateName}</h4>
                    <p>{interview.position}</p>
                    <div className="interview-meta">
                      <span className="type">{getInterviewType(interview.interviewType)}</span>
                      <span className="interviewers">{interview.interviewers.join(', ')}</span>
                    </div>
                  </div>
                  <div className="interview-actions">
                    <a 
                      href={interview.meetingLink} 
                      className="btn btn-success btn-sm"
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <i className="fas fa-video"></i> Join
                    </a>
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => setSelectedInterview(interview)}
                    >
                      <i className="fas fa-eye"></i> View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters and Controls */}
        <div className="controls-section">
          <div className="filters">
            <div className="filter-group">
              <label>Filter by Status:</label>
              <div className="filter-buttons">
                <button 
                  className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  All
                </button>
                <button 
                  className={`filter-btn ${filter === 'scheduled' ? 'active' : ''}`}
                  onClick={() => setFilter('scheduled')}
                >
                  Scheduled
                </button>
                <button 
                  className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                  onClick={() => setFilter('completed')}
                >
                  Completed
                </button>
                <button 
                  className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
                  onClick={() => setFilter('cancelled')}
                >
                  Cancelled
                </button>
              </div>
            </div>
          </div>
          
          <div className="quick-actions">
            <button className="btn btn-outline">
              <i className="fas fa-download"></i> Export
            </button>
            <button className="btn btn-outline">
              <i className="fas fa-sync"></i> Refresh
            </button>
          </div>
        </div>

        {/* Main Content - Grid View */}
        {view === 'grid' && (
          <div className="interviews-grid-section">
            <h3>All Interviews</h3>
            {filteredInterviews.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-calendar-times"></i>
                <h4>No interviews found</h4>
                <p>Get started by scheduling your first interview</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowScheduleModal(true)}
                >
                  <i className="fas fa-plus"></i> Schedule Interview
                </button>
              </div>
            ) : (
              <div className="interviews-grid">
                {filteredInterviews.map(interview => (
                  <div key={interview.id} className="interview-card">
                    <div className="card-header">
                      <div className="candidate-info">
                        <h4>{interview.candidateName}</h4>
                        <p>{interview.position}</p>
                      </div>
                      <span className={`status-badge ${getStatusBadge(interview.status).class}`}>
                        {getStatusBadge(interview.status).label}
                      </span>
                    </div>

                    <div className="interview-details">
                      <div className="detail-row">
                        <div className="detail-item">
                          <i className="fas fa-calendar"></i>
                          <span>{new Date(interview.scheduledDate).toLocaleDateString()}</span>
                        </div>
                        <div className="detail-item">
                          <i className="fas fa-clock"></i>
                          <span>{interview.scheduledTime}</span>
                        </div>
                      </div>
                      <div className="detail-row">
                        <div className="detail-item">
                          <i className="fas fa-users"></i>
                          <span>{interview.interviewers.join(', ')}</span>
                        </div>
                        <div className="detail-item">
                          <i className="fas fa-video"></i>
                          <span>{getInterviewType(interview.interviewType)}</span>
                        </div>
                      </div>
                    </div>

                    {interview.meetingLink && interview.status === 'scheduled' && (
                      <div className="meeting-section">
                        <a 
                          href={interview.meetingLink} 
                          className="meeting-link"
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <i className="fas fa-external-link-alt"></i>
                          Join Meeting
                        </a>
                      </div>
                    )}

                    {interview.notes && (
                      <div className="notes-section">
                        <p><strong>Notes:</strong> {interview.notes}</p>
                      </div>
                    )}

                    {interview.feedback && (
                      <div className="feedback-section">
                        <div className="feedback-header">
                          <strong>Feedback</strong>
                          {interview.rating && (
                            <div className="rating">
                              {[...Array(5)].map((_, i) => (
                                <i 
                                  key={i}
                                  className={`fas fa-star ${i < interview.rating ? 'filled' : ''}`}
                                ></i>
                              ))}
                            </div>
                          )}
                        </div>
                        <p>{interview.feedback}</p>
                      </div>
                    )}

                    <div className="card-actions">
                      {interview.status === 'scheduled' && (
                        <>
                          <button 
                            className="btn btn-success btn-sm"
                            onClick={() => handleStatusUpdate(interview.id, 'completed')}
                          >
                            <i className="fas fa-check"></i> Complete
                          </button>
                          <button 
                            className="btn btn-warning btn-sm"
                            onClick={() => handleStatusUpdate(interview.id, 'cancelled')}
                          >
                            <i className="fas fa-times"></i> Cancel
                          </button>
                        </>
                      )}
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => setSelectedInterview(interview)}
                      >
                        <i className="fas fa-eye"></i> Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Calendar View */}
        {view === 'calendar' && (
          <div className="calendar-view">
            <h3>Upcoming Week Schedule</h3>
            <div className="week-calendar">
              {getUpcomingWeekDates().map(date => {
                const dateInterviews = getInterviewsForDate(date);
                return (
                  <div key={date} className="calendar-day">
                    <div className="day-header">
                      <div className="day-name">
                        {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className="day-date">
                        {new Date(date).getDate()}
                      </div>
                    </div>
                    <div className="day-interviews">
                      {dateInterviews.length === 0 ? (
                        <div className="no-interviews">No interviews</div>
                      ) : (
                        dateInterviews.map(interview => (
                          <div 
                            key={interview.id} 
                            className="calendar-interview"
                            onClick={() => setSelectedInterview(interview)}
                          >
                            <div className="interview-time">{interview.scheduledTime}</div>
                            <div className="interview-candidate">{interview.candidateName}</div>
                            <div className="interview-position">{interview.position}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Schedule Interview Modal */}
        {showScheduleModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Schedule New Interview</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowScheduleModal(false)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form onSubmit={handleScheduleInterview}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Candidate *</label>
                    <select
                      value={newInterview.candidateId}
                      onChange={(e) => setNewInterview({...newInterview, candidateId: e.target.value})}
                      required
                    >
                      <option value="">Select Candidate</option>
                      {candidates.map(candidate => (
                        <option key={candidate.id} value={candidate.id}>
                          {candidate.name} - {candidate.position}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Position *</label>
                    <input
                      type="text"
                      value={newInterview.position}
                      onChange={(e) => setNewInterview({...newInterview, position: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Interview Type *</label>
                    <select
                      value={newInterview.interviewType}
                      onChange={(e) => setNewInterview({...newInterview, interviewType: e.target.value})}
                      required
                    >
                      <option value="technical">Technical Interview</option>
                      <option value="cultural_fit">Cultural Fit</option>
                      <option value="portfolio_review">Portfolio Review</option>
                      <option value="hr_screening">HR Screening</option>
                      <option value="final_round">Final Round</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Date *</label>
                    <input
                      type="date"
                      value={newInterview.scheduledDate}
                      onChange={(e) => setNewInterview({...newInterview, scheduledDate: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Time *</label>
                    <input
                      type="time"
                      value={newInterview.scheduledTime}
                      onChange={(e) => setNewInterview({...newInterview, scheduledTime: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Duration (minutes) *</label>
                    <select
                      value={newInterview.duration}
                      onChange={(e) => setNewInterview({...newInterview, duration: parseInt(e.target.value)})}
                      required
                    >
                      <option value={30}>30 minutes</option>
                      <option value={45}>45 minutes</option>
                      <option value={60}>60 minutes</option>
                      <option value={90}>90 minutes</option>
                      <option value={120}>120 minutes</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label>Interviewers *</label>
                    <input
                      type="text"
                      value={newInterview.interviewers.join(', ')}
                      onChange={(e) => setNewInterview({
                        ...newInterview, 
                        interviewers: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                      })}
                      placeholder="Enter interviewer names separated by commas"
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Meeting Link</label>
                    <input
                      type="url"
                      value={newInterview.meetingLink}
                      onChange={(e) => setNewInterview({...newInterview, meetingLink: e.target.value})}
                      placeholder="https://meet.google.com/..."
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Notes</label>
                    <textarea
                      value={newInterview.notes}
                      onChange={(e) => setNewInterview({...newInterview, notes: e.target.value})}
                      placeholder="Additional notes for the interview..."
                      rows="3"
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => setShowScheduleModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Schedule Interview
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Interview Detail Modal */}
        {selectedInterview && (
          <div className="modal-overlay">
            <div className="modal-content large">
              <div className="modal-header">
                <h3>Interview Details</h3>
                <button 
                  className="close-btn"
                  onClick={() => setSelectedInterview(null)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="interview-detail">
                <div className="detail-section">
                  <h4>Candidate Information</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Name:</label>
                      <span>{selectedInterview.candidateName}</span>
                    </div>
                    <div className="info-item">
                      <label>Position:</label>
                      <span>{selectedInterview.position}</span>
                    </div>
                    <div className="info-item">
                      <label>Interview Type:</label>
                      <span>{getInterviewType(selectedInterview.interviewType)}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Schedule Details</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Date:</label>
                      <span>{new Date(selectedInterview.scheduledDate).toLocaleDateString()}</span>
                    </div>
                    <div className="info-item">
                      <label>Time:</label>
                      <span>{selectedInterview.scheduledTime}</span>
                    </div>
                    <div className="info-item">
                      <label>Duration:</label>
                      <span>{selectedInterview.duration} minutes</span>
                    </div>
                    <div className="info-item">
                      <label>Interviewers:</label>
                      <span>{selectedInterview.interviewers.join(', ')}</span>
                    </div>
                  </div>
                </div>

                {selectedInterview.meetingLink && (
                  <div className="detail-section">
                    <h4>Meeting Link</h4>
                    <a href={selectedInterview.meetingLink} target="_blank" rel="noopener noreferrer">
                      {selectedInterview.meetingLink}
                    </a>
                  </div>
                )}

                {selectedInterview.notes && (
                  <div className="detail-section">
                    <h4>Interview Notes</h4>
                    <p>{selectedInterview.notes}</p>
                  </div>
                )}

                {selectedInterview.status === 'completed' && selectedInterview.feedback && (
                  <div className="detail-section">
                    <h4>Interview Feedback</h4>
                    <div className="feedback-section">
                      <p><strong>Feedback:</strong> {selectedInterview.feedback}</p>
                      {selectedInterview.rating && (
                        <div className="rating-display">
                          <strong>Rating:</strong>
                          <div className="rating">
                            {[...Array(5)].map((_, i) => (
                              <i 
                                key={i}
                                className={`fas fa-star ${i < selectedInterview.rating ? 'filled' : ''}`}
                              ></i>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewManagement;