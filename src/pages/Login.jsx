import React, { useState } from 'react';
import './auth.css';
import Header from './components/Header';
import api from '../service/api';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import toast, { Toaster } from 'react-hot-toast'


const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };


  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  // Clear existing tokens
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  
  // Show loading toast
  const toastId = toast.loading('Logging in...');

  try {
    const res = await api.post('/api/login/', {
      email: formData.email,
      password: formData.password
    });

    

    const token = res.data.access;
    const user = res.data.user;

    // Store token based on rememberMe
    if (formData.rememberMe) {
      localStorage.setItem("token", token);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(user));
    }

    // Update toast to success
    toast.success('Login successful! Redirecting...', { id: toastId });

    setTimeout(() => {
      if (user?.is_active) {
        navigate('/main');
      } else if (user?.is_active === false) {
        navigate('/expired');
      } else {
        toast.error("Unexpected login response. Please try again.", { id: toastId });
      }
    }, 1500);

  } catch (error) {
    console.error('Login error:', error);

    let errorMessage = 'Login failed. Please try again.';
    let shouldNavigate = false;
    let navigateTo = '';

    if (error.response) {
      if (error.response.status === 401) {
        errorMessage = 'Invalid email or password';
        // Clear existing tokens
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
      } else if (error.response.status === 404) {
        errorMessage = 'User not found. Please register.';
        shouldNavigate = true;
        navigateTo = '/register';
      } else if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      }

      // Handle specific Django error
      if (error.response.data?.non_field_errors?.[0] === 'Unable to log in with provided credentials.') {
        errorMessage = 'Invalid credentials or inactive account';
      }
    }

    // Update toast to error
    toast.error(errorMessage, { 
      id: toastId,
      duration: 4000 
    });

    // Navigate if user not found
    if (shouldNavigate) {
      setTimeout(() => navigate(navigateTo), 2000);
    }

  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <Header />
      <Toaster position="bottom-center" reverseOrder={false}/>

      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <h1 className="auth-logo">Billing Software</h1>
            <p className="auth-subtitle">Shop Owner Portal</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label className="auth-label">Email*</label>
              <input
                type="email"
                name="email"
                placeholder="shop@example.com"
                className="auth-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-input-group">
              <label className="auth-label">Password*</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="auth-input"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="8"
              />
            </div>

            <div className="auth-options">
              <label className="auth-remember">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                Remember me
              </label>
              <a href="/forgot-password" className="auth-forgot">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? <div className="auth-loader"></div> : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have a shop account? <a href="/register" className="auth-link">Register your shop</a></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;