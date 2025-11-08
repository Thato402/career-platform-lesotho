// src/pages/institute/InstituteAnalytics.js
import React from 'react';
import './InstitutePages.css';

const InstituteAnalytics = () => {
  const analyticsData = {
    overview: {
      totalApplications: 1247,
      approvedApplications: 856,
      rejectionRate: 18,
      enrollmentRate: 78,
      averageProcessingTime: '2.3 days'
    },
    monthlyStats: [
      { month: 'Jan', applications: 245, approved: 189, enrolled: 156 },
      { month: 'Feb', applications: 189, approved: 156, enrolled: 128 },
      { month: 'Mar', applications: 267, approved: 201, enrolled: 167 },
      { month: 'Apr', applications: 198, approved: 154, enrolled: 125 },
      { month: 'May', applications: 234, approved: 182, enrolled: 148 },
      { month: 'Jun', applications: 278, approved: 214, enrolled: 178 }
    ],
    coursePerformance: [
      { course: 'Computer Science', applications: 456, enrollmentRate: 82, satisfaction: 4.5 },
      { course: 'Business Administration', applications: 289, enrollmentRate: 75, satisfaction: 4.2 },
      { course: 'Electrical Engineering', applications: 234, enrollmentRate: 71, satisfaction: 4.3 },
      { course: 'Bachelor of Arts', applications: 198, enrollmentRate: 68, satisfaction: 4.1 }
    ],
    demographicData: {
      regions: [
        { region: 'North India', students: 456 },
        { region: 'South India', students: 389 },
        { region: 'East India', students: 234 },
        { region: 'West India', students: 298 },
        { region: 'International', students: 45 }
      ],
      gender: { male: 65, female: 35 }
    }
  };

  return (
    <div className="institute-page">
      <div className="page-header">
        <h1>Analytics & Reports</h1>
        <p>View admission statistics and performance metrics</p>
        <div className="header-actions">
          <button className="btn btn-outline">
            <i className="fas fa-download"></i> Export Report
          </button>
          <button className="btn btn-primary">
            <i className="fas fa-print"></i> Print
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card primary">
          <div className="metric-icon">
            <i className="fas fa-file-alt"></i>
          </div>
          <div className="metric-content">
            <div className="metric-value">{analyticsData.overview.totalApplications}</div>
            <div className="metric-label">Total Applications</div>
            <div className="metric-trend positive">+12% from last month</div>
          </div>
        </div>
        
        <div className="metric-card success">
          <div className="metric-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="metric-content">
            <div className="metric-value">{analyticsData.overview.approvedApplications}</div>
            <div className="metric-label">Approved Applications</div>
            <div className="metric-trend positive">+8% from last month</div>
          </div>
        </div>
        
        <div className="metric-card warning">
          <div className="metric-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="metric-content">
            <div className="metric-value">{analyticsData.overview.enrollmentRate}%</div>
            <div className="metric-label">Enrollment Rate</div>
            <div className="metric-trend positive">+5% from last month</div>
          </div>
        </div>
        
        <div className="metric-card info">
          <div className="metric-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="metric-content">
            <div className="metric-value">{analyticsData.overview.averageProcessingTime}</div>
            <div className="metric-label">Avg. Processing Time</div>
            <div className="metric-trend negative">-0.5 days</div>
          </div>
        </div>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="analytics-content">
        <div className="chart-section">
          <div className="chart-card">
            <h3>Applications Trend</h3>
            <div className="chart-placeholder">
              <div className="chart-bars">
                {analyticsData.monthlyStats.map((month, index) => (
                  <div key={month.month} className="bar-container">
                    <div className="bar-group">
                      <div 
                        className="bar applications" 
                        style={{ height: `${(month.applications / 300) * 100}%` }}
                        title={`Applications: ${month.applications}`}
                      ></div>
                      <div 
                        className="bar approved" 
                        style={{ height: `${(month.approved / 300) * 100}%` }}
                        title={`Approved: ${month.approved}`}
                      ></div>
                    </div>
                    <div className="bar-label">{month.month}</div>
                  </div>
                ))}
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-color applications"></div>
                  <span>Applications</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color approved"></div>
                  <span>Approved</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="stats-section">
          <div className="stats-card">
            <h3>Course Performance</h3>
            <div className="performance-list">
              {analyticsData.coursePerformance.map(course => (
                <div key={course.course} className="performance-item">
                  <div className="course-name">{course.course}</div>
                  <div className="course-stats">
                    <span className="stat">{course.applications} apps</span>
                    <span className="stat">{course.enrollmentRate}% enrollment</span>
                    <span className="stat">
                      <i className="fas fa-star"></i> {course.satisfaction}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="stats-card">
            <h3>Student Demographics</h3>
            <div className="demographics">
              <div className="demographic-item">
                <h4>Regional Distribution</h4>
                <div className="regions-list">
                  {analyticsData.demographicData.regions.map(region => (
                    <div key={region.region} className="region-item">
                      <span className="region-name">{region.region}</span>
                      <span className="region-count">{region.students} students</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="demographic-item">
                <h4>Gender Ratio</h4>
                <div className="gender-chart">
                  <div className="gender male">
                    <div className="gender-bar" style={{ width: `${analyticsData.demographicData.gender.male}%` }}>
                      <span>Male {analyticsData.demographicData.gender.male}%</span>
                    </div>
                  </div>
                  <div className="gender female">
                    <div className="gender-bar" style={{ width: `${analyticsData.demographicData.gender.female}%` }}>
                      <span>Female {analyticsData.demographicData.gender.female}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstituteAnalytics;