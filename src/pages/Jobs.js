import React, { useState, useEffect } from 'react';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);

  // ================= MOCK JOB DATA =================
  useEffect(() => {
    const jobList = [
      {
        id: 1,
        title: 'Lecturer – Computer Science',
        department: 'Faculty of Science and Technology',
        type: 'Full-Time',
        location: 'Roma Campus, Lesotho',
        posted: 'October 25, 2025',
        closingDate: 'November 30, 2025',
        salary: 'LSL 320,000 per annum',
        description:
          'The Department of Computer Science seeks a qualified Lecturer to teach undergraduate and postgraduate modules, supervise research, and contribute to departmental development.',
        requirements: [
          'Master’s degree in Computer Science or related field (PhD preferred)',
          'Minimum of 2 years teaching or industry experience',
          'Proficiency in programming, AI, or database systems',
          'Strong communication and mentorship skills'
        ]
      },
      {
        id: 2,
        title: 'Administrative Assistant – Registrar’s Office',
        department: 'Administration',
        type: 'Contract (12 months)',
        location: 'Roma Campus, Lesotho',
        posted: 'October 20, 2025',
        closingDate: 'November 15, 2025',
        salary: 'LSL 150,000 per annum',
        description:
          'The Registrar’s Office is seeking an organized and proactive Administrative Assistant to support daily academic and student service operations.',
        requirements: [
          'Diploma or Degree in Office Administration or related field',
          'Excellent organizational and communication skills',
          'Experience with Microsoft Office Suite',
          'Ability to maintain confidentiality and professionalism'
        ]
      },
      {
        id: 3,
        title: 'Research Fellow – Climate Change and Sustainability',
        department: 'Institute for Environmental Studies',
        type: 'Research Grant (2 years)',
        location: 'Maseru Campus, Lesotho',
        posted: 'October 10, 2025',
        closingDate: 'December 5, 2025',
        salary: 'LSL 400,000 per annum (grant-based)',
        description:
          'This role involves leading research projects focused on climate resilience, renewable energy policy, and sustainable development in Southern Africa.',
        requirements: [
          'PhD in Environmental Science, Policy, or related field',
          'Strong research and publication record',
          'Experience managing research grants and field projects',
          'Excellent report writing and presentation skills'
        ]
      },
      {
        id: 4,
        title: 'Campus Security Officer',
        department: 'Campus Security Department',
        type: 'Full-Time',
        location: 'Roma Campus, Lesotho',
        posted: 'October 18, 2025',
        closingDate: 'November 10, 2025',
        salary: 'LSL 120,000 per annum',
        description:
          'Responsible for ensuring the safety of students, staff, and university property through patrols, monitoring, and reporting incidents.',
        requirements: [
          'High school certificate or equivalent',
          'At least 2 years’ experience in a similar security role',
          'Strong observation and communication skills',
          'Willingness to work shifts and weekends'
        ]
      }
    ];
    setJobs(jobList);
  }, []);

  return (
    <div className="features" style={{ padding: '50px 0' }}>
      <div className="container">
        <div className="section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2>Career Opportunities</h2>
          <p>Explore available job positions at leading universities and institutions</p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '25px'
          }}
        >
          {jobs.map((job) => (
            <div
              key={job.id}
              style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
                padding: '25px',
                transition: 'transform 0.2s ease',
                borderLeft: '4px solid var(--secondary)'
              }}
              className="hover-card"
            >
              <h3 style={{ color: 'var(--secondary)', marginBottom: '10px' }}>{job.title}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>
                <i className="fas fa-building"></i> {job.department}
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>
                <i className="fas fa-map-marker-alt"></i> {job.location}
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>
                <i className="fas fa-clock"></i> {job.type}
              </p>

              <div style={{ margin: '15px 0', fontSize: '0.85rem', color: '#555' }}>
                {job.description}
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--gray)', marginBottom: '10px' }}>
                <strong>Posted:</strong> {job.posted} <br />
                <strong>Closing Date:</strong> {job.closingDate}
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '10px' }}>
                <strong>Salary:</strong> {job.salary}
              </div>

              <div style={{ marginBottom: '10px' }}>
                <strong>Requirements:</strong>
                <ul style={{ paddingLeft: '18px', marginTop: '5px', fontSize: '0.85rem' }}>
                  {job.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>

              <button
                style={{
                  background: 'var(--secondary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'background 0.3s ease'
                }}
                onClick={() => alert(`Applied successfully for ${job.title}`)}
              >
                <i className="fas fa-paper-plane"></i> Apply Now
              </button>
            </div>
          ))}
        </div>

        {jobs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px', color: 'var(--gray)' }}>
            <i className="fas fa-briefcase" style={{ fontSize: '3rem', marginBottom: '20px' }}></i>
            <h3>No Available Positions</h3>
            <p>Check back soon for new opportunities.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
