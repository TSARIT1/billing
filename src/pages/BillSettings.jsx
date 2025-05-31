import React, { useState, useEffect } from 'react';
import { FaSave, FaPrint, FaReceipt, FaInfoCircle, FaCog, FaImage, FaSignature, FaQrcode, FaFileInvoice } from 'react-icons/fa';
import axios from 'axios';
import './billsettings.css';
import BillDesign from './BillDesign';

const BillSettings = () => {
  const [activeTab, setActiveTab] = useState('billSettings');
  const [settings, setSettings] = useState({
    header: 'Your Business Name',
    subheader: 'Your Business Slogan',
    footer: 'Thank you for your business!',
    taxEnabled: true,
    taxRate: 18,
    discountEnabled: false,
    printAutomatically: false,
    showLogo: true,
    logoUrl: '',
    logoFile: null,
    showSignature: true,
    signatureUrl: '',
    signatureFile: null,
    gstNumber: '',
    upiId: '',
    termsAndConditions: 'Goods once sold will not be taken back.',
    showCustomerDetails: true,
    defaultPaymentMethod: 'cash',
    defaultCurrency: 'INR',
  defaultCategory: '',
  defaultUnit: '',
  defaultGSTRate: '18',
  taxTypeOnSale: 'inclusive',

  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [logoPreview, setLogoPreview] = useState('');
  const [signaturePreview, setSignaturePreview] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/bill-settings');
        setSettings(response.data);
        if (response.data.logoUrl) setLogoPreview(response.data.logoUrl);
        if (response.data.signatureUrl) setSignaturePreview(response.data.signatureUrl);
      } catch (error) {
        setMessage({ text: 'Failed to load settings', type: 'error' });
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'logo') {
        setSettings(prev => ({ ...prev, logoFile: file }));
        setLogoPreview(reader.result);
      } else {
        setSettings(prev => ({ ...prev, signatureFile: file }));
        setSignaturePreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      for (const key in settings) {
        if (key === 'logoFile' || key === 'signatureFile') continue;
        formData.append(key, settings[key]);
      }
      
      if (settings.logoFile) formData.append('logo', settings.logoFile);
      if (settings.signatureFile) formData.append('signature', settings.signatureFile);

      await axios.post('/api/bill-settings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setMessage({ text: 'Settings saved successfully!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: 'Failed to save settings', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderBillSettingsTab = () => (
    <form onSubmit={handleSubmit} className="bs-form">
      <div className="bs-form-section">
        <h2 className="bs-section-title"><FaFileInvoice /> Bill Information</h2>
        <div className="bs-form-group">
          <label>Header Text</label>
          <input
            type="text"
            name="header"
            value={settings.header}
            onChange={handleChange}
            className="bs-input"
          />
        </div>
        <div className="bs-form-group">
          <label>Subheader Text</label>
          <input
            type="text"
            name="subheader"
            value={settings.subheader}
            onChange={handleChange}
            className="bs-input"
          />
        </div>
        <div className="bs-form-group">
          <label>Footer Text</label>
          <input
            type="text"
            name="footer"
            value={settings.footer}
            onChange={handleChange}
            className="bs-input"
          />
        </div>
        <div className="bs-form-group">
          <label>GST Number</label>
          <input
            type="text"
            name="gstNumber"
            value={settings.gstNumber}
            onChange={handleChange}
            className="bs-input"
            placeholder="22AAAAA0000A1Z5"
          />
        </div>
        
        <h2 className="bs-section-title"><FaImage /> Images</h2>
        <div className="bs-form-group bs-checkbox-group">
          <input
            type="checkbox"
            name="showLogo"
            checked={settings.showLogo}
            onChange={handleChange}
            id="showLogo"
            className="bs-checkbox"
          />
          <label htmlFor="showLogo">Show Logo on Bill</label>
        </div>
        {settings.showLogo && (
          <div className="bs-form-group">
            <label>Company Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'logo')}
              className="bs-input"
            />
            {logoPreview && (
              <div className="bs-image-preview">
                <img src={logoPreview} alt="Logo Preview" className="bs-preview-image" />
              </div>
            )}
          </div>
        )}
        
        <div className="bs-form-group bs-checkbox-group">
          <input
            type="checkbox"
            name="showSignature"
            checked={settings.showSignature}
            onChange={handleChange}
            id="showSignature"
            className="bs-checkbox"
          />
          <label htmlFor="showSignature">Show Signature on Bill</label>
        </div>
        {settings.showSignature && (
          <div className="bs-form-group">
            <label>Signature Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'signature')}
              className="bs-input"
            />
            {signaturePreview && (
              <div className="bs-image-preview">
                <img src={signaturePreview} alt="Signature Preview" className="bs-preview-image" />
              </div>
            )}
          </div>
        )}
        
        <div className="bs-form-group">
          <label>UPI ID (for QR Code)</label>
          <input
            type="text"
            name="upiId"
            value={settings.upiId}
            onChange={handleChange}
            className="bs-input"
            placeholder="yourname@upi"
          />
        </div>
      </div>

      <div className="bs-form-section">
        <h2 className="bs-section-title"><FaInfoCircle /> Bill Options</h2>
        <div className="bs-form-group bs-checkbox-group">
          <input
            type="checkbox"
            name="taxEnabled"
            checked={settings.taxEnabled}
            onChange={handleChange}
            id="taxEnabled"
            className="bs-checkbox"
          />
          <label htmlFor="taxEnabled">Enable Tax</label>
        </div>
        {settings.taxEnabled && (
          <div className="bs-form-group">
            <label>Tax Rate (%)</label>
            <input
              type="number"
              name="taxRate"
              value={settings.taxRate}
              onChange={handleChange}
              className="bs-input"
              min="0"
              max="100"
            />
          </div>
        )}
        <div className="bs-form-group bs-checkbox-group">
          <input
            type="checkbox"
            name="discountEnabled"
            checked={settings.discountEnabled}
            onChange={handleChange}
            id="discountEnabled"
            className="bs-checkbox"
          />
          <label htmlFor="discountEnabled">Enable Discounts</label>
        </div>
        <div className="bs-form-group bs-checkbox-group">
          <input
            type="checkbox"
            name="printAutomatically"
            checked={settings.printAutomatically}
            onChange={handleChange}
            id="printAutomatically"
            className="bs-checkbox"
          />
          <label htmlFor="printAutomatically">Auto Print Bills</label>
        </div>
        <div className="bs-form-group bs-checkbox-group">
          <input
            type="checkbox"
            name="showCustomerDetails"
            checked={settings.showCustomerDetails}
            onChange={handleChange}
            id="showCustomerDetails"
            className="bs-checkbox"
          />
          <label htmlFor="showCustomerDetails">Show Customer Details</label>
        </div>
      </div>

      <div className="bs-form-section">
        <h2 className="bs-section-title"><FaPrint /> Terms & Conditions</h2>
        <div className="bs-form-group">
          <label>Terms and Conditions</label>
          <textarea
            name="termsAndConditions"
            value={settings.termsAndConditions}
            onChange={handleChange}
            className="bs-textarea"
            rows="4"
          />
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

  const renderBillDesignTab = () => (
    <div className="bs-bill-design-container">
      <h2 className="bs-section-title"><FaReceipt /> Bill Design</h2>
      <div className="bs-bill-design-content">
        {/* Replace this with your actual bill design component */}
            <BillDesign />
        {/* <div className="bs-bill-preview">
          <p>Your bill design component will be rendered here</p>
          <div className="bs-bill-preview-placeholder">
           
          </div>
        </div> */}
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