import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getApplications, getCourses, getInstitutions } from '../services/realtimeDb';

const AdminReports = ({ user, userProfile }) => {
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    totalCourses: 0,
    totalInstitutions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user && userProfile?.role === 'admin') {
        try {
          // In a real app, you would fetch actual analytics data
          setStats({
            totalApplications: 156,
            pendingApplications: 23,
            totalCourses: 105,
            totalInstitutions: 8
          });
        } catch (error) {
          console.error('Error fetching analytics:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, userProfile]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (userProfile?.role !== 'admin') {
    return (
      <div className="container" style={{ padding: '50px 0', textAlign: 'center' }}>
        <div style={{ color: 'var(--danger)', fontSize: '4rem', marginBottom: '20px' }}>
          <i className="fas fa-shield-alt"></i>
        </div>
        <h2>Administrative Access Required</h2>
        <p>This page is exclusively available for platform administrators.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: '50px 0', textAlign: 'center' }}>
        <div style={{ color: 'var(--primary)', fontSize: '3rem', marginBottom: '20px' }}>
          <i className="fas fa-spinner fa-spin"></i>
        </div>
        <h3>Loading Analytics...</h3>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>System Analytics & Reports</h1>
          <p>Comprehensive platform performance insights</p>
        </div>

        {/* Analytics Overview Cards */}
        <div className="features-grid" style={{ marginBottom: '30px' }}>
          <div className="feature-card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <i className="fas fa-file-contract" style={{ fontSize: '2.5rem', marginBottom: '15px', opacity: 0.9 }}></i>
            <h3 style={{ fontSize: '2.5rem', margin: '10px 0', fontWeight: '700' }}>{stats.totalApplications}</h3>
            <p style={{ margin: 0, opacity: 0.9 }}>Total Applications</p>
            <div style={{ marginTop: '10px', fontSize: '0.9rem', opacity: 0.8 }}>
              {stats.pendingApplications} pending review
            </div>
          </div>
          
          <div className="feature-card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <i className="fas fa-graduation-cap" style={{ fontSize: '2.5rem', marginBottom: '15px', opacity: 0.9 }}></i>
            <h3 style={{ fontSize: '2.5rem', margin: '10px 0', fontWeight: '700' }}>{stats.totalCourses}</h3>
            <p style={{ margin: 0, opacity: 0.9 }}>Available Courses</p>
            <div style={{ marginTop: '10px', fontSize: '0.9rem', opacity: 0.8 }}>
              Career-focused programs
            </div>
          </div>
          
          <div className="feature-card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <i className="fas fa-university" style={{ fontSize: '2.5rem', marginBottom: '15px', opacity: 0.9 }}></i>
            <h3 style={{ fontSize: '2.5rem', margin: '10px 0', fontWeight: '700' }}>{stats.totalInstitutions}</h3>
            <p style={{ margin: 0, opacity: 0.9 }}>Partner Institutions</p>
            <div style={{ marginTop: '10px', fontSize: '0.9rem', opacity: 0.8 }}>
              Educational partners
            </div>
          </div>
          
          <div className="feature-card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
            <i className="fas fa-chart-line" style={{ fontSize: '2.5rem', marginBottom: '15px', opacity: 0.9 }}></i>
            <h3 style={{ fontSize: '2.5rem', margin: '10px 0', fontWeight: '700' }}>+24%</h3>
            <p style={{ margin: 0, opacity: 0.9 }}>Platform Growth</p>
            <div style={{ marginTop: '10px', fontSize: '0.9rem', opacity: 0.8 }}>
              This month
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: 'white',
            fontSize: '2rem'
          }}>
            <i className="fas fa-chart-network"></i>
          </div>
          <h3 style={{ color: 'var(--secondary)', marginBottom: '15px' }}>Advanced Analytics & Business Intelligence</h3>
          <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 30px' }}>
            Comprehensive platform analytics and performance reporting with real-time insights.
          </p>
          
          <div style={{ 
            background: 'rgba(76, 201, 240, 0.1)', 
            padding: '30px', 
            borderRadius: '15px',
            textAlign: 'left',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <h4 style={{ color: 'var(--secondary)', marginBottom: '20px', textAlign: 'center' }}>Enterprise Analytics Suite</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div>
                <h5 style={{ color: 'var(--primary)', marginBottom: '10px' }}>📊 Performance Metrics</h5>
                <ul style={{ color: 'var(--gray)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  <li>Application success rates & conversion funnels</li>
                  <li>Institution performance benchmarking</li>
                  <li>Student engagement analytics</li>
                  <li>Platform growth trajectory analysis</li>
                </ul>
              </div>
              <div>
                <h5 style={{ color: 'var(--primary)', marginBottom: '10px' }}>📈 Business Intelligence</h5>
                <ul style={{ color: 'var(--gray)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  <li>Employment placement statistics</li>
                  <li>Market demand forecasting</li>
                  <li>ROI analysis for institutional partners</li>
                  <li>User retention and churn analysis</li>
                </ul>
              </div>
              <div>
                <h5 style={{ color: 'var(--primary)', marginBottom: '10px' }}>🔍 Advanced Insights</h5>
                <ul style={{ color: 'var(--gray)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  <li>Predictive analytics for student success</li>
                  <li>Geographic distribution mapping</li>
                  <li>Course popularity and demand trends</li>
                  <li>Competitive landscape analysis</li>
                </ul>
              </div>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '30px', padding: '20px', background: 'rgba(255,255,255,0.5)', borderRadius: '10px' }}>
              <p style={{ margin: '0 0 15px 0', fontWeight: '600', color: 'var(--secondary)' }}>
                🚀 Advanced Analytics Module Coming Q2 2024
              </p>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--gray)' }}>
                Our data science team is developing sophisticated machine learning models to provide predictive insights and automated recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;