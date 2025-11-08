import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminSettings = ({ user, userProfile }) => {
  if (!user || userProfile?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>System Settings</h1>
          <p>Configure platform settings and preferences</p>
        </div>

        <div className="form-container">
          <h3>Platform Configuration</h3>
          
          <div className="form-group">
            <label>Platform Name</label>
            <input type="text" defaultValue="CareerPath LS" />
          </div>

          <div className="form-group">
            <label>Admin Email</label>
            <input type="email" defaultValue="admin@careerpath.ls" />
          </div>

          <div className="form-group">
            <label>System Maintenance</label>
            <select>
              <option>Online</option>
              <option>Maintenance Mode</option>
            </select>
          </div>

          <div className="form-group">
            <label>User Registration</label>
            <select>
              <option>Open</option>
              <option>Invite Only</option>
              <option>Closed</option>
            </select>
          </div>

          <button className="btn btn-primary">Save Settings</button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;