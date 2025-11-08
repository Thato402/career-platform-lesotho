import React from 'react';

const UserRoles = () => {
  const roles = [
    {
      type: 'student',
      icon: 'fas fa-user-graduate',
      title: 'Students',
      features: [
        'Discover institutions and courses',
        'Apply online (max 2 courses per institution)',
        'Track admission status',
        'Upload academic transcripts',
        'Receive job notifications'
      ]
    },
    {
      type: 'institute',
      icon: 'fas fa-university',
      title: 'Institutions',
      features: [
        'Manage faculties and courses',
        'Review student applications',
        'Publish admissions',
        'Update student status',
        'Maintain institution profile'
      ]
    },
    {
      type: 'company',
      icon: 'fas fa-building',
      title: 'Companies',
      features: [
        'Post job opportunities',
        'Define qualifications and requirements',
        'View filtered applicants',
        'Receive qualified applications',
        'Update company profile'
      ]
    },
    {
      type: 'admin',
      icon: 'fas fa-cogs',
      title: 'Administrators',
      features: [
        'Manage institutions and courses',
        'Monitor registered users',
        'Approve or suspend company accounts',
        'Publish admissions',
        'View system reports'
      ]
    }
  ];

  return (
    <section className="user-roles">
      <div className="container">
        <div className="section-title">
          <h2>Platform For Everyone</h2>
          <p>Tailored experiences for different user roles in the education and employment ecosystem</p>
        </div>
        <div className="roles-container">
          {roles.map((role, index) => (
            <div key={index} className={`role-card ${role.type} fade-in`}>
              <div className="role-header">
                <div className="role-icon">
                  <i className={role.icon}></i>
                </div>
                <h3>{role.title}</h3>
              </div>
              <div className="role-body">
                <ul className="role-features">
                  {role.features.map((feature, idx) => (
                    <li key={idx}>
                      <i className="fas fa-check"></i> {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserRoles;