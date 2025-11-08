import React from 'react';

const Features = () => {
  const features = [
    {
      icon: 'fas fa-search',
      title: 'Discover Institutions',
      description: 'Explore higher learning institutions in Lesotho and the courses they offer with detailed information and requirements.'
    },
    {
      icon: 'fas fa-file-alt',
      title: 'Apply Online',
      description: 'Submit applications to your preferred institutions and courses with our streamlined digital application process.'
    },
    {
      icon: 'fas fa-user-graduate',
      title: 'Track Admissions',
      description: 'Monitor your application status and receive notifications when admission decisions are made.'
    },
    {
      icon: 'fas fa-briefcase',
      title: 'Career Placement',
      description: 'Upload your transcripts and connect with partner companies for employment opportunities after graduation.'
    }
  ];

  return (
    <section className="features">
      <div className="container">
        <div className="section-title">
          <h2>How It Works</h2>
          <p>Our platform connects students, institutions, and employers in a seamless ecosystem</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card fade-in">
              <div className="feature-icon">
                <i className={feature.icon}></i>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;