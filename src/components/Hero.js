import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content fade-in">
          <h1>Your Pathway to Education and Career Success</h1>
          <p>Discover higher learning institutions in Lesotho, apply for courses, and connect with employers for career opportunities - all in one platform.</p>
          <Link to="/register" className="btn btn-primary btn-large">
            <i className="fas fa-rocket"></i> Get Started Today
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;