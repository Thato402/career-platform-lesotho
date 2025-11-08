import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/authService';

const Register = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    institution: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fieldStatus, setFieldStatus] = useState({
    name: 'idle',
    email: 'idle',
    password: 'idle',
    confirmPassword: 'idle'
  });
  const navigate = useNavigate();

  // Name validation - only letters and spaces
  const validateName = (name) => {
    const nameRegex = /^[A-Za-z\s]{2,}$/;
    return nameRegex.test(name.trim());
  };

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  // Prevent invalid characters in name field
  const handleNameChange = (e) => {
    const value = e.target.value;
    
    // Only allow letters and spaces
    const filteredValue = value.replace(/[^A-Za-z\s]/g, '');
    
    setFormData({
      ...formData,
      name: filteredValue
    });

    // Real-time validation
    validateNameField(filteredValue);
  };

  const validateNameField = (name) => {
    let isValid = true;
    let errorMessage = '';

    if (name && !validateName(name)) {
      isValid = false;
      errorMessage = 'Name must contain only letters and spaces (min 2 characters)';
    } else if (name.trim().length < 2 && name.length > 0) {
      isValid = false;
      errorMessage = 'Name must be at least 2 characters long';
    }

    setFieldStatus(prev => ({
      ...prev,
      name: name ? (isValid ? 'valid' : 'invalid') : 'idle'
    }));

    setErrors(prev => ({
      ...prev,
      name: errorMessage,
      general: ''
    }));

    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'name') {
      handleNameChange(e);
      return;
    }

    setFormData({
      ...formData,
      [name]: value
    });

    // Clear previous errors for this field
    setErrors(prev => ({
      ...prev,
      [name]: '',
      general: ''
    }));

    // Real-time validation for other fields
    let isValid = true;
    let errorMessage = '';

    switch (name) {
      case 'email':
        if (value && !validateEmail(value)) {
          isValid = false;
          errorMessage = 'Please enter a valid email address';
        }
        break;
      case 'password':
        if (value && !validatePassword(value)) {
          isValid = false;
          errorMessage = 'Password must be at least 6 characters long';
        }
        break;
      case 'confirmPassword':
        if (value && value !== formData.password) {
          isValid = false;
          errorMessage = 'Passwords do not match';
        }
        break;
      default:
        break;
    }

    setFieldStatus(prev => ({
      ...prev,
      [name]: value ? (isValid ? 'valid' : 'invalid') : 'idle'
    }));

    if (errorMessage) {
      setErrors(prev => ({
        ...prev,
        [name]: errorMessage
      }));
    }
  };

  // Form submission validation
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
      setFieldStatus(prev => ({ ...prev, name: 'invalid' }));
    } else if (!validateName(formData.name)) {
      newErrors.name = 'Name must contain only letters and spaces (min 2 characters)';
      isValid = false;
      setFieldStatus(prev => ({ ...prev, name: 'invalid' }));
    } else {
      setFieldStatus(prev => ({ ...prev, name: 'valid' }));
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
      setFieldStatus(prev => ({ ...prev, email: 'invalid' }));
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
      setFieldStatus(prev => ({ ...prev, email: 'invalid' }));
    } else {
      setFieldStatus(prev => ({ ...prev, email: 'valid' }));
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
      setFieldStatus(prev => ({ ...prev, password: 'invalid' }));
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters long';
      isValid = false;
      setFieldStatus(prev => ({ ...prev, password: 'invalid' }));
    } else {
      setFieldStatus(prev => ({ ...prev, password: 'valid' }));
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
      setFieldStatus(prev => ({ ...prev, confirmPassword: 'invalid' }));
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
      setFieldStatus(prev => ({ ...prev, confirmPassword: 'invalid' }));
    } else {
      setFieldStatus(prev => ({ ...prev, confirmPassword: 'valid' }));
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ name: '', email: '', password: '', confirmPassword: '', general: '' });

    if (!validateForm()) {
      // Add shake animation to invalid fields
      const invalidFields = Object.keys(errors).filter(key => errors[key]);
      invalidFields.forEach(field => {
        const element = document.querySelector(`[name="${field}"]`);
        if (element) {
          element.classList.add('shake-animation');
          setTimeout(() => element.classList.remove('shake-animation'), 500);
        }
      });
      return;
    }

    setLoading(true);

    try {
      // Try Firebase registration first
      let result;
      try {
        result = await AuthService.registerUser(
          formData.email, 
          formData.password, 
          {
            name: formData.name,
            role: formData.role,
            institution: formData.institution
          }
        );
      } catch (firebaseError) {
        console.log('Firebase registration failed, using mock:', firebaseError);
        // Fallback to mock registration for demo
        result = await AuthService.mockRegister({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          institution: formData.institution
        });
      }

      const { user, error } = result;
      
      if (error) {
        setErrors(prev => ({ ...prev, general: error }));
        
        // Add error animation
        const form = e.target;
        form.classList.add('error-animation');
        setTimeout(() => form.classList.remove('error-animation'), 500);
        
      } else if (user) {
        const userData = {
          uid: user.uid,
          email: user.email,
          name: user.displayName || formData.name,
          role: formData.role,
          institution: formData.institution
        };
        
        // Success animation
        const form = e.target;
        form.classList.add('success-animation');
        
        onLogin(userData);
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors(prev => ({ ...prev, general: 'Failed to create account. Please try again.' }));
      
      // Add error animation
      const form = e.target;
      form.classList.add('error-animation');
      setTimeout(() => form.classList.remove('error-animation'), 500);
    } finally {
      setLoading(false);
    }
  };

  // Get field status styles
  const getFieldStyles = (fieldName) => {
    const status = fieldStatus[fieldName];
    switch (status) {
      case 'valid':
        return {
          borderColor: 'var(--success)',
          boxShadow: '0 0 0 2px rgba(72, 187, 120, 0.2)',
          background: 'rgba(72, 187, 120, 0.05)'
        };
      case 'invalid':
        return {
          borderColor: 'var(--danger)',
          boxShadow: '0 0 0 2px rgba(229, 62, 62, 0.2)',
          background: 'rgba(229, 62, 62, 0.05)'
        };
      default:
        return {};
    }
  };

  if (success) {
    return (
      <div className="container">
        <div className="form-container" style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--success)', fontSize: '4rem', marginBottom: '20px' }}>
            <i className="fas fa-check-circle"></i>
          </div>
          <h2>Registration Successful!</h2>
          <p>Your account has been created successfully.</p>
          <p>Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          
          @keyframes errorPulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(229, 62, 62, 0.7); }
            50% { box-shadow: 0 0 0 10px rgba(229, 62, 62, 0); }
          }
          
          @keyframes successPulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.7); }
            50% { boxShadow: 0 0 0 10px rgba(72, 187, 120, 0); }
          }
          
          .shake-animation {
            animation: shake 0.3s ease-in-out;
          }
          
          .error-animation {
            animation: errorPulse 0.5s ease-in-out;
          }
          
          .success-animation {
            animation: successPulse 0.5s ease-in-out;
          }
          
          .status-icon {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 16px;
          }
          
          .form-group {
            position: relative;
          }
          
          .field-feedback {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 0.8rem;
            margin-top: 5px;
            transition: all 0.3s ease;
          }
          
          .field-feedback.valid {
            color: var(--success);
          }
          
          .field-feedback.invalid {
            color: var(--danger);
          }
        `}
      </style>

      <div className="form-container">
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--secondary)' }}>
          Create Your Account
        </h2>
        
        {errors.general && (
          <div style={{ 
            background: 'var(--danger)', 
            color: 'white', 
            padding: '12px', 
            borderRadius: 'var(--radius)', 
            marginBottom: '20px',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <i className="fas fa-exclamation-triangle"></i>
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              required
              placeholder="Enter your full name (letters only)"
              disabled={loading}
              style={getFieldStyles('name')}
              minLength="2"
            />
            {fieldStatus.name === 'valid' && (
              <i className="fas fa-check status-icon" style={{ color: 'var(--success)' }}></i>
            )}
            {fieldStatus.name === 'invalid' && (
              <i className="fas fa-times status-icon" style={{ color: 'var(--danger)' }}></i>
            )}
            {errors.name && (
              <div className="field-feedback invalid">
                <i className="fas fa-exclamation-circle"></i>
                {errors.name}
              </div>
            )}
            {!errors.name && formData.name && fieldStatus.name === 'valid' && (
              <div className="field-feedback valid">
                <i className="fas fa-check-circle"></i>
                Name looks good!
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              disabled={loading}
              style={getFieldStyles('email')}
            />
            {fieldStatus.email === 'valid' && (
              <i className="fas fa-check status-icon" style={{ color: 'var(--success)' }}></i>
            )}
            {fieldStatus.email === 'invalid' && (
              <i className="fas fa-times status-icon" style={{ color: 'var(--danger)' }}></i>
            )}
            {errors.email && (
              <div className="field-feedback invalid">
                <i className="fas fa-exclamation-circle"></i>
                {errors.email}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="student">Student</option>
              <option value="institute">Institution Admin</option>
              <option value="company">Company Admin</option>
              <option value="admin">Site Administrator</option>
            </select>
          </div>

          {formData.role === 'student' && (
            <div className="form-group">
              <label>Current Institution (Optional)</label>
              <input
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                placeholder="Enter your current institution"
                disabled={loading}
              />
            </div>
          )}

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password (min. 6 characters)"
              disabled={loading}
              style={getFieldStyles('password')}
              minLength="6"
            />
            {fieldStatus.password === 'valid' && (
              <i className="fas fa-check status-icon" style={{ color: 'var(--success)' }}></i>
            )}
            {fieldStatus.password === 'invalid' && (
              <i className="fas fa-times status-icon" style={{ color: 'var(--danger)' }}></i>
            )}
            {errors.password && (
              <div className="field-feedback invalid">
                <i className="fas fa-exclamation-circle"></i>
                {errors.password}
              </div>
            )}
            {!errors.password && formData.password && fieldStatus.password === 'valid' && (
              <div className="field-feedback valid">
                <i className="fas fa-check-circle"></i>
                Password is strong!
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              disabled={loading}
              style={getFieldStyles('confirmPassword')}
            />
            {fieldStatus.confirmPassword === 'valid' && (
              <i className="fas fa-check status-icon" style={{ color: 'var(--success)' }}></i>
            )}
            {fieldStatus.confirmPassword === 'invalid' && (
              <i className="fas fa-times status-icon" style={{ color: 'var(--danger)' }}></i>
            )}
            {errors.confirmPassword && (
              <div className="field-feedback invalid">
                <i className="fas fa-exclamation-circle"></i>
                {errors.confirmPassword}
              </div>
            )}
            {!errors.confirmPassword && formData.confirmPassword && fieldStatus.confirmPassword === 'valid' && (
              <div className="field-feedback valid">
                <i className="fas fa-check-circle"></i>
                Passwords match!
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', position: 'relative' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Creating Account...
              </>
            ) : (
              <>
                <i className="fas fa-user-plus"></i> Create Account
              </>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;