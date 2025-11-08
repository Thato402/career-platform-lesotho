// components/QualifiedApplicants.js
import React, { useState } from 'react';
import './QualifiedApplicants.css';

const QualifiedApplicants = () => {
  const [applicants] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      position: 'Senior Developer',
      experience: '5 years',
      skills: ['React', 'Node.js', 'TypeScript'],
      status: 'Highly Qualified',
      match: 95,
      lastActive: '2 days ago'
    },
    {
      id: 2,
      name: 'Michael Chen',
      position: 'UX Designer',
      experience: '3 years',
      skills: ['Figma', 'UI/UX', 'Prototyping'],
      status: 'Qualified',
      match: 87,
      lastActive: '1 week ago'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      position: 'Product Manager',
      experience: '6 years',
      skills: ['Agile', 'Scrum', 'Product Strategy'],
      status: 'Highly Qualified',
      match: 92,
      lastActive: '3 days ago'
    }
  ]);

  const [filter, setFilter] = useState('all');

  const filteredApplicants = filter === 'all' 
    ? applicants 
    : applicants.filter(app => app.status.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="qualified-applicants">
      <div className="page-header">
        <h1>Qualified Applicants</h1>
        <p>Pre-screened candidates ready for review</p>
      </div>

      <div className="filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Applicants
        </button>
        <button 
          className={`filter-btn ${filter === 'highly' ? 'active' : ''}`}
          onClick={() => setFilter('highly')}
        >
          Highly Qualified
        </button>
        <button 
          className={`filter-btn ${filter === 'qualified' ? 'active' : ''}`}
          onClick={() => setFilter('qualified')}
        >
          Qualified
        </button>
      </div>

      <div className="applicants-grid">
        {filteredApplicants.map(applicant => (
          <div key={applicant.id} className="applicant-card">
            <div className="applicant-header">
              <div className="applicant-avatar">
                {applicant.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="applicant-info">
                <h3>{applicant.name}</h3>
                <p>{applicant.position}</p>
              </div>
              <div className="match-badge">
                {applicant.match}% Match
              </div>
            </div>

            <div className="applicant-details">
              <div className="detail-item">
                <span className="label">Experience:</span>
                <span>{applicant.experience}</span>
              </div>
              <div className="detail-item">
                <span className="label">Status:</span>
                <span className={`status ${applicant.status.toLowerCase().replace(' ', '-')}`}>
                  {applicant.status}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Last Active:</span>
                <span>{applicant.lastActive}</span>
              </div>
            </div>

            <div className="skills-section">
              <h4>Skills:</h4>
              <div className="skills-list">
                {applicant.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>

            <div className="applicant-actions">
              <button className="btn-primary">View Profile</button>
              <button className="btn-secondary">Schedule Interview</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QualifiedApplicants;