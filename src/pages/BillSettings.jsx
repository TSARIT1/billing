import React, { useState, useEffect } from 'react';
import { FaSave, FaPrint, FaReceipt, FaInfoCircle, FaCog, FaImage, FaSignature, FaQrcode, FaFileInvoice } from 'react-icons/fa';
import axios from 'axios';
import './billsettings.css';
import BillDesign from './BillDesign';
import api from '../service/api';

const BillSettings = () => {
  const [activeTab, setActiveTab] = useState('billSettings');
  const [shopDetails, setShopDetails] = useState({
    id:'',
    name: '',
    address: '',
    phone: '',
    email: '',
    gstin: '',
    bankDetails: {
      name: '',
      account: '',
      ifsc: ''
    },
    termsAndConditions: [
      'Goods once sold will not be taken back',
      'Payment due within 15 days from invoice date',
      'Interest @18% p.a. will be charged on late payments'
    ],
    profile_picture: null,
    profilePreview: '',
    upiId: '',
    showCustomerDetails: true,
    printAutomatically: false,
    showSignature: true,
    signatureFile: null,
    signaturePreview: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/api/user/');
        const data = response.data[0];
     
        
        setShopDetails({
          id:data.id,
          name: data.shop_name || '',
          address: data.address || '',
          phone: data.phone || '',
          email: data.email || '',
          gstin: data.gst_number || '',
          bankDetails: data.bank_details || {
            bank_name: '',
            account_number: '',
            ifsc_code: ''
          },
          termsAndConditions: data.termsAndConditions || [
            'Goods once sold will not be taken back',
            'Payment due within 15 days from invoice date',
            'Interest @18% p.a. will be charged on late payments'
          ],
          profile_picture: null,
          profilePreview: data.profile_picture || '',
          upiId: data.upi_id || '',
          showCustomerDetails: data.showCustomerDetails !== false,
          printAutomatically: data.printAutomatically || false,
          showSignature: data.showSignature !== false,
          signatureFile: null,
          signaturePreview: data.signature || ''
        });
      } catch (error) {
        setMessage({ text: 'Failed to load settings', type: 'error' });
        console.error(error);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('bankDetails.')) {
      const bankField = name.split('.')[1];
      setShopDetails(prev => ({
        ...prev,
        bankDetails: {
          ...prev.bankDetails,
          [bankField]: value
        }
      }));
    } else {
      setShopDetails(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'profile') {
        setShopDetails(prev => ({ 
          ...prev, 
          profile_picture: file,
          profilePreview: reader.result 
        }));
      } else {
        setShopDetails(prev => ({ 
          ...prev, 
          signatureFile: file,
          signaturePreview: reader.result 
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const updateTerm = (index, value) => {
    const newTerms = [...shopDetails.termsAndConditions];
    newTerms[index] = value;
    setShopDetails(prev => ({
      ...prev,
      termsAndConditions: newTerms
    }));
  };

  const addTerm = () => {
    setShopDetails(prev => ({
      ...prev,
      termsAndConditions: [...prev.termsAndConditions, '']
    }));
  };

  const removeTerm = (index) => {
    const newTerms = shopDetails.termsAndConditions.filter((_, i) => i !== index);
    setShopDetails(prev => ({
      ...prev,
      termsAndConditions: newTerms
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    
    
    try {
      const formData = new FormData();
      
      // Append shop details
      formData.append('shop_name', shopDetails.name);
      formData.append('address', shopDetails.address);
      formData.append('phone', shopDetails.phone);
      formData.append('email', shopDetails.email);
      formData.append('gstin', shopDetails.gstin);
      formData.append('upi_id', shopDetails.upiId);
      formData.append('showCustomerDetails', shopDetails.showCustomerDetails);
      formData.append('printAutomatically', shopDetails.printAutomatically);
      formData.append('showSignature', shopDetails.showSignature);
      
      // Append bank details
      formData.append('bank_details[bank_name]', shopDetails.bankDetails.bank_name);
      formData.append('bank_details[account_number]', shopDetails.bankDetails.account_number);
      formData.append('bank_details[ifsc_code]', shopDetails.bankDetails.ifsc_code);

      
      // Append terms and conditions
      shopDetails.termsAndConditions.forEach((term, index) => {
        formData.append(`term[${index}]`, term);
      });
      
      // Append files
      if (shopDetails.profile_picture) {
        formData.append('profile_photo', shopDetails.profile_picture);
      }
      if (shopDetails.signatureFile) {
        formData.append('signature', shopDetails.signatureFile);
      }

     const res = await api.put(`/api/user/${shopDetails.id}/`, formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
     );
 
      setMessage({ text: 'Settings saved successfully!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: 'Failed to save settings', type: 'error' });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bill-settings-container">
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'billSettings' ? 'active' : ''}`}
          onClick={() => setActiveTab('billSettings')}
        >
          <FaCog /> Shop Settings
        </button>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="shop-settings">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <h2>Shop Details</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Shop Name *</label>
              <input 
                type="text" 
                name="name" 
                value={shopDetails.name} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Address *</label>
              <input 
                type="text" 
                name="address" 
                value={shopDetails.address} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input 
                type="text" 
                name="phone" 
                value={shopDetails.phone} 
                onChange={handleChange} 
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                name="email" 
                value={shopDetails.email} 
                onChange={handleChange} 
              />
            </div>
            <div className="form-group">
              <label>GSTIN</label>
              <input 
                type="text" 
                name="gstin" 
                value={shopDetails.gstin} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Company Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'profile')}
            />
            {shopDetails.profilePreview && (
              <div className="image-preview">
                <img src={shopDetails.profilePreview} alt="Profile Preview" />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>UPI ID (for QR Code)</label>
            <input
              type="text"
              name="upiId"
              value={shopDetails.upiId}
              onChange={handleChange}
              placeholder="yourname@upi"
            />
          </div>

          <h3>Bank Details</h3>

          <div className="form-row">
  <div className="form-group">
    <label>Bank Name</label>
    <input 
      type="text" 
      name="bankDetails.bank_name" 
      value={shopDetails.bankDetails.bank_name} 
      onChange={handleChange} 
    />
  </div>
  <div className="form-group">
    <label>Account Number</label>
    <input 
      type="text" 
      name="bankDetails.account_number" 
      value={shopDetails.bankDetails.account_number} 
      onChange={handleChange} 
    />
  </div>
  <div className="form-group">
    <label>IFSC Code</label>
    <input 
      type="text" 
      name="bankDetails.ifsc_code" 
      value={shopDetails.bankDetails.ifsc_code} 
      onChange={handleChange} 
    />
  </div>
</div>

          <h3>Bill Options</h3>
          <div className="form-row check-box-row">
            <div className="form-group checkbox-group-bs">
              <input
                type="checkbox"
                name="showCustomerDetails"
                checked={shopDetails.showCustomerDetails}
                onChange={handleChange}
                id="showCustomerDetails"
                className='check-bx'
              />
              <label htmlFor="showCustomerDetails">Show Customer Details</label>
            </div>
            <div className="form-group checkbox-group-bs">
              <input
                type="checkbox"
                name="printAutomatically"
                checked={shopDetails.printAutomatically}
                onChange={handleChange}
                id="printAutomatically"
                className='check-bx'

              />
              <label htmlFor="printAutomatically">Auto Print Bills</label>
            </div>
            <div className="form-group checkbox-group-bs">
              <input
                type="checkbox"
                name="showSignature"
                checked={shopDetails.showSignature}
                onChange={handleChange}
                id="showSignature"
                className='check-bx'
              />
              <label htmlFor="showSignature">Show Signature on Bill</label>
            </div>
          </div>

          {shopDetails.showSignature && (
            <div className="form-group">
              <label>Signature Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'signature')}
              />
              {shopDetails.signaturePreview && (
                <div className="image-preview">
                  <img src={shopDetails.signaturePreview} alt="Signature Preview" />
                </div>
              )}
            </div>
          )}

          <h3>Terms & Conditions</h3>
          {shopDetails.termsAndConditions.map((term, index) => (
            <div className="form-row" key={index}>
              <div className="form-group term-input">
                <input 
                  type="text" 
                  value={term} 
                  onChange={(e) => updateTerm(index, e.target.value)} 
                />
                <button 
                  type="button" 
                  className="remove-term-btn"
                  onClick={() => removeTerm(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button type="button" className="add-term-btn" onClick={addTerm}>
            Add Term
          </button>

          <div className="form-actions">
            <button
              type="submit"
              className="save-button"
              disabled={isLoading}
            >
              <FaSave /> {isLoading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderBillDesignTab = () => (
    <div className="bs-bill-design-container">
      <h2 className="bs-section-title"><FaReceipt /> Bill Design</h2>
      <div className="bs-bill-design-content">
            bill design
      </div>
    </div>
  );

  const renderDefaultSettingsTab = () => (
  <form onSubmit={handleSubmit} className="bs-form">
    <div className="bs-form-section">
      <h2 className="bs-section-title"><FaCog /> Default Settings</h2>
      
      <div className="bs-form-row">
        <div className="bs-form-group">
          <label>Default Payment Method</label>
          <select
            name="defaultPaymentMethod"
            value={settings.defaultPaymentMethod}
            onChange={handleChange}
            className="bs-input"
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="upi">UPI</option>
            <option value="bank">Bank Transfer</option>
          </select>
        </div>

        <div className="bs-form-group">
          <label>Default Currency</label>
          <select
            name="defaultCurrency"
            value={settings.defaultCurrency}
            onChange={handleChange}
            className="bs-input"
          >
            <option value="INR">Indian Rupee (₹)</option>
            <option value="USD">US Dollar ($)</option>
            <option value="EUR">Euro (€)</option>
            <option value="GBP">British Pound (£)</option>
          </select>
        </div>
      </div>

      <div className="bs-form-row">
        <div className="bs-form-group">
          <label>Default Category</label>
          <select
            name="defaultCategory"
            value={settings.defaultCategory}
            onChange={handleChange}
            className="bs-input"
          >
            <option value="">-- Select Category --</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="groceries">Groceries</option>
            <option value="furniture">Furniture</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="bs-form-group">
          <label>Default Unit</label>
          <select
            name="defaultUnit"
            value={settings.defaultUnit}
            onChange={handleChange}
            className="bs-input"
          >
            <option value="">-- Select Unit --</option>
            <option value="piece">Piece</option>
            <option value="kg">Kilogram (kg)</option>
            <option value="gram">Gram (g)</option>
            <option value="liter">Liter (L)</option>
            <option value="meter">Meter (m)</option>
            <option value="box">Box</option>
          </select>
        </div>
      </div>

      <div className="bs-form-row">
        <div className="bs-form-group">
          <label>Default GST Rate (%)</label>
          <select
            name="defaultGSTRate"
            value={settings.defaultGSTRate}
            onChange={handleChange}
            className="bs-input"
          >
            <option value="0">0%</option>
            <option value="5">5%</option>
            <option value="12">12%</option>
            <option value="18">18%</option>
            <option value="28">28%</option>
          </select>
        </div>

        <div className="bs-form-group">
          <label>Tax Type on Sale</label>
          <select
            name="taxTypeOnSale"
            value={settings.taxTypeOnSale}
            onChange={handleChange}
            className="bs-input"
          >
            <option value="inclusive">Inclusive of Tax</option>
            <option value="exclusive">Exclusive of Tax</option>
          </select>
        </div>
      </div>
    </div>

    <div className="bs-form-actions">
      <button
        type="submit"
        className="bs-button bs-save-button"
        disabled={isLoading}
      >
        <FaSave /> {isLoading ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  </form>
);

  return (
    <div className="bs-container">
      <h1 className="bs-title"><FaCog /> Bill Settings</h1>
      
      {message.text && (
        <div className={`bs-message bs-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="bs-tabs">
        <button
          className={`bs-tab ${activeTab === 'billSettings' ? 'active' : ''}`}
          onClick={() => setActiveTab('billSettings')}
        >
          Profile Settings
        </button>
        <button
          className={`bs-tab ${activeTab === 'billDesign' ? 'active' : ''}`}
          onClick={() => setActiveTab('billDesign')}
        >
          Bill Design
        </button>
        <button
          className={`bs-tab ${activeTab === 'defaultSettings' ? 'active' : ''}`}
          onClick={() => setActiveTab('defaultSettings')}
        >
          Default Settings
        </button>
      </div>

      <div className="bs-tab-content">
        {activeTab === 'billSettings' && renderBillSettingsTab()}
        {activeTab === 'billDesign' && renderBillDesignTab()}
        {activeTab === 'defaultSettings' && renderDefaultSettingsTab()}
      </div>
    </div>
  );
};

export default BillSettings;