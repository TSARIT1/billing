import React, { useState, useEffect } from 'react';
import { FiMessageSquare, FiCheck, FiX, FiEdit, FiSearch, FiFilter } from 'react-icons/fi';
import { FaTicketAlt, FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import './AdminFeedbackPanel.css';
import api from '../service/api.js'

const AdminFeedbackPanel = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newStatus, setNewStatus] = useState('Open');

  // Fetch tickets from API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('adminToken');
        const response = await api.get('http://127.0.0.1:8000/api/tickets/',{
        headers: { Authorization: `Bearer ${token}` }
      });
         
        setTickets(response.data);
        
        // Dummy data for demonstration

      } catch (err) {
        setError('Failed to load tickets. Please try again later.');
        console.error('Error fetching tickets:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Filter tickets based on search and status
  useEffect(() => {
    let results = tickets;
    
    if (searchTerm) {
      results = results.filter(ticket =>
        ticket.subject.includes(searchTerm) ||
        ticket.description.includes(searchTerm) ||
        ticket.user.username.includes(searchTerm)
      );
    }
    
    if (statusFilter !== 'All') {
      results = results.filter(ticket => ticket.status === statusFilter);
    }
    
    setFilteredTickets(results);
  }, [searchTerm, statusFilter, tickets]);

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      // In a real app, you would make an API call here:
      // await axios.patch(`/api/tickets/${ticketId}/`, { status: newStatus });
      
      // Update local state for demo purposes
      setTickets(prev => prev.map(ticket =>
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      ));
    } catch (err) {
      setError('Failed to update ticket status');
      console.error('Error updating status:', err);
    }
  };

  const submitFeedback = async (ticketId) => {
    if (!feedback.trim()) return;
    
    try {
      // In a real app, you would make an API call here:
        const token = localStorage.getItem('adminToken');
      await axios.patch(`http://127.0.0.1:8000/api/tickets/${ticketId}/`, {
        status: newStatus,
        admin_feedback: feedback
      },{
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state for demo purposes

      
      setFeedback('');
      setSelectedTicket(null);
      setNewStatus('Open');
      setError(null);
    } catch (err) {
      setError('Failed to submit feedback');
      console.error('Error submitting feedback:', err);
    }
  };

  const renderStatusBadge = (status) => {
    const statusClasses = {
      Open: 'ad-status-open',
      'In Progress': 'ad-status-progress',
      Resolved: 'ad-status-resolved',
      Closed: 'ad-status-closed'
    };

    return (
      <span className={`ad-status-badge ${statusClasses[status] || 'ad-status-default'}`}>
        {status === 'Open' && <FaTicketAlt className="ad-status-icon" />}
        {status === 'In Progress' && <FiEdit className="ad-status-icon" />}
        {status === 'Resolved' && <FiCheck className="ad-status-icon" />}
        {status === 'Closed' && <FiX className="ad-status-icon" />}
        {status}
      </span>
    );
  };

  const renderPriorityBadge = (priority) => {
    const priorityClasses = [
      'ad-priority-lowest',
      'ad-priority-low',
      'ad-priority-medium',
      'ad-priority-high',
      'ad-priority-highest'
    ];

    return (
      <span className={`ad-priority-badge ${priorityClasses[priority - 1]}`}>
        {priority} - {['Lowest', 'Low', 'Medium', 'High', 'Highest'][priority - 1]}
      </span>
    );
  };

  return (
    <div className="ad-container">
      <h1 className="ad-header">
        <FaTicketAlt className="ad-header-icon" /> Ticket Feedback Panel
      </h1>

      {error && <div className="ad-error">{error}</div>}

      <div className="ad-controls">
        <div className="ad-search-container">
          <FiSearch className="ad-search-icon" />
          <input
            type="text"
            placeholder="Search tickets..."
            className="ad-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="ad-filter-container">
          <FiFilter className="ad-filter-icon" />
          <select
            className="ad-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {isLoading ? (
  <div className="ad-loading">Loading tickets...</div>
) : !filteredTickets || filteredTickets.length === 0 ? (
  <div className="ad-no-tickets">No tickets found</div>
) : (
        <div className="ad-tickets-container">
          <div className="ad-tickets-list">
            {filteredTickets.map(ticket => (
              <div 
                key={ticket.id} 
                className={`ad-ticket-card ${selectedTicket?.id === ticket.id ? 'ad-ticket-selected' : ''}`}
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="ad-ticket-header">
                  <h3 className="ad-ticket-subject">{ticket.subject}</h3>
                  <div className="ad-ticket-meta">
                    {renderPriorityBadge(ticket.priority)}
                    {renderStatusBadge(ticket.status)}
                  </div>
                </div>
                
                <div className="ad-ticket-user">
                  <FaUserCircle className="ad-user-icon" />
                  <span className="ad-username">{ticket.user.username}</span>
                  <span className="ad-user-email">{ticket.user.email}</span>
                </div>
                
                <p className="ad-ticket-description">{ticket.description}</p>
                <p className="ad-ticket-date">
                  Created: {new Date(ticket.created_at).toLocaleDateString()}
                </p>
                
                {ticket.admin_feedback && (
                  <div className="ad-feedback-preview">
                    <strong>Your Feedback:</strong> {ticket.admin_feedback}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="ad-feedback-panel">
            {selectedTicket ? (
              <>
          <h3 className="ad-feedback-header">
            <FiMessageSquare className="ad-feedback-icon" />
            Provide Feedback for #{selectedTicket.id}
          </h3>
          
          <div className="ad-ticket-details">
            <h4>{selectedTicket.subject}</h4>
            <p>{selectedTicket.description}</p>
            <div className="ad-ticket-meta">
              {renderPriorityBadge(selectedTicket.priority)}
              {renderStatusBadge(selectedTicket.status)}
            </div>
          </div>
          
          <div className="ad-form-group">
            <label className="ad-form-label">Update Status</label>
            <select
              className="ad-form-select"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          
          <div className="ad-form-group">
            <label className="ad-form-label">
              Admin Feedback {['Resolved', 'Closed'].includes(newStatus) && '*'}
            </label>
            <textarea
              className="ad-feedback-input"
              placeholder={
                ['Resolved', 'Closed'].includes(newStatus) 
                  ? "Please provide resolution details (required)..." 
                  : "Enter your feedback or comments..."
              }
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={6}
            />
          </div>
          
          <button
            className="ad-submit-feedback"
            onClick={() => submitFeedback(selectedTicket.id)}
            disabled={['Resolved', 'Closed'].includes(newStatus) && !feedback.trim()}
          >
            Submit Feedback
          </button>
        </>
            ) : (
              <div className="ad-select-ticket">
                <FiMessageSquare className="ad-select-icon" />
                <p>Select a ticket to provide feedback</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFeedbackPanel;