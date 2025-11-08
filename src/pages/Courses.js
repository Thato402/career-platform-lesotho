import React, { useState, useEffect } from 'react';
import { getCourses } from '../services/realtimeDb';

const Courses = () => {
  // ... component code remains the same, just change the import
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await getCourses();
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ padding: '50px 0', textAlign: 'center' }}>
        <div className="spinner"></div>
        <p>Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="features" style={{ padding: '50px 0' }}>
      <div className="container">
        <div className="section-title">
          <h2>Available Courses</h2>
          <p>Discover courses from higher learning institutions in Lesotho</p>
        </div>

        <div className="features-grid">
          {courses.map(course => (
            <div key={course.id} className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <h3>{course.name}</h3>
              <p style={{ marginBottom: '15px', color: 'var(--primary)', fontWeight: '600' }}>
                {course.institutionName}
              </p>
              <p style={{ marginBottom: '15px' }}>{course.description}</p>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '20px',
                fontSize: '0.9rem'
              }}>
                <div>
                  <strong>Duration:</strong>
                  <div>{course.duration}</div>
                </div>
                <div>
                  <strong>Fee:</strong>
                  <div>M{course.fee}</div>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <strong>Requirements:</strong>
                <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                  {course.requirements?.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>

              <button className="btn btn-primary" style={{ width: '100%' }}>
                <i className="fas fa-file-alt"></i> Apply Now
              </button>
            </div>
          ))}
        </div>

        {courses.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray)' }}>
            <i className="fas fa-search" style={{ fontSize: '3rem', marginBottom: '20px' }}></i>
            <h3>No courses found</h3>
            <p>Try adjusting your filters or check back later for new courses.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;