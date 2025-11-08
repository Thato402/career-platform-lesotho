import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/authService';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: ''
  });
  const [loading, setLoading] = useState(false);
  const [fieldStatus, setFieldStatus] = useState({
    email: 'idle', // 'idle', 'valid', 'invalid'
    password: 'idle'
  });
  const navigate = useNavigate();

  // Email validation regex
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  // Real-time validation with lively feedback
  const handleChange = (e) => {
    const { name, value } = e.target;
    
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

    // Real-time validation with visual feedback
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

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: '', password: '', general: '' });

    // Validate form before submission
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
      // Try Firebase authentication first
      let result;
      try {
        result = await AuthService.loginUser(formData.email, formData.password);
      } catch (firebaseError) {
        console.log('Firebase auth failed, using mock auth:', firebaseError);
        // Fallback to mock authentication for demo
        result = await AuthService.mockLogin(formData.email, formData.password);
      }

      const { user, error } = result;
      
      if (error) {
        setErrors(prev => ({ ...prev, general: error }));
        
        // Add error animation
        const form = e.target;
        form.classList.add('error-animation');
        setTimeout(() => form.classList.remove('error-animation'), 500);
        
      } else if (user) {
        // Store user data
        const userData = {
          uid: user.uid,
          email: user.email,
          name: user.displayName || user.profile?.name,
          role: user.profile?.role || 'student',
          institution: user.profile?.institution
        };
        
        // Success animation
        const form = e.target;
        form.classList.add('success-animation');
        
        setTimeout(() => {
          onLogin(userData);
          navigate('/dashboard');
        }, 500);
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors(prev => ({ ...prev, general: 'An unexpected error occurred. Please try again.' }));
      
      // Add error animation
      const form = e.target;
      form.classList.add('error-animation');
      setTimeout(() => form.classList.remove('error-animation'), 500);
    } finally {
      setLoading(false);
    }
  };

  // Demo credentials auto-fill
  const fillDemoCredentials = () => {
    setFormData({
      email: 'demo@careerpath.ls',
      password: 'demopassword123'
    });
    
    // Set fields as valid after filling demo credentials
    setTimeout(() => {
      setFieldStatus({
        email: 'valid',
        password: 'valid'
      });
      setErrors({ email: '', password: '', general: '' });
    }, 100);
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
          Login to Your Account
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
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
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
                Password looks good!
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
                <i className="fas fa-spinner fa-spin"></i> Logging in...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i> Login
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button 
            type="button" 
            className="btn btn-outline" 
            onClick={fillDemoCredentials}
            style={{ marginBottom: '15px' }}
          >
            <i className="fas fa-magic"></i> Use Demo Credentials
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)' }}>Sign up here</Link>
        </p>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '20px', 
          padding: '15px',
          background: 'rgba(76, 201, 240, 0.1)',
          borderRadius: 'var(--radius)',
          fontSize: '0.9rem', 
          color: 'var(--gray)' 
        }}>
          <p><strong>Demo Credentials:</strong></p>
          <p>Email: demo@careerpath.ls</p>
          <p>Password: demopassword123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;