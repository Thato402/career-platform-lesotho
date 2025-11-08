import React, { useState } from 'react';
import { initializeSampleData } from '../services/realtimeDb';

const InitDatabase = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInitialize = async () => {
    setLoading(true);
    setMessage('Initializing database with sample data...');
    
    try {
      const success = await initializeSampleData();
      if (success) {
        setMessage('Database initialized successfully! Refresh the page to see the data.');
      } else {
        setMessage('Database initialization completed with some warnings. Check console for details.');
      }
    } catch (error) {
      setMessage('Error initializing database: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      margin: '20px 0', 
      border: '1px solid var(--primary)', 
      borderRadius: 'var(--radius)',
      textAlign: 'center',
      background: 'rgba(67, 97, 238, 0.05)'
    }}>
      <h3>📊 Database Setup</h3>
      <p>Click the button below to initialize the database with sample institutions and courses.</p>
      <button 
        onClick={handleInitialize} 
        disabled={loading}
        className="btn btn-primary"
        style={{ marginBottom: '15px' }}
      >
        {loading ? (
          <>
            <i className="fas fa-spinner fa-spin"></i> Initializing...
          </>
        ) : (
          <>
            <i className="fas fa-database"></i> Initialize Database
          </>
        )}
      </button>
      {message && (
        <div style={{ 
          marginTop: '15px', 
          padding: '10px',
          borderRadius: 'var(--radius)',
          background: message.includes('Error') ? 'rgba(220, 53, 69, 0.1)' : 'rgba(75, 181, 67, 0.1)',
          color: message.includes('Error') ? 'var(--danger)' : 'var(--success)',
          border: `1px solid ${message.includes('Error') ? 'var(--danger)' : 'var(--success)'}`
        }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default InitDatabase;