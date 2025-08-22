import React, { useState, useEffect } from 'react';
import { FaToggleOn, FaToggleOff, FaSearch, FaArrowLeft } from 'react-icons/fa';
import './AdminDashboard.css';

const UserTable = ({ users: initialUsers, onToggleStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);

  // Initialize users state when component mounts or initialUsers changes
  useEffect(() => {
    setUsers(Array.isArray(initialUsers) ? initialUsers : []);
  }, [initialUsers]);

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleBackClick = () => {
    setSelectedUser(null);
  };

  const handleToggleStatus = (userId, newStatus) => {
    // Update local state immediately for responsive UI
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, plan_status: newStatus } : user
      )
    );
    
    // Also update the parent component or API
    onToggleStatus(userId, newStatus);
  };

  if (selectedUser) {
    // Get the latest user data from our state
    const currentUserData = users.find(user => user.id === selectedUser.id) || selectedUser;
    
    return (
      <div className="user-details">
        <button onClick={handleBackClick} className="back-button">
          <FaArrowLeft /> Back to Users
        </button>

        <div className="user-info">
          <h2>User Details</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">ID:</span>
              <span className="info-value">{currentUserData.id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Name:</span>
              <span className="info-value">{currentUserData.username}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{currentUserData.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Plan Status:</span>
              <span className={`info-value status-badge ${currentUserData.plan_status === 'active' ? 'active' : 'expired'}`}>
                {currentUserData.plan_status === 'active' ? 'Active' : 'Expired'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Joined Date:</span>
              <span className="info-value">{new Date(currentUserData.date_joined).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Referred By:</span>
              <span className="info-value">{currentUserData.referred_by || '-'}</span>
            </div>
          </div>
        </div>

        <div className="subscription-plans">
          <h3>Subscription Plans</h3>
          <div className="table-responsive">
            <table className="plan-table">
              <thead>
                <tr>
                  <th>Plan Name</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentUserData.subscriptions && currentUserData.subscriptions.length > 0 ? (
                  currentUserData.subscriptions.map((subscription, index) => (
                    <tr key={index}>
                      <td>{subscription.plan_name}</td>
                      <td>{subscription.plan_type}</td>
                      <td>${subscription.price}</td>
                      <td>{new Date(subscription.start_date).toLocaleDateString()}</td>
                      <td>{new Date(subscription.end_date).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge ${subscription.is_active ? 'active' : 'inactive'}`}>
                          {subscription.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-results">
                      No subscription plans found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="table-controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Plan Status</th>
              <th>Referred By</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user.id} onClick={() => handleUserClick(user)} className="clickable-row">
                  <td>{user.id}</td>
                  <td>{user.username} <b>{user.is_staff ? '( admin account )' : ''}</b></td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`status-badge ${user.plan_status === 'active' ? 'active' : 'expired'}`}>
                      {user.plan_status === 'active' ? 'Active' : 'Expired'}
                    </span>
                  </td>
                  <td>{user.referred_by || '-'}</td>
                  <td>{new Date(user.date_joined).toLocaleDateString()}</td>
                  <td className="actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(user.id, user.plan_status === 'active' ? 'expired' : 'active');
                      }}
                      className={`action-btn toggle-btn ${user.plan_status === 'active' ? 'active' : ''}`}
                      title={user.plan_status === 'active' ? 'Deactivate user' : 'Activate user'}
                    >
                      {user.plan_status === 'active' ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-results">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;