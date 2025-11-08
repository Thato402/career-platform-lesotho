import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <h3>CareerPath Lesotho</h3>
            <p>Bridging the gap between education and employment in Lesotho through innovative technology solutions.</p>
            <div className="social-links" style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
              <a href="#" style={{ color: '#adb5bd', fontSize: '1.2rem' }}><i className="fab fa-facebook"></i></a>
              <a href="#" style={{ color: '#adb5bd', fontSize: '1.2rem' }}><i className="fab fa-twitter"></i></a>
              <a href="#" style={{ color: '#adb5bd', fontSize: '1.2rem' }}><i className="fab fa-linkedin"></i></a>
              <a href="#" style={{ color: '#adb5bd', fontSize: '1.2rem' }}><i className="fab fa-instagram"></i></a>
            </div>
          </div>
          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/institutions">Institutions</Link></li>
              <li><Link to="/courses">Courses</Link></li>
              <li><Link to="/jobs">Job Listings</Link></li>
              <li><Link to="/about">About Us</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Support</h3>
            <ul className="footer-links">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Contact Info</h3>
            <ul className="footer-links">
              <li><i className="fas fa-map-marker-alt"></i> Limkokwing University, Maseru</li>
              <li><i className="fas fa-phone"></i> +266 2231 2135</li>
              <li><i className="fas fa-envelope"></i> info@careerpath.ls</li>
              <li><i className="fas fa-clock"></i> Mon - Fri: 8:00 AM - 5:00 PM</li>
            </ul>
          </div>
        </div>
        <div className="copyright">
          <p>&copy; 2025 CareerPath Lesotho. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;