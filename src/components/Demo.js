import React from 'react';

const Demo = () => {
  return (
    <section className="demo">
      <div className="container">
        <div className="demo-container">
          <div className="demo-content fade-in">
            <h2>Ready to Transform Education and Employment in Lesotho?</h2>
            <p>Our platform bridges the gap between education and employment, creating a seamless pathway for students from application to career placement.</p>
            <p>With smart algorithms that match students to suitable courses and graduates to relevant job opportunities, we're building the future of career development in Lesotho.</p>
            <button className="btn btn-primary">
              <i className="fas fa-play-circle"></i> Watch Demo
            </button>
          </div>
          <div className="demo-image fade-in">
            <h3>Platform Impact</h3>
            <p>Join thousands of users already benefiting from our integrated approach</p>
            <div className="demo-stats">
              <div className="stat">
                <div className="stat-number"></div>
                <div className="stat-label">Students Registered</div>
              </div>
              <div className="stat">
                <div className="stat-number"></div>
                <div className="stat-label">Institutions</div>
              </div>
              <div className="stat">
                <div className="stat-number"></div>
                <div className="stat-label">Partner Companies</div>
              </div>
              <div className="stat">
                <div className="stat-number"></div>
                <div className="stat-label">Successful Placements</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
