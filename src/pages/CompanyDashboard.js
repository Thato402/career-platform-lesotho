import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getJobs, createJob } from '../services/realtimeDb';

const CompanyDashboard = ({ user, userProfile }) => {
  const [jobs, setJobs] = useState([]);
  const [showJobForm, setShowJobForm] = useState(false);
  const [activeTab, setActiveTab] = useState('jobs');
  const [loading, setLoading] = useState(true);

  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    requirements: '',
    salary: '',
    location: '',
    type: 'Full-time',
    qualifications: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      if (user && userProfile?.role === 'company') {
        try {
          const jobsData = await getJobs();
          setJobs(jobsData);
        } catch (error) {
          console.error('Error fetching jobs:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, userProfile]);

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    try {
      await createJob({
        ...jobForm,
        company: userProfile?.name || 'Your Company',
        requirements: jobForm.requirements.split(',').map(req => req.trim()),
        qualifications: jobForm.qualifications.split(',').map(qual => qual.trim())
      });
      
      // Refresh jobs
      const updatedJobs = await getJobs();
      setJobs(updatedJobs);
      setShowJobForm(false);
      setJobForm({
        title: '',
        description: '',
        requirements: '',
        salary: '',
        location: '',
        type: 'Full-time',
        qualifications: ''
      });
      alert('Job posted successfully!');
    } catch (error) {
      alert('Error posting job: ' + error.message);
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (userProfile?.role !== 'company') {
    return (
      <div className="container" style={{ padding: '50px 0', textAlign: 'center' }}>
        <h2>Company dashboard is only available for registered companies</h2>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Company Dashboard</h1>
          <p>Manage job postings and view qualified candidates</p>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid #ddd' }}>
            <button
              className={`btn ${activeTab === 'jobs' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('jobs')}
              style={{ border: 'none', borderBottom: activeTab === 'jobs' ? '2px solid var(--primary)' : 'none' }}
            >
              <i className="fas fa-briefcase"></i> Job Postings ({jobs.length})
            </button>
            <button
              className={`btn ${activeTab === 'candidates' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('candidates')}
              style={{ border: 'none', borderBottom: activeTab === 'candidates' ? '2px solid var(--primary)' : 'none' }}
            >
              <i className="fas fa-users"></i> Candidates
            </button>
          </div>
        </div>

        {activeTab === 'jobs' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <button 
                className="btn btn-primary"
                onClick={() => setShowJobForm(true)}
              >
                <i className="fas fa-plus"></i> Post New Job
              </button>
            </div>

            {showJobForm && (
              <div className="form-container" style={{ marginBottom: '30px' }}>
                <h3>Post New Job</h3>
                <form onSubmit={handleJobSubmit}>
                  <div className="form-group">
                    <label>Job Title</label>
                    <input
                      type="text"
                      value={jobForm.title}
                      onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Job Description</label>
                    <textarea
                      value={jobForm.description}
                      onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                      required
                      rows="4"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        value={jobForm.location}
                        onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Salary Range</label>
                      <input
                        type="text"
                        value={jobForm.salary}
                        onChange={(e) => setJobForm({...jobForm, salary: e.target.value})}
                        placeholder="e.g., M15,000 - M20,000"
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div className="form-group">
                      <label>Job Type</label>
                      <select
                        value={jobForm.type}
                        onChange={(e) => setJobForm({...jobForm, type: e.target.value})}
                        required
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Requirements (comma-separated)</label>
                    <textarea
                      value={jobForm.requirements}
                      onChange={(e) => setJobForm({...jobForm, requirements: e.target.value})}
                      placeholder="e.g., Bachelor's degree, 2 years experience, JavaScript skills"
                      required
                      rows="3"
                    />
                  </div>

                  <div className="form-group">
                    <label>Qualifications (comma-separated)</label>
                    <textarea
                      value={jobForm.qualifications}
                      onChange={(e) => setJobForm({...jobForm, qualifications: e.target.value})}
                      placeholder="e.g., Computer Science degree, React experience, Team leadership"
                      required
                      rows="3"
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn btn-primary">
                      <i className="fas fa-paper-plane"></i> Post Job
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline"
                      onClick={() => setShowJobForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="features-grid">
              {jobs.map(job => (
                <div key={job.id} className="feature-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                    <div>
                      <h3 style={{ marginBottom: '5px' }}>{job.title}</h3>
                      <p style={{ color: 'var(--primary)', fontWeight: '600', margin: 0 }}>
                        {job.company} • {job.location}
                      </p>
                    </div>
                    <span style={{ 
                      background: 'var(--success)', 
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.8rem'
                    }}>
                      {job.type}
                    </span>
                  </div>
                  
                  <p style={{ marginBottom: '15px' }}>{job.description}</p>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <strong>Salary:</strong> {job.salary}
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <strong>Requirements:</strong>
                    <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                      {job.requirements?.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <button className="btn btn-primary">
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button className="btn btn-outline">
                      <i className="fas fa-users"></i> View Applicants
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'candidates' && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray)' }}>
            <i className="fas fa-users" style={{ fontSize: '3rem', marginBottom: '20px' }}></i>
            <h3>Candidate Matching</h3>
            <p>View qualified candidates who match your job requirements.</p>
            <div style={{ 
              background: 'rgba(76, 201, 240, 0.1)', 
              padding: '20px', 
              borderRadius: 'var(--radius)',
              marginTop: '20px'
            }}>
              <h4>AI-Powered Candidate Matching Coming Soon</h4>
              <p>Our smart algorithm will automatically match your job requirements with qualified graduates based on:</p>
              <ul style={{ textAlign: 'left', display: 'inline-block' }}>
                <li>Academic performance</li>
                <li>Relevant skills and certificates</li>
                <li>Work experience</li>
                <li>Course relevance</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;