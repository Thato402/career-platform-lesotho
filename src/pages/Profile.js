import React from 'react';
import { Navigate } from 'react-router-dom'; // Make sure this import exists

const Profile = ({ user, userProfile }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>My Profile</h1>
          <p>Manage your account information and preferences</p>
        </div>

        <div className="form-container">
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={user.email} disabled />
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input type="text" value={user.name || ''} />
          </div>

          <div className="form-group">
            <label>Role</label>
            <input type="text" value={user.role || ''} disabled />
          </div>

          {user.role === 'student' && (
            <div className="form-group">
              <label>Institution</label>
              <input type="text" value={user.institution || ''} />
            </div>
          )}

          <button className="btn btn-primary">
            <i className="fas fa-save"></i> Update Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;