// components/HiringMetrics.js
import React from 'react';
import './HiringMetrics.css';

const HiringMetrics = () => {
  const metricsData = {
    overview: [
      { label: 'Open Positions', value: '12', change: '+2', trend: 'up' },
      { label: 'Applications', value: '245', change: '+15%', trend: 'up' },
      { label: 'Interview Rate', value: '23%', change: '+5%', trend: 'up' },
      { label: 'Time to Hire', value: '28 days', change: '-3 days', trend: 'down' }
    ],
    stages: [
      { stage: 'Applied', count: 245, percentage: 100 },
      { stage: 'Screening', count: 189, percentage: 77 },
      { stage: 'Interview', count: 56, percentage: 23 },
      { stage: 'Offer', count: 12, percentage: 5 },
      { stage: 'Hired', count: 8, percentage: 3 }
    ]
  };

  return (
    <div className="hiring-metrics">
      <div className="page-header">
        <h1>Hiring Metrics</h1>
        <p>Track and analyze your recruitment performance</p>
      </div>

      <div className="metrics-overview">
        {metricsData.overview.map((metric, index) => (
          <div key={index} className="metric-card">
            <div className="metric-value">{metric.value}</div>
            <div className="metric-label">{metric.label}</div>
            <div className={`metric-change ${metric.trend}`}>
              {metric.change}
            </div>
          </div>
        ))}
      </div>

      <div className="metrics-details">
        <div className="pipeline-section">
          <h2>Recruitment Pipeline</h2>
          <div className="pipeline-stages">
            {metricsData.stages.map((stage, index) => (
              <div key={index} className="pipeline-stage">
                <div className="stage-header">
                  <span className="stage-name">{stage.stage}</span>
                  <span className="stage-count">{stage.count}</span>
                </div>
                <div className="stage-bar">
                  <div 
                    className="stage-progress" 
                    style={{ width: `${stage.percentage}%` }}
                  ></div>
                </div>
                <div className="stage-percentage">{stage.percentage}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="insights-section">
          <h2>Key Insights</h2>
          <div className="insights-list">
            <div className="insight-item positive">
              <div className="insight-icon"></div>
              <div className="insight-content">
                <h4>Application volume increased</h4>
                <p>15% more applications this month compared to last month</p>
              </div>
            </div>
            <div className="insight-item warning">
              <div className="insight-icon"></div>
              <div className="insight-content">
                <h4>Interview to hire ratio low</h4>
                <p>Only 14% of interviews result in offers</p>
              </div>
            </div>
            <div className="insight-item positive">
              <div className="insight-icon"></div>
              <div className="insight-content">
                <h4>Time to hire improving</h4>
                <p>Average hiring time reduced by 3 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HiringMetrics;