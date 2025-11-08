import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

const Transcripts = ({ user, userProfile }) => {
  const [transcripts, setTranscripts] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (userProfile?.role !== 'student') {
    return (
      <div className="container" style={{ padding: '50px 0', textAlign: 'center' }}>
        <h2>Transcript management is only available for students</h2>
      </div>
    );
  }

  const handleFileUpload = async (files) => {
    setUploading(true);
    setTimeout(() => {
      const newTranscripts = Array.from(files).map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        uploadDate: new Date().toLocaleDateString(),
        status: Math.random() > 0.5 ? 'verified' : 'pending',
        verifiedBy: Math.random() > 0.5 ? 'NUL Registrar' : null
      }));
      setTranscripts(prev => [...prev, ...newTranscripts]);
      setUploading(false);
      alert('Transcripts uploaded successfully! They will be verified by the institution.');
    }, 2000);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    handleFileUpload(files);
  };

  const removeTranscript = (id) => {
    setTranscripts(prev => prev.filter(t => t.id !== id));
  };

  const downloadTranscript = (transcript) => {
    alert(`Downloading ${transcript.name}`);
  };

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Academic Transcripts</h1>
          <p>Upload and manage your academic documents for job applications</p>
        </div>

        <div className="form-container">
          <h3>Upload Transcripts</h3>
          <div
            style={{
              border: `2px dashed ${dragOver ? 'var(--primary)' : '#ddd'}`,
              borderRadius: 'var(--radius)',
              padding: '40px',
              textAlign: 'center',
              background: dragOver ? 'rgba(67, 97, 238, 0.05)' : '#fafafa',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              marginBottom: '20px'
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input').click()}
          >
            <i className="fas fa-cloud-upload-alt" style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '15px' }}></i>
            <h4>Upload Your Transcripts</h4>
            <p>Drag and drop files here or click to browse</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>
              Supported formats: PDF, JPG, PNG (Max 10MB each)
            </p>
          </div>

          <input
            type="file"
            id="file-input"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            style={{ display: 'none' }}
            onChange={handleFileInput}
          />

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              className="btn btn-primary"
              onClick={() => document.getElementById('file-input').click()}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Uploading...
                </>
              ) : (
                <>
                  <i className="fas fa-folder-open"></i> Browse Files
                </>
              )}
            </button>
          </div>
        </div>

        {transcripts.length > 0 && (
          <div className="form-container">
            <h3>Your Transcripts ({transcripts.length})</h3>
            <div className="features-grid">
              {transcripts.map(transcript => (
                <div key={transcript.id} className="feature-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                    <div>
                      <h4 style={{ marginBottom: '5px' }}>{transcript.name}</h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--gray)', margin: 0 }}>
                        {transcript.size} • {transcript.uploadDate}
                      </p>
                    </div>
                    <button
                      onClick={() => removeTranscript(transcript.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--danger)',
                        cursor: 'pointer',
                        fontSize: '1.1rem'
                      }}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 12px',
                    background: transcript.status === 'verified' ? 'rgba(75, 181, 67, 0.1)' : 'rgba(255, 204, 0, 0.1)',
                    borderRadius: 'var(--radius)',
                    color: transcript.status === 'verified' ? 'var(--success)' : 'var(--warning)',
                    marginBottom: '10px'
                  }}>
                    <span>
                      <i className={`fas ${transcript.status === 'verified' ? 'fa-check-circle' : 'fa-clock'}`}></i>
                      {' '}{transcript.status === 'verified' ? 'Verified' : 'Pending Verification'}
                    </span>
                    {transcript.verifiedBy && (
                      <small style={{ fontSize: '0.8rem' }}>
                        by {transcript.verifiedBy}
                      </small>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      className="btn btn-outline" 
                      style={{ flex: 1 }}
                      onClick={() => downloadTranscript(transcript)}
                    >
                      <i className="fas fa-download"></i> Download
                    </button>
                    <button 
                      className="btn btn-primary" 
                      style={{ flex: 1 }}
                      onClick={() => alert('This transcript will be included in your job applications')}
                    >
                      <i className="fas fa-paper-plane"></i> Use in Applications
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {transcripts.length === 0 && !uploading && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray)' }}>
            <i className="fas fa-file-pdf" style={{ fontSize: '3rem', marginBottom: '20px' }}></i>
            <h3>No transcripts uploaded</h3>
            <p>Upload your academic transcripts to enhance your job applications.</p>
            <div style={{ 
              background: 'rgba(76, 201, 240, 0.1)', 
              padding: '20px', 
              borderRadius: 'var(--radius)',
              marginTop: '20px',
              textAlign: 'left'
            }}>
              <h4>Why upload transcripts?</h4>
              <ul>
                <li>Increase your chances of admission</li>
                <li>Qualify for better job opportunities</li>
                <li>Showcase your academic achievements</li>
                <li>Fast-track application processes</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transcripts;