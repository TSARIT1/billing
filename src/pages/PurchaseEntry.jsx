import React, { useState, useEffect } from 'react';
import './BillStyle.css';
import api from '../service/api';

const AddSale = () => {
  // Shop details state

  const [userDetail,setUserDetail] = useState([])


  const fetchShopDetails = async () => {
    try {
      const res =  await api.get('/api/user/');
      setUserDetail(res.data[0])
      
    } catch (error) {
      console.error(error);
    }
  }

  

  const [shopDetails, setShopDetails] = useState({
    name: '',
    address: 'Madanapalle, AP - 517325',
    phone: '+91 9876543210',
    email: userDetail.email,
    gstin: '22AAAAA0000A1Z5',
    bankDetails: {
      name: 'Bank Name',
      account: '1234567890',
      ifsc: 'ABCD0123456'
    },
    termsAndConditions: [
      'Goods once sold will not be taken back',
      'Payment due within 15 days from invoice date',
      'Interest @18% p.a. will be charged on late payments'
    ]
  });





useEffect(() => {
  fetchShopDetails();
}, []);

  // Bill data state
  const [billData, setBillData] = useState({
    invoice_number: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    customer_name: '',
    customer_address: '',
    customer_gst: '',
    customer_state: '',
    customer_state_code: '',
    placeOfSupply: '',
    items: [
      { 
        id: 1, 
        product: null,
        product_name: '', 
        hsnSac: '',
        quantity: 1, 
        sale_price: 0, 
        priceInclusiveTax: false,
        taxRate: '18', 
        discount: 0,
        cgst: '9',
        sgst: '9',
        igst: '',     
        total: 0 
      }
    ],
    payment_method: 'Cash',
    notes: '',
    includeGST: true,
    qrCodeData: ''
  });


 

  // UI state
  const [printStyle, setPrintStyle] = useState('A4_GST');
  const [paperSize, setPaperSize] = useState('A4');
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showShopSettings, setShowShopSettings] = useState(false);

  // Autocomplete state
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentEditingId, setCurrentEditingId] = useState(null);

  // Fetch product suggestions from API
  const fetchProductSuggestions = async (query) => {
    try {
      const response = await api.get(`/api/products/?search=${query}`);
      setSuggestions(response.data);
      
      
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    const updatedItems = billData.items.map(item => {
      if (item.id === currentEditingId) {
        return {
          ...item,
          product: suggestion.id,
          product_name: suggestion.product_name,
          hsnSac: suggestion.hsn_code || '',
          sale_price: suggestion.selling_price || 0,
          taxRate: suggestion.tax_rate || '18',
          cgst: billData.includeGST ? (suggestion.tax_rate / 2 || '9') : '',
          sgst: billData.includeGST ? (suggestion.tax_rate / 2 || '9') : '',
          igst: ''
        };
      }
      return item;
    });

    setBillData({...billData, items: updatedItems});
    setShowSuggestions(false);
  };

  // Keyboard navigation for suggestions
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex(prev => 
        prev > 0 ? prev - 1 : 0
      );
    } else if (e.key === 'Enter' && activeSuggestionIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[activeSuggestionIndex]);
    }
  };

  // Generate random ID for new products
  const generateRandomId = () => {
    return Math.floor(Math.random() * 1000000);
  };

  // Handle item input changes
  const handleItemChange = (id, e) => {
    const { name, value, type, checked } = e.target;
    
    const updatedItems = billData.items.map(item => {
      if (item.id !== id) return item;
      
      const newValue = type === 'checkbox' ? checked : value;
      
      // Handle product name change separately for suggestions
      if (name === 'product_name') {
        setCurrentEditingId(id);
        setShowSuggestions(true);
        
        // Fetch suggestions if there's enough text
        if (newValue.length > 1) {
          fetchProductSuggestions(newValue);
        } else {
          setSuggestions([]);
        }
      }
      
      // Recalculate GST splits if tax rate changes
      if (name === 'taxRate' && billData.includeGST) {
        const isInterState = billData.customer_state_code && 
                           billData.customer_state_code !== shopDetails.gstin.substring(0, 2);
        
        if (isInterState) {
          return {
            ...item,
            [name]: newValue,
            igst: newValue,
            cgst: '',
            sgst: ''
          };
        } else {
          const halfRate = newValue ? (parseFloat(newValue) / 2).toString() : '';
          return {
            ...item,
            [name]: newValue,
            igst: '',
            cgst: halfRate,
            sgst: halfRate
          };
        }
      }
      
      return { ...item, [name]: newValue };
    });
    
    setBillData({ ...billData, items: updatedItems });
  };

  // Add new item row
  const addNewItem = () => {
    const newId = billData.items.length > 0 ? Math.max(...billData.items.map(item => item.id)) + 1 : 1;
    setBillData({
      ...billData,
      items: [...billData.items, { 
        id: newId, 
        product: null,
        product_name: '', 
        hsnSac: '',
        quantity: 1, 
        sale_price: 0, 
        priceInclusiveTax: false,
        taxRate: billData.includeGST ? '18' : '', 
        discount: 0,
        cgst: billData.includeGST ? '9' : '',
        sgst: billData.includeGST ? '9' : '',
        igst: ''
      }]
    });
  };

  // Remove item row
  const removeItem = (id) => {
    if (billData.items.length > 1) {
      setBillData({
        ...billData,
        items: billData.items.filter(item => item.id !== id)
      });
    }
  };

  // Calculate item totals
  const calculateItemTotal = (item) => {
    const itemTotal = item.quantity * item.sale_price;
    const discountAmount = itemTotal * (item.discount / 100);
    return itemTotal - discountAmount;
  };

  // Calculate taxable amount
  const calculateTaxableAmount = (item) => {
    if (item.priceInclusiveTax && item.taxRate) {
      const itemTotal = calculateItemTotal(item);
      const taxFactor = parseFloat(item.taxRate) / 100;
      return itemTotal / (1 + taxFactor);
    }
    return calculateItemTotal(item);
  };

  // Calculate tax amount
  const calculateTaxAmount = (item) => {
    if (!item.taxRate) return 0;
    const taxableAmount = calculateTaxableAmount(item);
    return taxableAmount * (parseFloat(item.taxRate) / 100);
  };

  // Calculate bill total
  const calculateTotal = () => {
    return billData.items.reduce((total, item) => {
      const taxableAmount = calculateTaxableAmount(item);
      const taxAmount = billData.includeGST ? calculateTaxAmount(item) : 0;
      return total + taxableAmount + taxAmount;
    }, 0);
  };

  // Calculate GST totals
  const calculateGSTTotals = () => {
    return billData.items.reduce((totals, item) => {
      const taxableAmount = calculateTaxableAmount(item);
      return {
        cgst: totals.cgst + (item.cgst ? taxableAmount * (parseFloat(item.cgst) / 100) : 0),
        sgst: totals.sgst + (item.sgst ? taxableAmount * (parseFloat(item.sgst) / 100) : 0),
        igst: totals.igst + (item.igst ? taxableAmount * (parseFloat(item.igst) / 100) : 0)
      };
    }, { cgst: 0, sgst: 0, igst: 0 });
  };

  // Generate QR code data
  const generateQRCodeData = () => {
    const gstDetails = billData.includeGST ? 
      `GSTIN:${shopDetails.gstin}|INV_NO:${billData.invoice_number}|INV_DT:${formatDate(billData.date)}|` : '';
    
    const total = calculateTotal().toFixed(2);
    const gstAmounts = calculateGSTTotals();
    const gstBreakdown = billData.includeGST ?
      `CGST:${gstAmounts.cgst.toFixed(2)}|SGST:${gstAmounts.sgst.toFixed(2)}|IGST:${gstAmounts.igst.toFixed(2)}|` : '';
    
    return `${gstDetails}${gstBreakdown}TOTAL:${total}`;
  };

  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
  };


const submitBill = async () => {
  try {
    setIsSubmitting(true);

    
    const round = (value) => Number(value.toFixed(2));

    
    const itemsWithTotals = billData.items.map(item => {
      const taxableAmount = round(calculateTaxableAmount(item));
      const taxAmount = round(calculateTaxAmount(item));
      const totalAmount = round(taxableAmount + taxAmount);

      return {
        ...item,
        product: item.product || generateRandomId(),
        taxable_amount: taxableAmount,
        tax_amount: taxAmount,
        total_amount: totalAmount
      };
    });

    
    const taxableAmount = round(
      itemsWithTotals.reduce((sum, item) => sum + item.taxable_amount, 0)
    );
    const taxAmount = round(
      itemsWithTotals.reduce((sum, item) => sum + item.tax_amount, 0)
    );
    const totalAmount = round(
      itemsWithTotals.reduce((sum, item) => sum + item.total_amount, 0)
    );

    // Prepare payload
    const payload = {
      ...billData,
      shop_details: shopDetails,
      items: itemsWithTotals,
      taxable_amount: taxableAmount,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      gst_totals: calculateGSTTotals(), 
      qr_code_data: generateQRCodeData(),
      print_style: printStyle,
      paper_size: paperSize
    };

   

    // Send to backend
    const response = await api.post('/api/sales/', payload);

    if (response.data.pdfUrl) {
      window.open(response.data.pdfUrl, '_blank');
    }

    alert('Invoice saved successfully!');
  } catch (error) {
    console.error('Error saving invoice:', error);
    alert('Failed to save invoice. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};


const handleShopDetailsChange = (e) => {
  const { name, value } = e.target;
  
  // Check if the field is nested under bankDetails
  if (name.startsWith('bankDetails.')) {
    const bankField = name.split('.')[1];
    setShopDetails(prev => ({
      ...prev,
      bankDetails: {
        ...prev.bankDetails,
        [bankField]: value
      }
    }));
  } else {
    // Handle regular fields
    setShopDetails(prev => ({
      ...prev,
      [name]: value
    }));
  }
};


  const printBill = () => {
    window.print();
  };

  const addTerm = () => {
    setShopDetails({
      ...shopDetails,
      termsAndConditions: [...shopDetails.termsAndConditions, '']
    });
  };

  const updateTerm = (index, value) => {
    const updatedTerms = [...shopDetails.termsAndConditions];
    updatedTerms[index] = value;
    setShopDetails({
      ...shopDetails,
      termsAndConditions: updatedTerms
    });
  };

  const removeTerm = (index) => {
    const updatedTerms = shopDetails.termsAndConditions.filter((_, i) => i !== index);
    setShopDetails({
      ...shopDetails,
      termsAndConditions: updatedTerms
    });
  };


const handleInputChange = (e) => {
  const { name, value, type, checked } = e.target;
  setBillData({ 
    ...billData, 
    [name]: type === 'checkbox' ? checked : value 
  });
};


// Add this function to your component (with your other handler functions)
const generatePreview = () => {
  const qrData = generateQRCodeData();
  setPreviewData({
    ...billData,
    shopDetails,
    total: calculateTotal(),
    taxableAmount: billData.items.reduce((sum, item) => sum + calculateTaxableAmount(item), 0),
    gstTotals: calculateGSTTotals(),
    printStyle,
    paperSize,
    qrCodeData: qrData
  });
};

const downloadPDF = async () => {
  try {
    setIsLoading(true);
    const qrData = generateQRCodeData();
    
    // Prepare the data to send to your PDF generation endpoint
    const pdfData = {
      billData: {
        ...billData,
        shopDetails,
        total: calculateTotal(),
        taxableAmount: billData.items.reduce((sum, item) => sum + calculateTaxableAmount(item), 0),
        gstTotals: calculateGSTTotals(),
        qrCodeData: qrData
      },
      printStyle,
      paperSize
    };

    // Call your backend API to generate PDF
    const response = await api.post('/api/generate-pdf', pdfData, {
      responseType: 'blob' // Important for receiving PDF files
    });

    // Create download link for the PDF
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Invoice_${billData.invoice_number}.pdf`);
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    link.remove();
    window.URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

const getExpiryClass = (days) => {
  if (days === null) return 'expiry-na';
  if (days < 0) return 'expiry-expired';
  if (days <= 7) return 'expiry-soon';
  if (days <= 30) return 'expiry-upcoming';
  return 'expiry-safe';
};

  return (
    <div className="bill-container">
      <h1>Bill Design</h1>
      
      <div className="bill-controls">
        <div className="control-group">
          <label>Print Style:</label>
          <select value={printStyle} onChange={(e) => setPrintStyle(e.target.value)}>
            <option value="A4_GST">A4 GST Style</option>
            <option value="A4_NON_GST">A4 Non-GST Style</option>
            <option value="A4_SIMPLE">A4 Simple</option>
            <option value="A4_MODERN">A4 Modern</option>
            <option value="THERMAL_GST">Thermal GST</option>
            <option value="THERMAL_NON_GST">Thermal Non-GST</option>
            <option value="THERMAL_SIMPLE">Thermal Simple</option>
          </select>
        </div>

        <div className="control-group">
          <label>Paper Size:</label>
          <select value={paperSize} onChange={(e) => setPaperSize(e.target.value)}>
            <option value="A4">A4</option>
            <option value="A5">A5</option>
            <option value="p80mm">80mm</option>
            <option value="p58mm">58mm</option>
          </select>
        </div>

        <div className="control-group">
          <label>
            <input 
              type="checkbox" 
              checked={billData.includeGST} 
              onChange={(e) => setBillData({...billData, includeGST: e.target.checked})} 
            />
            Include GST
          </label>
        </div>

        <button 
          type="button" 
          className="shop-settings-btn"
          onClick={() => setShowShopSettings(!showShopSettings)}
        >
          {showShopSettings ? 'Hide Shop Settings' : 'Shop Settings'}
        </button>
      </div>

      {showShopSettings && (
        <div className="shop-settings">
          <h2>Shop Details</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Shop Name *</label>
              <input 
                type="text" 
                name="name" 
                value={shopDetails.name} 
                onChange={handleShopDetailsChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Address *</label>
              <input 
                type="text" 
                name="address" 
                value={shopDetails.address} 
                onChange={handleShopDetailsChange} 
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
                onChange={handleShopDetailsChange} 
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                name="email" 
                value={shopDetails.email} 
                onChange={handleShopDetailsChange} 
              />
            </div>
            <div className="form-group">
              <label>GSTIN</label>
              <input 
                type="text" 
                name="gstin" 
                value={shopDetails.gstin} 
                onChange={handleShopDetailsChange} 
              />
            </div>
          </div>

          <h3>Bank Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Bank Name</label>
              <input 
                type="text" 
                name="bankDetails.name" 
                value={shopDetails.bankDetails.name} 
                onChange={handleShopDetailsChange} 
              />
            </div>
            <div className="form-group">
              <label>Account Number</label>
              <input 
                type="text" 
                name="bankDetails.account" 
                value={shopDetails.bankDetails.account} 
                onChange={handleShopDetailsChange} 
              />
            </div>
            <div className="form-group">
              <label>IFSC Code</label>
              <input 
                type="text" 
                name="bankDetails.ifsc" 
                value={shopDetails.bankDetails.ifsc} 
                onChange={handleShopDetailsChange} 
              />
            </div>
          </div>

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
        </div>
      )}

      <div className="bill-form">
        <div className="form-section">
          <h2>Invoice Details</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Invoice Number *</label>
              <input 
                type="text" 
                name="invoice_number" 
                value={billData.invoice_number} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Invoice Date</label>
              <input 
                type="date" 
                name="date" 
                value={billData.date} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input 
                type="date" 
                name="dueDate" 
                value={billData.dueDate} 
                onChange={handleInputChange} 
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Customer Details</h2>
          <div className="form-group">
            <label>Customer Name</label>
            <input 
              type="text" 
              name="customer_name" 
              value={billData.customer_name} 
              onChange={handleInputChange} 
            />
          </div>
          <div className="form-group">
            <label>Customer Address</label>
            <textarea 
              name="customer_address" 
              value={billData.customer_address} 
              onChange={handleInputChange} 
              rows="3"
            />
          </div>
          {billData.includeGST && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Customer GSTIN</label>
                  <input 
                    type="text" 
                    name="customer_gst" 
                    value={billData.customer_gst} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input 
                    type="text" 
                    name="customer_state" 
                    value={billData.customer_state} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="form-group">
                  <label>State Code</label>
                  <input 
                    type="text" 
                    name="customer_state_code" 
                    value={billData.customer_state_code} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Place of Supply</label>
                <input 
                  type="text" 
                  name="placeOfSupply" 
                  value={billData.placeOfSupply} 
                  onChange={handleInputChange} 
                />
              </div>
            </>
          )}
        </div>

        <div className="form-section">
          <h2>Items</h2>
          <table className="items-table">
            <thead>
              <tr>
                <th>Item</th>
                {billData.includeGST && <th>HSN/SAC</th>}
                <th>Qty</th>
                <th>Rate</th>
                <th>Price Incl. Tax</th>
                {billData.includeGST && <th>Tax Rate (%)</th>}
                {billData.includeGST && <th>CGST (%)</th>}
                {billData.includeGST && <th>SGST (%)</th>}
                {billData.includeGST && <th>IGST (%)</th>}
                <th>Discount (%)</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {billData.items.map(item => (
                <tr key={item.id}>
                   
              <td style={{width:"220px"}} className='drop-down-suggest'>
                    <div className="product-autocomplete">
                      <input
                        type="text"
                        className="form-control"
                        name="product_name"
                        value={item.product_name}
                        onChange={(e) => handleItemChange(item.id, e)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => {
                          setCurrentEditingId(item.id);
                          if (item.product_name.length > 1) {
                            setShowSuggestions(true);
                            fetchProductSuggestions(item.product_name);
                          }
                        }}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      />
                      {showSuggestions && currentEditingId === item.id && (
                        <div className="suggestions-dropdown">
                          {suggestions.length > 0 ? (
                            suggestions.map((suggestion, index) => (
                              <div
                                    key={suggestion.id}
                                    className={`suggestion-item ${index === activeSuggestionIndex ? 'active' : ''}`}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    onMouseDown={() => handleSuggestionClick(suggestion)}
                                  >
                                    {suggestion.product_name} - ₹{suggestion.selling_price} | {suggestion.stock_quantity} UNITS left |
                                    <span className={`expiry-text ${getExpiryClass(suggestion.days_to_expiry)}`}>
                                      {" "}Expires in {suggestion.days_to_expiry !== null ? `${suggestion.days_to_expiry} day(s)` : "N/A"}
                                    </span>
                                    <hr />
                                  </div>
                            ))
                          ) : (
                            <div className="no-suggestions">
                              {item.product_name.length > 1 ? 'No products found' : 'Type to search products'}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  {billData.includeGST && (
                    <td>
                      <input 
                        type="text" 
                        name="hsnSac" 
                        value={item.hsnSac} 
                        onChange={(e) => handleItemChange(item.id, e)} 
                      />
                    </td>
                  )}
                  <td>
                    <input 
                      type="number" 
                      name="quantity" 
                      value={item.quantity} 
                      onChange={(e) => handleItemChange(item.id, e)} 
                      min="1"
                    />
                  </td>
                  <td>
                    <input 
                      type="number" 
                      name="sale_price" 
                      value={item.sale_price} 
                      onChange={(e) => handleItemChange(item.id, e)} 
                      min="0"
                      step="0.01"
                    />
                  </td>
                  <td>
                    <input 
                      type="checkbox" 
                      name="priceInclusiveTax" 
                      checked={item.priceInclusiveTax} 
                      onChange={(e) => handleItemChange(item.id, e)} 
                    />
                  </td>
                  {billData.includeGST && (
                    <>
                      <td>
                        <input 
                          type="number" 
                          name="taxRate" 
                          value={item.taxRate} 
                          onChange={(e) => handleItemChange(item.id, e)} 
                          min="0"
                          max="28"
                          step="0.01"
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          name="cgst" 
                          value={item.cgst} 
                          onChange={(e) => handleItemChange(item.id, e)} 
                          // readOnly={!!item.taxRate}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          name="sgst" 
                          value={item.sgst} 
                          onChange={(e) => handleItemChange(item.id, e)} 
                          // readOnly={!!item.taxRate}
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          name="igst" 
                          value={item.igst} 
                          onChange={(e) => handleItemChange(item.id, e)} 
                          // readOnly={!!item.taxRate}
                        />
                      </td>
                    </>
                  )}
                  <td>
                    <input 
                      type="number" 
                      name="discount" 
                      value={item.discount} 
                      onChange={(e) => handleItemChange(item.id, e)} 
                      min="0"
                      max="100"
                    />
                  </td>
                  <td>
                    {item.priceInclusiveTax ? 
                      (item.quantity * item.sale_price * (1 - item.discount / 100)).toFixed(2) :
                      ((item.quantity * item.sale_price * (1 - item.discount / 100)) * 
                      (1 + (item.taxRate ? parseFloat(item.taxRate) / 100 : 0))).toFixed(2)}
                  </td>
                  <td>
                    <button 
                      type="button" 
                      className="remove-btn"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className="add-item-btn" onClick={addNewItem}>
            Add Item
          </button>
        </div>

        <div className="form-section">
          <h2>Payment Details</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Payment Method</label>
              <select 
                name="payment_method" 
                value={billData.payment_method} 
                onChange={handleInputChange}
              >
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
                <option value="Credit">Credit</option>
              </select>
            </div>
            <div className="form-group">
              <label>Total Amount</label>
              <div className="total-amount">₹{calculateTotal().toFixed(2)}</div>
            </div>
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea 
              name="notes" 
              value={billData.notes} 
              onChange={handleInputChange} 
              rows="2"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="preview-btn" onClick={generatePreview}>
            Preview
          </button>
          <button 
            type="button" 
            className="download-btn"
            onClick={downloadPDF}
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Download PDF'}
          </button>
          <button 
            type="button" 
            className="submit-btn"
            onClick={submitBill}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit & Save'}
          </button>
          <button type="button" className="print-btn" onClick={printBill}>
            Print
          </button>
        </div>
      </div>

      {previewData && (
        <div className={`bill-preview ${printStyle.toLowerCase()} ${paperSize.toLowerCase()}`}>
          {/* Modern Bill Preview */}
          {printStyle === 'A4_MODERN' ? (
            <div className="modern-invoice">
              <div className="modern-header">
                <div className="modern-shop-info">
                  <h1>{previewData.shopDetails.name}</h1>
                  <div className="modern-address">{previewData.shopDetails.address}</div>
                  <div className="modern-contact">
                    {previewData.shopDetails.phone} | {previewData.shopDetails.email}
                  </div>
                  {previewData.shopDetails.gstin && (
                    <div className="modern-gst">GSTIN: {previewData.shopDetails.gstin}</div>
                  )}
                </div>
                <div className="modern-invoice-title">
                  <h2>INVOICE</h2>
                  <div className="modern-invoice-meta">
                    <div><span>Invoice #:</span> {previewData.invoice}</div>
                    <div><span>Date:</span> {formatDate(previewData.date)}</div>
                    {previewData.dueDate && <div><span>Due Date:</span> {formatDate(previewData.dueDate)}</div>}
                  </div>
                </div>
              </div>

              <div className="modern-customer">
                <div className="modern-customer-info">
                  <h3>BILL TO</h3>
                  <div className="modern-customer-name">{previewData.customer_name}</div>
                  {previewData.customer_address && (
                    <div className="modern-customer-address">{previewData.customer_address}</div>
                  )}
                  {previewData.customer_gst && (
                    <div className="modern-customer-gst">GSTIN: {previewData.customer_gst}</div>
                  )}
                </div>
                {previewData.includeGST && (
                  <div className="modern-gst-details">
                    <div><span>Place of Supply:</span> {previewData.placeOfSupply}</div>
                    <div><span>State Code:</span> {previewData.customer_state_code}</div>
                  </div>
                )}
              </div>

              <table className="modern-items">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Description</th>
                    {previewData.includeGST && <th>HSN/SAC</th>}
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.items.map((item, index) => {
                    const amount = item.priceInclusiveTax ? 
                      (item.quantity * item.sale_price * (1 - item.discount / 100)) :
                      ((item.quantity * item.sale_price * (1 - item.discount / 100)) * 
                      (1 + (item.taxRate ? parseFloat(item.taxRate) / 100 : 0)));
                    
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          {item.name || 'Item ' + (index + 1)}
                          {item.discount > 0 && (
                            <div className="item-discount">Discount: {item.discount}%</div>
                          )}
                          {previewData.includeGST && item.taxRate && (
                            <div className="item-tax">
                              {item.igst ? `IGST ${item.igst}%` : `CGST ${item.cgst}% + SGST ${item.sgst}%`}
                            </div>
                          )}
                        </td>
                        {previewData.includeGST && <td>{item.hsnSac}</td>}
                        <td>{item.quantity}</td>
                        <td>₹{item.sale_price.toFixed(2)}</td>
                        <td>₹{amount.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="modern-totals">
                <div className="modern-notes">
                  <h4>Notes</h4>
                  {previewData.notes && <div className="modern-note">{previewData.notes}</div>}
                  <div className="modern-payment-method">
                    Payment Method: {previewData.payment_method}
                  </div>
                </div>
                <div className="modern-amounts">
                  <div className="modern-subtotal">
                    <span>Subtotal:</span>
                    <span>₹{previewData.taxableAmount.toFixed(2)}</span>
                  </div>
                  
                  {previewData.includeGST && previewData.gstTotals.cgst > 0 && (
                    <div className="modern-tax">
                      <span>CGST:</span>
                      <span>₹{previewData.gstTotals.cgst.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {previewData.includeGST && previewData.gstTotals.sgst > 0 && (
                    <div className="modern-tax">
                      <span>SGST:</span>
                      <span>₹{previewData.gstTotals.sgst.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {previewData.includeGST && previewData.gstTotals.igst > 0 && (
                    <div className="modern-tax">
                      <span>IGST:</span>
                      <span>₹{previewData.gstTotals.igst.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="modern-grand-total">
                    <span>Total:</span>
                    <span>₹{previewData.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="modern-footer">
                <div className="modern-terms">
                  <h4>Terms & Conditions</h4>
                  <ul>
                    {previewData.shopDetails.termsAndConditions.map((term, index) => (
                      <li key={index}>{term}</li>
                    ))}
                  </ul>
                </div>
                <div className="modern-signature">
                  <div>For {previewData.shopDetails.name}</div>
                  <div className="modern-signature-line">Authorized Signatory</div>
                </div>
              </div>
            </div>
          ) : previewData.includeGST ? (
            /* GST Bill Preview */
            <div className="gst-invoice">
              <div className="preview-header">
                <div className="shop-info">
                  <h2>{previewData.shopDetails.name}</h2>
                  <div>{previewData.shopDetails.address}</div>
                  <div>Phone: {previewData.shopDetails.phone} | Email: {previewData.shopDetails.email}</div>
                  <div>GSTIN: {previewData.shopDetails.gstin}</div>
                </div>
                <div className="invoice-title">
                  <h2>TAX INVOICE</h2>
                  <div className="invoice-meta">
                    <div><strong>Invoice #:</strong> {previewData.invoice}</div>
                    <div><strong>Date:</strong> {formatDate(previewData.date)}</div>
                    {previewData.dueDate && <div><strong>Due Date:</strong> {formatDate(previewData.dueDate)}</div>}
                  </div>
                </div>
              </div>

              <div className="preview-customer">
                <div className="customer-info">
                  <h3>Billed To:</h3>
                  <div className="customer-name">{previewData.customer_name}</div>
                  {previewData.customer_address && (
                    <div className="customer-address">{previewData.customer_address}</div>
                  )}
                  {previewData.customer_gst && (
                    <div className="customer-gst">GSTIN: {previewData.customer_gst}</div>
                  )}
                  {previewData.placeOfSupply && (
                    <div className="place-of-supply">Place of Supply: {previewData.placeOfSupply}</div>
                  )}
                </div>
                <div className="bank-details">
                  <h3>Bank Details:</h3>
                  <div>{previewData.shopDetails.bankDetails.name}</div>
                  <div>A/C: {previewData.shopDetails.bankDetails.account}</div>
                  <div>IFSC: {previewData.shopDetails.bankDetails.ifsc}</div>
                </div>
              </div>

              <table className="preview-items">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Item Description</th>
                    <th>HSN/SAC</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>Disc.%</th>
                    <th>Taxable Value</th>
                    <th>CGST</th>
                    <th>SGST</th>
                    <th>IGST</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.items.map((item, index) => {
                    const taxableAmount = calculateTaxableAmount(item);
                    const taxAmount = calculateTaxAmount(item);
                    const itemTotal = taxableAmount + taxAmount;
                    
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.name || 'Item ' + (index + 1)}</td>
                        <td>{item.hsnSac}</td>
                        <td>{item.quantity}</td>
                        <td>{item.sale_price}</td>
                        <td>{item.discount}%</td>
                        <td>{taxableAmount.toFixed(2)}</td>
                        <td>
                          {item.cgst && (
                            <>
                              {item.cgst}%<br />
                              {(taxableAmount * (parseFloat(item.cgst) / 100).toFixed(2))}
                            </>
                          )}
                        </td>
                        <td>
                          {item.sgst && (
                            <>
                              {item.sgst}%<br />
                              {(taxableAmount * (parseFloat(item.sgst) / 100).toFixed(2))}
                            </>
                          )}
                        </td>
                        <td>
                          {item.igst && (
                            <>
                              {item.igst}%<br />
                              {(taxableAmount * (parseFloat(item.igst) / 100).toFixed(2))}
                            </>
                          )}
                        </td>
                        <td>{itemTotal.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="preview-totals">
                <div className="totals-left">
                  <div className="qr-code">
                    QR-CODE here
                    <div className="qr-note">Scan for invoice verification</div>
                  </div>
                  <div className="payment-notes">
                    <div><strong>Payment Method:</strong> {previewData.payment_method}</div>
                    {previewData.notes && (
                      <div><strong>Notes:</strong> {previewData.notes}</div>
                    )}
                  </div>
                </div>
                
                <div className="totals-right">
                  <div className="totals-row">
                    <span>Total Taxable Value:</span>
                    <span>₹{previewData.taxableAmount.toFixed(2)}</span>
                  </div>
                  
                  {previewData.gstTotals.cgst > 0 && (
                    <div className="totals-row">
                      <span>Total CGST:</span>
                      <span>₹{previewData.gstTotals.cgst.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {previewData.gstTotals.sgst > 0 && (
                    <div className="totals-row">
                      <span>Total SGST:</span>
                      <span>₹{previewData.gstTotals.sgst.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {previewData.gstTotals.igst > 0 && (
                    <div className="totals-row">
                      <span>Total IGST:</span>
                      <span>₹{previewData.gstTotals.igst.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="totals-row grand-total">
                    <span>Grand Total:</span>
                    <span>₹{previewData.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="preview-footer">
                <div className="terms">
                  <strong>Terms & Conditions:</strong>
                  <ul>
                    {previewData.shopDetails.termsAndConditions.map((term, index) => (
                      <li key={index}>{term}</li>
                    ))}
                  </ul>
                </div>
                <div className="signature">
                  <div>For {previewData.shopDetails.name}</div>
                  <div className="signature-line">Authorized Signatory</div>
                </div>
              </div>
            </div>
          ) : (
            /* Non-GST Bill Preview */
            <div className="simple-invoice">
              <div className="preview-header">
                <div className="shop-info">
                  <h2>{previewData.shopDetails.name}</h2>
                  <div>{previewData.shopDetails.address}</div>
                  <div>Phone: {previewData.shopDetails.phone} | Email: {previewData.shopDetails.email}</div>
                </div>
                <div className="invoice-title">
                  <h2>INVOICE</h2>
                  <div className="invoice-meta">
                    <div><strong>Invoice #:</strong> {previewData.invoice}</div>
                    <div><strong>Date:</strong> {formatDate(previewData.date)}</div>
                    {previewData.dueDate && <div><strong>Due Date:</strong> {formatDate(previewData.dueDate)}</div>}
                  </div>
                </div>
              </div>

              <div className="preview-customer">
                <div className="customer-info">
                  <h3>Billed To:</h3>
                  <div className="customer-name">{previewData.customer_name}</div>
                  {previewData.customer_address && (
                    <div className="customer-address">{previewData.customer_address}</div>
                  )}
                </div>
              </div>

              <table className="preview-items simple">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Item Description</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.items.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.name || 'Item ' + (index + 1)}</td>
                      <td>{item.quantity}</td>
                      <td>{item.sale_price}</td>
                      <td>{(item.quantity * item.sale_price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="preview-totals simple">
                <div className="totals-left">
                  <div className="payment-notes">
                    <div><strong>Payment Method:</strong> {previewData.payment_method}</div>
                    {previewData.notes && (
                      <div><strong>Notes:</strong> {previewData.notes}</div>
                    )}
                  </div>
                </div>
                
                <div className="totals-right">
                  <div className="totals-row grand-total">
                    <span>Total Amount:</span>
                    <span>₹{previewData.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="preview-footer simple">
                <div className="terms">
                  <strong>Terms & Conditions:</strong>
                  <ul>
                    {previewData.shopDetails.termsAndConditions.map((term, index) => (
                      <li key={index}>{term}</li>
                    ))}
                  </ul>
                </div>
                <div className="signature">
                  <div>For {previewData.shopDetails.name}</div>
                  <div className="signature-line">Authorized Signatory</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddSale;