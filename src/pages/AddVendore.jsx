import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaSave, FaTimes, FaDoorOpen, FaUserTie, 
  FaPhone, FaEnvelope, FaMapMarkerAlt, 
  FaCity, FaGlobeAmericas, FaMapPin, 
  FaEdit, FaTrash, FaSearch, FaPlus,
  FaList, FaInfoCircle
} from 'react-icons/fa';
import axios from 'axios';
import './addvendor.css';
import api from '../service/api'

function AddVendor() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentVendorId, setCurrentVendorId] = useState(null);
  const [activeTab, setActiveTab] = useState('form'); // 'form' or 'list'

  const [form, setForm] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
    vendorType: 'supplier',
    taxId: '',
    accountNumber: '',
    ifscCode: '',
    notes: '',
    status: 'active'
  });

  // Fetch vendors on component mount
  useEffect(() => {
    const fetchVendors = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/api/vendors/');
        setVendors(response.data);
        console.log(response.data);
        
      } catch (err) {
        setError('Failed to fetch vendors');
      } finally {
        setIsLoading(false);
      }
    };
    fetchVendors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      setError('Vendor name is required');
      return false;
    }
    if (!form.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (editMode) {
       await api.put(`/api/vendors/${currentVendorId}/`, form);
        setSuccess('Vendor updated successfully!');
        
      } else {
        await api.post('/api/vendors/', form);
        setSuccess('Vendor added successfully!');
      }
      

      // Refresh vendor list
      const response = await axios.get('/api/vendors/');
      setVendors(response.data);
      
      setTimeout(() => {
        setSuccess('');
        handleReset();
        setActiveTab('list'); // Switch to list tab after successful submission
      }, 2000);
    } catch (err) {
      console.error(err);
      
      setError(err.response?.data?.message || 'Failed to save vendor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (vendor) => {
    setForm({
      name: vendor.name,
      contactPerson: vendor.contactPerson,
      phone: vendor.phone,
      email: vendor.email,
      address: vendor.address,
      city: vendor.city,
      state: vendor.state,
      zip: vendor.zip,
      country: vendor.country,
      vendorType: vendor.vendorType,
      taxId: vendor.taxId,
      accountNumber: vendor.accountNumber,
      ifscCode: vendor.ifscCode,
      notes: vendor.notes,
      status: vendor.status
    });
    setEditMode(true);
    setCurrentVendorId(vendor.id);
    setActiveTab('form'); // Switch to form tab when editing
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      try {
        await api.delete(`/api/vendors/${id}`);
        setVendors(vendors.filter(vendor => vendor.id !== id));
        setSuccess('Vendor deleted successfully!');
        setTimeout(() => setSuccess(''), 2000);
      } catch (err) {
        setError('Failed to delete vendor');
      }
    }
  };

  const handleReset = () => {
    setForm({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: 'India',
      vendorType: 'supplier',
      taxId: '',
      accountNumber: '',
      ifscCode: '',
      notes: '',
      status: 'active'
    });
    setError('');
    setEditMode(false);
    setCurrentVendorId(null);
  };

  const handleExit = () => {
    navigate(-1);
  };

  const filteredVendors = Array.isArray(vendors)
    ? vendors.filter(vendor =>
        vendor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.phone?.includes(searchTerm)
      )
    : [];

  return (
    <div className="av-page-container">
      <div className="av-tabs-container">
        <div className="av-tabs">
          <button
            className={`av-tab ${activeTab === 'form' ? 'active' : ''}`}
            onClick={() => setActiveTab('form')}
          >
            <FaUserTie /> {editMode ? 'Edit Vendor' : 'Add Vendor'}
          </button>
          <button
            className={`av-tab ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            <FaList /> Vendor List
          </button>
        </div>
      </div>

      {activeTab === 'form' && (
        <div className="av-form-container">
          {error && <div className="av-error-message">{error}</div>}
          {success && <div className="av-success-message">{success}</div>}

          <div className="av-form-grid">
            <div className="av-form-group">
              <label>
                <FaUserTie /> Vendor Name*
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Vendor Name"
                className="av-input"
                required
              />
            </div>

            <div className="av-form-group">
              <label>Contact Person</label>
              <input
                name="contactPerson"
                value={form.contactPerson}
                onChange={handleChange}
                placeholder="Contact Person"
                className="av-input"
              />
            </div>

            <div className="av-form-group">
              <label>
                <FaPhone /> Phone*
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="av-input"
                required
              />
            </div>

            <div className="av-form-group">
              <label>
                <FaEnvelope /> Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="av-input"
              />
            </div>

            <div className="av-form-group">
              <label>
                <FaMapMarkerAlt /> Address
              </label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Street Address"
                className="av-input"
              />
            </div>

            <div className="av-form-group">
              <label>
                <FaCity /> City
              </label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
                className="av-input"
              />
            </div>

            <div className="av-form-group">
              <label>
                <FaGlobeAmericas /> State
              </label>
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="State/Province"
                className="av-input"
              />
            </div>

            <div className="av-form-group">
              <label>
                <FaMapPin /> ZIP Code
              </label>
              <input
                name="zip"
                value={form.zip}
                onChange={handleChange}
                placeholder="Postal/ZIP Code"
                className="av-input"
              />
            </div>

            <div className="av-form-group">
              <label>Country</label>
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                className="av-select"
              >
                <option value="India">India</option>
                <option value="USA">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
              </select>
            </div>

            <div className="av-form-group">
              <label>Vendor Type</label>
              <select
                name="vendorType"
                value={form.vendorType}
                onChange={handleChange}
                className="av-select"
              >
                <option value="supplier">Supplier</option>
                <option value="manufacturer">Manufacturer</option>
                <option value="distributor">Distributor</option>
              </select>
            </div>

            <div className="av-form-group">
              <label>Tax ID/GSTIN</label>
              <input
                name="taxId"
                value={form.taxId}
                onChange={handleChange}
                placeholder="Tax Identification Number"
                className="av-input"
              />
            </div>

            <div className="av-form-group">
              <label>Account Number</label>
              <input
                name="accountNumber"
                value={form.accountNumber}
                onChange={handleChange}
                placeholder="Bank Account Number"
                className="av-input"
              />
            </div>

            <div className="av-form-group">
              <label>IFSC Code</label>
              <input
                name="ifscCode"
                value={form.ifscCode}
                onChange={handleChange}
                placeholder="Bank IFSC Code"
                className="av-input"
              />
            </div>

            <div className="av-form-group av-full-width">
              <label>Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Additional notes..."
                className="av-textarea"
                rows="3"
              />
            </div>

            <div className="av-form-group">
              <label>Status</label>
              <div className="av-radio-group">
                <label>
                  <input
                    type="radio"
                    name="status"
                    value="active"
                    checked={form.status === 'active'}
                    onChange={handleChange}
                  />
                  Active
                </label>
                <label>
                  <input
                    type="radio"
                    name="status"
                    value="inactive"
                    checked={form.status === 'inactive'}
                    onChange={handleChange}
                  />
                  Inactive
                </label>
              </div>
            </div>
          </div>

          <div className="av-form-actions">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="av-button av-save-button"
            >
              <FaSave /> {isLoading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleReset}
              className="av-button av-reset-button"
            >
              <FaTimes /> Reset
            </button>
            <button
              onClick={handleExit}
              className="av-button av-exit-button"
            >
              <FaDoorOpen /> Exit
            </button>
          </div>
        </div>
      )}

      {activeTab === 'list' && (
        <div className="av-list-container">
          <div className="av-search-container">
            <div className="av-search-box">
              <FaSearch className="av-search-icon" />
              <input
                type="text"
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="av-search-input"
              />
            </div>
            <button 
              className="av-button av-add-button"
              onClick={() => {
                handleReset();
                setActiveTab('form');
              }}
            >
              <FaPlus /> Add New Vendor
            </button>
          </div>

          {isLoading && vendors.length === 0 ? (
            <div className="av-loading">Loading vendors...</div>
          ) : filteredVendors.length === 0 ? (
            <div className="av-no-results">
              <FaInfoCircle /> No vendors found
            </div>
          ) : (
            <div className="av-table-container">
              <table className="av-vendor-table">
                <thead>
                  <tr>
                    <th>sl.no</th>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Phone</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVendors.map((vendor,index) => (
                    <tr key={vendor.id}>
                      <td>{index+1}</td>
                      <td>{vendor.name}</td>
                      <td>{vendor.phone || '-'}</td>
                      <td>{vendor.phone}</td>
                      <td>{vendor.vendor_type}</td>
                      <td>
                        <span className={`av-status-badge av-status-${vendor.status}`}>
                          {vendor.status}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleEdit(vendor)}
                          className="av-action-button av-edit-button"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(vendor.id)}
                          className="av-action-button av-delete-button"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AddVendor;