import React, { useState, useRef, useEffect } from 'react';
import { FiSearch, FiPaperclip, FiPlus, FiCheck, FiX } from 'react-icons/fi';
import { FaTicketAlt, FaRegPaperPlane,FaReply } from 'react-icons/fa';
import './TicketRaisePage.css';
import api from '../service/api';


const TicketRaisePage = () => {
  const [activeTab, setActiveTab] = useState('view');
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTicket, setNewTicket] = useState({
    subject: '',
    title: '',
    description: '',
    priority: '3',
    images: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

 


  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
     
        const response = await api.get('/api/tickets/');
        setTickets(response.data);

      } catch (err) {
        setError('Failed to fetch tickets. Please try again later.');
        console.error('Error fetching tickets:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter(ticket =>
    ticket.description.toLowerCase().includes(searchTerm) ||
    ticket.subject.toLowerCase().includes(searchTerm)
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTicket(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert('You can upload a maximum of 5 images');
      return;
    }
    setNewTicket(prev => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const removeFile = (index) => {
    setNewTicket(prev => {
      const updatedFiles = [...prev.images];
      updatedFiles.splice(index, 1);
      return { ...prev, images: updatedFiles };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      
      const formData = new FormData();
      formData.append('subject', newTicket.subject);
      formData.append('title', newTicket.title);
      formData.append('description', newTicket.description);
      formData.append('priority', newTicket.priority);
      newTicket.images.forEach((image, index) => {
        formData.append(`images`, image);
      });

      const response = await api.post('/api/tickets/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setTickets(prev => [response.data, ...prev]);
      
      // Reset form
      setNewTicket({
        subject: '',
        title: '',
        description: '',
        priority: '3',
        images: []
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Switch to view tab
      setActiveTab('view');
    } catch (err) {
      setError('Failed to submit ticket. Please try again.');
      console.error('Error submitting ticket:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStatusBadge = (status) => {
    const statusClass = {
      Open: 'tr-status-open',
      Closed: 'tr-status-closed',
      'In Progress': 'tr-status-progress'
    }[status] || 'tr-status-default';

    return (
      <span className={`tr-status-badge ${statusClass}`}>
        {status === 'Open' && <FiPlus className="tr-status-icon" />}
        {status === 'Closed' && <FiCheck className="tr-status-icon" />}
        {status === 'In Progress' && <FaTicketAlt className="tr-status-icon" />}
        {status}
      </span>
    );
  };

  return (
    <div className="tr-container">
      <h1 className="tr-header">
        <FaTicketAlt className="tr-header-icon" /> Ticket Management
      </h1>
      
      <div className="tr-tabs">
        <button
          className={`tr-tab ${activeTab === 'view' ? 'tr-tab-active' : ''}`}
          onClick={() => setActiveTab('view')}
        >
          View Tickets
        </button>
        <button
          className={`tr-tab ${activeTab === 'submit' ? 'tr-tab-active' : ''}`}
          onClick={() => setActiveTab('submit')}
        >
          Raise New Ticket
        </button>
      </div>

      {error && <div className="tr-error">{error}</div>}

      {activeTab === 'view' ? (
        <div className="tr-view-tab">
          <div className="tr-search-container">
            <input
              type="text"
              placeholder="Search tickets by subject, title or description..."
              className="tr-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="tr-search-button">
              <FiSearch className="tr-search-icon" />
            </button>
          </div>

          {isLoading ? (
            <div className="tr-loading">Loading tickets...</div>
          ) : filteredTickets.length === 0 ? (
            <div className="tr-no-tickets">No tickets found</div>
          ) : (
            <div className="tr-tickets-list">
              {filteredTickets.map(ticket => (
                <div key={ticket.id} className="tr-ticket-card">
                    <div className="tr-ticket-header">
                    <div>
                        <h3 className="tr-ticket-subject">{ticket.subject}</h3>
                        <h4 className="tr-ticket-title">{ticket.title}</h4>
                    </div>
                    {renderStatusBadge(ticket.status)}
                    </div>
                    <p className="tr-ticket-date">Created on: {new Date(ticket.created_at).toLocaleString('en-GB', {
                                      day: '2-digit',
                                      month: 'short',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}</p>
                    <p className="tr-ticket-description">{ticket.description}</p>
                    
                   
                    {ticket.admin_feedback && (
                    <div className="tr-admin-feedback">
                        <div className="tr-feedback-header">
                        <FaReply className="tr-feedback-icon" />
                        <span>Admin Response</span>
                        </div>
                        <p className="tr-feedback-content">{ticket.admin_feedback}</p>
                    </div>
                    )}
                </div>
                ))}
            </div>
          )}
        </div>
      ) : (
        <div className="tr-submit-tab">
          <form onSubmit={handleSubmit} className="tr-ticket-form">
            <div className="tr-form-group">
              <label htmlFor="subject" className="tr-form-label">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="tr-form-input"
                value={newTicket.subject}
                onChange={handleInputChange}
                required
                placeholder="e.g., Authentication, Payments, UI Issues"
              />
            </div>

            <div className="tr-form-group">
              <label htmlFor="description" className="tr-form-label">Description</label>
              <textarea
                id="description"
                name="description"
                className="tr-form-textarea"
                value={newTicket.description}
                onChange={handleInputChange}
                required
                rows="5"
                placeholder="Detailed description of the issue..."
              />
            </div>

            <div className="tr-form-group">
              <label htmlFor="priority" className="tr-form-label">Priority</label>
              <select
                id="priority"
                name="priority"
                className="tr-form-select"
                value={newTicket.priority}
                onChange={handleInputChange}
              >
                <option value="1">1 - Lowest</option>
                <option value="2">2 - Low</option>
                <option value="3">3 - Medium</option>
                <option value="4">4 - High</option>
                <option value="5">5 - Highest</option>
              </select>
            </div>

            <div className="tr-form-group">
              <label className="tr-form-label">Attachments (max 5)</label>
              <div className="tr-file-upload-container">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="tr-file-input"
                  onChange={handleFileChange}
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  className="tr-file-upload-button"
                  onClick={() => fileInputRef.current.click()}
                  disabled={newTicket.images.length >= 5}
                >
                  <FiPaperclip className="tr-file-icon" />
                  Add Files
                </button>
                <span className="tr-file-hint">Max 5 files (images, PDF, Word)</span>
              </div>
              
              {newTicket.images.length > 0 && (
                <div className="tr-file-preview-container">
                  {newTicket.images.map((file, index) => (
                    <div key={index} className="tr-file-preview-item">
                      <span className="tr-file-name">{file.name}</span>
                      <button
                        type="button"
                        className="tr-file-remove"
                        onClick={() => removeFile(index)}
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className="tr-submit-button" disabled={isLoading}>
              <FaRegPaperPlane className="tr-submit-icon" />
              {isLoading ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TicketRaisePage;