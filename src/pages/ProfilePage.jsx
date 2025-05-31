import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock, FaSave, FaEdit, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import './profilepage.css';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/profile');
        setProfile({
          ...response.data,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } catch (error) {
        setMessage({ text: 'Failed to load profile', type: 'error' });
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validate passwords if changing
    if (editMode && profile.newPassword && profile.newPassword !== profile.confirmPassword) {
      setMessage({ text: 'New passwords do not match', type: 'error' });
      setIsLoading(false);
      return;
    }

    try {
      if (editMode) {
        await axios.put('/api/profile', profile);
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
      } else {
        setEditMode(true);
      }
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Failed to update profile', type: 'error' });
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    // Reload original profile data
    axios.get('/api/profile')
      .then(response => {
        setProfile({
          ...response.data,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      })
      .catch(() => {
        setMessage({ text: 'Failed to reload profile', type: 'error' });
      });
  };

  return (
    <div className="pp-container">
      <h1 className="pp-title"><FaUser /> My Profile</h1>
      
      {message.text && (
        <div className={`pp-message pp-${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="pp-form">
        <div className="pp-form-section">
          <h2 className="pp-section-title">Personal Information</h2>
          
          <div className="pp-form-group">
            <label><FaUser /> Full Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="pp-input"
              disabled={!editMode}
              required
            />
          </div>
          
          <div className="pp-form-group">
            <label><FaEnvelope /> Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="pp-input"
              disabled={!editMode}
              required
            />
          </div>
          
          <div className="pp-form-group">
            <label><FaPhone /> Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="pp-input"
              disabled={!editMode}
            />
          </div>
        </div>

        <div className="pp-form-section">
          <h2 className="pp-section-title"><FaMapMarkerAlt /> Address</h2>
          
          <div className="pp-form-group">
            <label>Street Address</label>
            <input
              type="text"
              name="address"
              value={profile.address}
              onChange={handleChange}
              className="pp-input"
              disabled={!editMode}
            />
          </div>
          
          <div className="pp-form-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={profile.city}
              onChange={handleChange}
              className="pp-input"
              disabled={!editMode}
            />
          </div>
          
          <div className="pp-form-group">
            <label>State</label>
            <input
              type="text"
              name="state"
              value={profile.state}
              onChange={handleChange}
              className="pp-input"
              disabled={!editMode}
            />
          </div>
          
          <div className="pp-form-group">
            <label>ZIP Code</label>
            <input
              type="text"
              name="zip"
              value={profile.zip}
              onChange={handleChange}
              className="pp-input"
              disabled={!editMode}
            />
          </div>
        </div>

        {editMode && (
          <div className="pp-form-section">
            <h2 className="pp-section-title"><FaLock /> Change Password</h2>
            <p className="pp-note">Leave blank to keep current password</p>
            
            <div className="pp-form-group">
              <label>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={profile.currentPassword}
                onChange={handleChange}
                className="pp-input"
              />
            </div>
            
            <div className="pp-form-group">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={profile.newPassword}
                onChange={handleChange}
                className="pp-input"
              />
            </div>
            
            <div className="pp-form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={profile.confirmPassword}
                onChange={handleChange}
                className="pp-input"
              />
            </div>
          </div>
        )}

        <div className="pp-form-actions">
          {editMode ? (
            <>
              <button
                type="submit"
                className="pp-button pp-save-button"
                disabled={isLoading}
              >
                <FaSave /> {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="pp-button pp-cancel-button"
                disabled={isLoading}
              >
                <FaTimes /> Cancel
              </button>
            </>
          ) : (
            <button
              type="submit"
              className="pp-button pp-edit-button"
            >
              <FaEdit /> Edit Profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;