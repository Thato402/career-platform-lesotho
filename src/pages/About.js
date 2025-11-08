// src/pages/About.js
import React from 'react';
import './About.css';

const About = () => {
  const features = [
    {
      icon: 'fas fa-graduation-cap',
      title: 'Student Success',
      description:
        'Connect students with top educational institutions and career opportunities tailored to their skills and interests.',
    },
    {
      icon: 'fas fa-university',
      title: 'Institution Growth',
      description:
        'Educational institutions can showcase their programs, manage applications, and connect with qualified students.',
    },
    {
      icon: 'fas fa-briefcase',
      title: 'Talent Acquisition',
      description:
        'Companies can find the perfect candidates through our advanced matching system and streamlined hiring process.',
    },
    {
      icon: 'fas fa-chart-line',
      title: 'Career Analytics',
      description:
        'Get insights into career trends, skill demands, and market opportunities to make informed decisions.',
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Active Students' },
    { number: '500+', label: 'Partner Institutions' },
    { number: '200+', label: 'Hiring Companies' },
    { number: '95%', label: 'Success Rate' },
  ];

  const teamMembers = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'CEO & Founder',
      bio: 'Former university dean with 15+ years in education technology',
      image: '👩‍💼',
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      bio: 'Tech entrepreneur specializing in EdTech solutions',
      image: '👨‍💻',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Partnerships',
      bio: 'Expert in building educational and corporate relationships',
      image: '👩‍💼',
    },
    {
      name: 'David Thompson',
      role: 'Product Director',
      bio: 'Passionate about creating user-centered career solutions',
      image: '👨‍💼',
    },
  ];

  const testimonials = [
    {
      quote:
        'This platform transformed how we connect with students. Our enrollment quality has improved significantly.',
      author: 'Prof. James Wilson',
      role: 'Director of Admissions, University of Technology',
      avatar: '👨‍🏫',
    },
    {
      quote:
        'As a recent graduate, I found my dream job through CareerPath. The matching system is incredible!',
      author: 'Lisa Zhang',
      role: 'Software Developer at TechCorp',
      avatar: '👩‍🎓',
    },
    {
      quote:
        "We've hired exceptional talent through this platform. The candidate quality is consistently outstanding.",
      author: 'Robert Martinez',
      role: 'HR Director, Innovation Labs',
      avatar: '👨‍💼',
    },
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Transforming Careers, Building Futures</h1>
            <p className="hero-subtitle">
              CareerPath Lesotho is a comprehensive platform connecting students, educational institutions,
              and employers to create meaningful career pathways and opportunities.
            </p>
            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={index} className="hero-stat">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-content">
              <h2>Our Mission</h2>
              <p>
                To bridge the gap between education and employment by providing a seamless platform where
                students can discover their potential, institutions can find qualified candidates, and
                companies can access top talent.
              </p>
              <div className="mission-points">
                <div className="mission-point">
                  <i className="fas fa-bullseye"></i>
                  <span>Empower students to make informed career decisions</span>
                </div>
                <div className="mission-point">
                  <i className="fas fa-handshake"></i>
                  <span>Connect institutions with motivated, qualified students</span>
                </div>
                <div className="mission-point">
                  <i className="fas fa-rocket"></i>
                  <span>Help companies build exceptional teams with the right talent</span>
                </div>
              </div>
            </div>
            <div className="mission-visual">
              <div className="visual-card">
                <i className="fas fa-network-wired"></i>
                <h3>Connected Ecosystem</h3>
                <p>Students, Institutions, and Employers working together</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose CareerPath?</h2>
            <p>Comprehensive solutions for all stakeholders in the career ecosystem</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
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

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Simple, efficient, and effective for everyone</p>
          </div>
          <div className="process-steps">
            {[
              {
                number: 1,
                title: 'Create Your Profile',
                text: 'Students, institutions, and companies create detailed profiles showcasing their strengths and requirements.',
              },
              {
                number: 2,
                title: 'Discover Opportunities',
                text: 'Our intelligent matching system connects you with relevant opportunities based on your profile and preferences.',
              },
              {
                number: 3,
                title: 'Connect & Engage',
                text: 'Communicate directly, schedule interviews, and build meaningful relationships through our platform.',
              },
              {
                number: 4,
                title: 'Achieve Success',
                text: 'Students find their dream education and jobs, institutions enroll qualified students, companies hire top talent.',
              },
            ].map((step, index) => (
              <div key={index} className="process-step">
                <div className="step-number">{step.number}</div>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>Success Stories</h2>
            <p>Hear from our community members</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-content">
                  <p>"{testimonial.quote}"</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.avatar}</div>
                  <div className="author-info">
                    <h4>{testimonial.author}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <h2>Meet Our Team</h2>
            <p>Passionate professionals dedicated to your success</p>
          </div>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <div className="member-avatar">{member.image}</div>
                <h3>{member.name}</h3>
                <p className="member-role">{member.role}</p>
                <p className="member-bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Career Journey?</h2>
            <p>Join thousands of students, institutions, and companies already using CareerPath Lesotho</p>
            <div className="cta-buttons">
              <button className="btn btn-primary">Get Started Today</button>
              <button className="btn btn-outline">Contact Us</button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h3>Get In Touch</h3>
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <span>info@careerpathlesotho.com</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <span>+266 1234 5678</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>Maseru, Lesotho</span>
              </div>
            </div>
            <div className="newsletter">
              <h3>Stay Updated</h3>
              <p>Subscribe to our newsletter for the latest updates and opportunities</p>
              <div className="newsletter-form">
                <input type="email" placeholder="Enter your email" />
                <button className="btn btn-primary">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
