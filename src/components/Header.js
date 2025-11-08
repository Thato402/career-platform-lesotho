import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ user, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    setMobileMenuOpen(false);
  };

  return (
    <header>
      <div className="container">
        <nav className="navbar">
          <Link to="/" className="logo">
            <i className="fas fa-graduation-cap"></i>
            <span>CareerPath Lesotho</span>
          </Link>
          
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/institutions">Institutions</Link>
            <Link to="/courses">Courses</Link>
            <Link to="/jobs">Jobs</Link>
            <Link to="/about">About</Link>
          </div>

          <div className="auth-buttons">
            {user ? (
              <>
                <Link to="/dashboard" className="btn btn-outline">
                  <i className="fas fa-user"></i> Dashboard
                </Link>
                <button className="btn btn-primary" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline">Login</Link>
                <Link to="/register" className="btn btn-primary">Sign Up</Link>
              </>
            )}
          </div>

          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className="fas fa-bars"></i>
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu" style={{
            position: 'fixed',
            top: '80px',
            left: 0,
            right: 0,
            background: 'var(--dark)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            zIndex: 1000
          }}>
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/institutions" onClick={() => setMobileMenuOpen(false)}>Institutions</Link>
            <Link to="/courses" onClick={() => setMobileMenuOpen(false)}>Courses</Link>
            <Link to="/jobs" onClick={() => setMobileMenuOpen(false)}>Jobs</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)}>About</Link>
            
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;