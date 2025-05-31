import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BillDesign.css';

const BillDesign = () => {
  const [shopDetails, setShopDetails] = useState({
    name: 'My Shop',
    address: 'Madanapalle,AP, - 517325',
    phone: '+91 9876543210',
    email: 'shop@example.com',
    gstin: '22AAAAA0000A1Z5',
    bankDetails: {
      name: 'Bank Name',
      account: '1234567890',
      ifsc: 'ABCD0123456'
    }
  });

  const [billData, setBillData] = useState({
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    customerName: '',
    customerAddress: '',
    customerGST: '',
    customerState: '',
    customerStateCode: '',
    placeOfSupply: '',
    items: [
      { 
        id: 1, 
        name: '', 
        hsnSac: '',
        quantity: 1, 
        price: 0, 
        priceInclusiveTax: false,
        taxRate: 18, 
        discount: 0,
        cgst: 0,
        sgst: 0,
        igst: 0
      }
    ],
    paymentMethod: 'Cash',
    notes: '',
    includeGST: true,
    qrCodeData: ''
  });

  const [printStyle, setPrintStyle] = useState('A4_GST');
  const [paperSize, setPaperSize] = useState('A4');
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    // Calculate GST splits when tax rate changes
    const updatedItems = billData.items.map(item => {
      if (!billData.includeGST) return item;
      
      const isInterState = billData.customerStateCode && 
                         billData.customerStateCode !== shopDetails.gstin.substring(0, 2);
      
      if (isInterState) {
        return {
          ...item,
          igst: item.taxRate,
          cgst: 0,
          sgst: 0
        };
      } else {
        const halfRate = item.taxRate / 2;
        return {
          ...item,
          igst: 0,
          cgst: halfRate,
          sgst: halfRate
        };
      }
    });
    
    setBillData({...billData, items: updatedItems});
  }, [billData.includeGST, billData.customerStateCode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillData({ ...billData, [name]: value });
  };

  const handleShopDetailsChange = (e) => {
    const { name, value } = e.target;
    setShopDetails({ ...shopDetails, [name]: value });
  };

  const handleItemChange = (id, e) => {
    const { name, value, type, checked } = e.target;
    
    const updatedItems = billData.items.map(item => {
      if (item.id !== id) return item;
      
      const newValue = type === 'checkbox' ? checked : 
                      type === 'number' ? parseFloat(value || 0) : value;
      
      // Recalculate GST splits if tax rate changes
      if (name === 'taxRate' && billData.includeGST) {
        const isInterState = billData.customerStateCode && 
                           billData.customerStateCode !== shopDetails.gstin.substring(0, 2);
        
        if (isInterState) {
          return {
            ...item,
            [name]: newValue,
            igst: newValue,
            cgst: 0,
            sgst: 0
          };
        } else {
          const halfRate = newValue / 2;
          return {
            ...item,
            [name]: newValue,
            igst: 0,
            cgst: halfRate,
            sgst: halfRate
          };
        }
      }
      
      return { ...item, [name]: newValue };
    });
    
    setBillData({ ...billData, items: updatedItems });
  };

  const addNewItem = () => {
    const newId = billData.items.length > 0 ? Math.max(...billData.items.map(item => item.id)) + 1 : 1;
    setBillData({
      ...billData,
      items: [...billData.items, { 
        id: newId, 
        name: '', 
        hsnSac: '',
        quantity: 1, 
        price: 0, 
        priceInclusiveTax: false,
        taxRate: 18, 
        discount: 0,
        cgst: 9,
        sgst: 9,
        igst: 0
      }]
    });
  };

  const removeItem = (id) => {
    if (billData.items.length > 1) {
      setBillData({
        ...billData,
        items: billData.items.filter(item => item.id !== id)
      });
    }
  };

  const calculateItemTotal = (item) => {
    const itemTotal = item.quantity * item.price;
    const discountAmount = itemTotal * (item.discount / 100);
    return itemTotal - discountAmount;
  };

  const calculateTaxableAmount = (item) => {
    if (item.priceInclusiveTax) {
      const itemTotal = calculateItemTotal(item);
      const taxFactor = item.taxRate / 100;
      return itemTotal / (1 + taxFactor);
    }
    return calculateItemTotal(item);
  };

  const calculateTaxAmount = (item) => {
    const taxableAmount = calculateTaxableAmount(item);
    return taxableAmount * (item.taxRate / 100);
  };

  const calculateTotal = () => {
    return billData.items.reduce((total, item) => {
      const taxableAmount = calculateTaxableAmount(item);
      const taxAmount = billData.includeGST ? calculateTaxAmount(item) : 0;
      return total + taxableAmount + taxAmount;
    }, 0);
  };

  const calculateGSTTotals = () => {
    return billData.items.reduce((totals, item) => {
      const taxableAmount = calculateTaxableAmount(item);
      return {
        cgst: totals.cgst + (taxableAmount * (item.cgst / 100)),
        sgst: totals.sgst + (taxableAmount * (item.sgst / 100)),
        igst: totals.igst + (taxableAmount * (item.igst / 100))
      };
    }, { cgst: 0, sgst: 0, igst: 0 });
  };

  const generateQRCodeData = () => {
    const gstDetails = billData.includeGST ? 
      `GSTIN:${shopDetails.gstin}|INV_NO:${billData.invoiceNumber}|INV_DT:${formatDate(billData.date)}|` : '';
    
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

  const generatePreview = () => {
    const qrData = generateQRCodeData();
    setPreviewData({
      ...billData,
      shopDetails,
      totalAmount: calculateTotal(),
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
      const response = await axios.post('/api/bills/generate-pdf', {
        billData: {
          ...billData,
          shopDetails,
          totalAmount: calculateTotal(),
          taxableAmount: billData.items.reduce((sum, item) => sum + calculateTaxableAmount(item), 0),
          gstTotals: calculateGSTTotals(),
          qrCodeData: qrData
        },
        printStyle,
        paperSize
      }, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice_${billData.invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const printBill = () => {
    window.print();
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
            <option value="THERMAL_GST">Thermal GST</option>
            <option value="THERMAL_NON_GST">Thermal Non-GST</option>
          </select>
        </div>

        <div className="control-group">
          <label>Paper Size:</label>
          <select value={paperSize} onChange={(e) => setPaperSize(e.target.value)}>
            <option value="A4">A4</option>
            <option value="80mm">80mm</option>
            <option value="58mm">58mm</option>
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
      </div>

      <div className="shop-details-form">
        <h2>Shop Details</h2>
        <div className="form-group">
          <label>Shop Name</label>
          <input 
            type="text" 
            name="name" 
            value={shopDetails.name} 
            onChange={handleShopDetailsChange} 
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <textarea 
            name="address" 
            value={shopDetails.address} 
            onChange={handleShopDetailsChange} 
            rows="3"
          />
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
        </div>
        {billData.includeGST && (
          <div className="form-group">
            <label>GSTIN</label>
            <input 
              type="text" 
              name="gstin" 
              value={shopDetails.gstin} 
              onChange={handleShopDetailsChange} 
            />
          </div>
        )}
        <div className="form-group">
          <label>Bank Details</label>
          <div className="bank-details">
            <input 
              type="text" 
              placeholder="Bank Name" 
              name="name" 
              value={shopDetails.bankDetails.name} 
              onChange={(e) => setShopDetails({
                ...shopDetails, 
                bankDetails: {...shopDetails.bankDetails, name: e.target.value}
              })} 
            />
            <input 
              type="text" 
              placeholder="Account Number" 
              name="account" 
              value={shopDetails.bankDetails.account} 
              onChange={(e) => setShopDetails({
                ...shopDetails, 
                bankDetails: {...shopDetails.bankDetails, account: e.target.value}
              })} 
            />
            <input 
              type="text" 
              placeholder="IFSC Code" 
              name="ifsc" 
              value={shopDetails.bankDetails.ifsc} 
              onChange={(e) => setShopDetails({
                ...shopDetails, 
                bankDetails: {...shopDetails.bankDetails, ifsc: e.target.value}
              })} 
            />
          </div>
        </div>
      </div>

      <div className="bill-form">
        <div className="form-section">
          <h2>Invoice Details</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Invoice Number *</label>
              <input 
                type="text" 
                name="invoiceNumber" 
                value={billData.invoiceNumber} 
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
              name="customerName" 
              value={billData.customerName} 
              onChange={handleInputChange} 
            />
          </div>
          <div className="form-group">
            <label>Customer Address</label>
            <textarea 
              name="customerAddress" 
              value={billData.customerAddress} 
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
                    name="customerGST" 
                    value={billData.customerGST} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input 
                    type="text" 
                    name="customerState" 
                    value={billData.customerState} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="form-group">
                  <label>State Code</label>
                  <input 
                    type="text" 
                    name="customerStateCode" 
                    value={billData.customerStateCode} 
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
                  <td>
                    <input 
                      type="text" 
                      name="name" 
                      value={item.name} 
                      onChange={(e) => handleItemChange(item.id, e)} 
                    />
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
                      name="price" 
                      value={item.price} 
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
                        />
                      </td>
                      <td>{item.cgst}%</td>
                      <td>{item.sgst}%</td>
                      <td>{item.igst}%</td>
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
                      (item.quantity * item.price * (1 - item.discount / 100)).toFixed(2) :
                      ((item.quantity * item.price * (1 - item.discount / 100)) * (1 + item.taxRate / 100)).toFixed(2)}
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
                name="paymentMethod" 
                value={billData.paymentMethod} 
                onChange={handleInputChange}
              >
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
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
          <button type="button" className="print-btn" onClick={printBill}>
            Print
          </button>
        </div>
      </div>

      {previewData && (
        <div className={`bill-preview ${printStyle.toLowerCase()} ${paperSize.toLowerCase()}`}>
          {/* GST Bill Preview */}
          {previewData.includeGST ? (
            <>
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
                    <div><strong>Invoice #:</strong> {previewData.invoiceNumber}</div>
                    <div><strong>Date:</strong> {formatDate(previewData.date)}</div>
                    {previewData.dueDate && <div><strong>Due Date:</strong> {formatDate(previewData.dueDate)}</div>}
                  </div>
                </div>
              </div>

              <div className="preview-customer">
                <div className="customer-info">
                  <h3>Billed To:</h3>
                  <div className="customer-name">{previewData.customerName}</div>
                  {previewData.customerAddress && (
                    <div className="customer-address">{previewData.customerAddress}</div>
                  )}
                  {previewData.customerGST && (
                    <div className="customer-gst">GSTIN: {previewData.customerGST}</div>
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
                        <td>{item.price.toFixed(2)}</td>
                        <td>{item.discount}%</td>
                        <td>{taxableAmount.toFixed(2)}</td>
                        <td>
                          {item.cgst > 0 && (
                            <>
                              {item.cgst}%<br />
                              {(taxableAmount * (item.cgst / 100)).toFixed(2)}
                            </>
                          )}
                        </td>
                        <td>
                          {item.sgst > 0 && (
                            <>
                              {item.sgst}%<br />
                              {(taxableAmount * (item.sgst / 100)).toFixed(2)}
                            </>
                          )}
                        </td>
                        <td>
                          {item.igst > 0 && (
                            <>
                              {item.igst}%<br />
                              {(taxableAmount * (item.igst / 100)).toFixed(2)}
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
                    <div><strong>Payment Method:</strong> {previewData.paymentMethod}</div>
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
                    <span>₹{previewData.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="preview-footer">
                <div className="terms">
                  <strong>Terms & Conditions:</strong>
                  <div>1. Goods once sold will not be taken back.</div>
                  <div>2. Payment due within {previewData.dueDate ? formatDate(previewData.dueDate) : '15 days'} from invoice date.</div>
                </div>
                <div className="signature">
                  <div>For {previewData.shopDetails.name}</div>
                  <div className="signature-line">Authorized Signatory</div>
                </div>
              </div>
            </>
          ) : (
            /* Non-GST Bill Preview */
            <>
              <div className="preview-header">
                <div className="shop-info">
                  <h2>{previewData.shopDetails.name}</h2>
                  <div>{previewData.shopDetails.address}</div>
                  <div>Phone: {previewData.shopDetails.phone} | Email: {previewData.shopDetails.email}</div>
                </div>
                <div className="invoice-title">
                  <h2>INVOICE</h2>
                  <div className="invoice-meta">
                    <div><strong>Invoice #:</strong> {previewData.invoiceNumber}</div>
                    <div><strong>Date:</strong> {formatDate(previewData.date)}</div>
                    {previewData.dueDate && <div><strong>Due Date:</strong> {formatDate(previewData.dueDate)}</div>}
                  </div>
                </div>
              </div>

              <div className="preview-customer">
                <div className="customer-info">
                  <h3>Billed To:</h3>
                  <div className="customer-name">{previewData.customerName}</div>
                  {previewData.customerAddress && (
                    <div className="customer-address">{previewData.customerAddress}</div>
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
                      <td>{item.price.toFixed(2)}</td>
                      <td>{(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="preview-totals simple">
                <div className="totals-left">
                  <div className="payment-notes">
                    <div><strong>Payment Method:</strong> {previewData.paymentMethod}</div>
                    {previewData.notes && (
                      <div><strong>Notes:</strong> {previewData.notes}</div>
                    )}
                  </div>
                </div>
                
                <div className="totals-right">
                  <div className="totals-row grand-total">
                    <span>Total Amount:</span>
                    <span>₹{previewData.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="preview-footer simple">
                <div className="terms">
                  <strong>Terms & Conditions:</strong>
                  <div>1. Goods once sold will not be taken back.</div>
                  <div>2. Payment due within {previewData.dueDate ? formatDate(previewData.dueDate) : '15 days'} from invoice date.</div>
                </div>
                <div className="signature">
                  <div>For {previewData.shopDetails.name}</div>
                  <div className="signature-line">Authorized Signatory</div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BillDesign;