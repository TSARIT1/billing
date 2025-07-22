// PurchaseEntry.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './addsale.css';
import PurchaseForm from './PurchaseForm';
import PurchaseTableView from './PurchaseTableView';
import PurchasePreviewModal from './PurchasePreviewModal';

const PurchaseEntry = () => {
  const navigate = useNavigate();
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [unitTypes] = useState(['PCS', 'KG', 'L', 'M', 'BOX']);
  const [shopDetails, setShopDetails] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewType, setPreviewType] = useState('A4');
  const [enableGST, setEnableGST] = useState(false);
  const [gstDetails, setGstDetails] = useState({
    gstNumber: '',
    gstPercentage: 18
  });

  const printRef = useRef();

  const [form, setForm] = useState({
    barcode: '',
    productName: '',
    purchasePrice: '',
    quantity: '',
    unitType: 'PCS',
    purchaseDate: new Date().toISOString().split('T')[0],
    mrp: '',
    salePrice: '',
    vendor: '',
  });

  // Fetch vendors, purchases, and shop details on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [vendorsRes, purchasesRes, shopRes] = await Promise.all([
          axios.get('/api/vendors'),
          axios.get('/api/purchases'),
          axios.get('/api/shop')
        ]);
        
        setVendors(Array.isArray(vendorsRes.data) ? vendorsRes.data : vendorsRes.data.vendors || []);
        setProducts(Array.isArray(purchasesRes.data) ? purchasesRes.data : []);
        setShopDetails(shopRes.data);
        if (shopRes.data.gstNumber) {
          setEnableGST(true);
          setGstDetails({
            gstNumber: shopRes.data.gstNumber,
            gstPercentage: shopRes.data.gstPercentage || 18
          });
        }
      } catch (err) {
        toast.error('Failed to load data');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    if (!form.productName || !form.purchasePrice || !form.quantity) {
      toast.error('Product name, purchase price, and quantity are required');
      return false;
    }
    if (isNaN(form.purchasePrice) || isNaN(form.quantity)) {
      toast.error('Price and quantity must be numbers');
      return false;
    }
    return true;
  };

  const handleAdd = () => {
    if (!validateForm()) return;

    const newProduct = {
      id: Date.now().toString(),
      barcode: form.barcode || `PRD-${Date.now()}`,
      productName: form.productName,
      purchasePrice: parseFloat(form.purchasePrice),
      quantity: parseInt(form.quantity),
      unitType: form.unitType,
      purchaseDate: form.purchaseDate,
      mrp: parseFloat(form.mrp) || parseFloat(form.purchasePrice) * 1.2,
      salePrice: parseFloat(form.salePrice) || parseFloat(form.purchasePrice) * 1.15,
      vendor: form.vendor,
      retailPrice: parseFloat(form.salePrice) || parseFloat(form.purchasePrice) * 1.15,
      stockQty: parseInt(form.quantity),
    };

    setProducts([...products, newProduct]);
    resetForm();
    toast.success('Product added to list');
  };

  const handleEdit = (product) => {
    setForm({
      barcode: product.barcode,
      productName: product.productName,
      purchasePrice: product.purchasePrice,
      quantity: product.quantity,
      unitType: product.unitType,
      purchaseDate: product.purchaseDate,
      mrp: product.mrp,
      salePrice: product.salePrice,
      vendor: product.vendor,
    });
    setEditId(product.id);
    setShowForm(true);
  };

  const handleUpdate = () => {
    if (!validateForm()) return;
    
    const updatedProducts = products.map(product => 
      product.id === editId ? { 
        ...product, 
        ...form,
        purchasePrice: parseFloat(form.purchasePrice),
        quantity: parseInt(form.quantity),
        mrp: parseFloat(form.mrp),
        salePrice: parseFloat(form.salePrice),
        retailPrice: parseFloat(form.salePrice),
        stockQty: parseInt(form.quantity)
      } : product
    );
    
    setProducts(updatedProducts);
    resetForm();
    setEditId(null);
    toast.success('Product updated');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/purchases/${id}`);
        setProducts(products.filter(product => product.id !== id));
        toast.success('Product deleted');
      } catch (err) {
        toast.error('Failed to delete product');
      }
    }
  };

  const resetForm = () => {
    setForm({
      barcode: '',
      productName: '',
      purchasePrice: '',
      quantity: '',
      unitType: 'PCS',
      purchaseDate: new Date().toISOString().split('T')[0],
      mrp: '',
      salePrice: '',
      vendor: '',
    });
  };

  const handleCancel = () => {
    resetForm();
    setEditId(null);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/purchases', { 
        purchases: products,
        gstDetails: enableGST ? gstDetails : null
      });
      setProducts(response.data);
      toast.success('Purchases saved successfully!');
    } catch (err) {
      toast.error('Failed to save purchases');
    } finally {
      setIsLoading(false);
    }
  };

  const totalQty = products.reduce((sum, item) => sum + Number(item.quantity), 0);
  const totalPurchase = products.reduce((sum, item) => sum + Number(item.purchasePrice), 0);
  const grandPurchase = products.reduce((sum, item) => sum + (item.purchasePrice * item.quantity), 0);

  const calculateGST = () => {
    if (!enableGST) return { total: grandPurchase, gstAmount: 0, taxableValue: grandPurchase };
    
    const taxableValue = grandPurchase / (1 + (gstDetails.gstPercentage / 100));
    const gstAmount = grandPurchase - taxableValue;
    
    return {
      total: grandPurchase,
      gstAmount: parseFloat(gstAmount.toFixed(2)),
      taxableValue: parseFloat(taxableValue.toFixed(2)),
      cgst: parseFloat((gstAmount / 2).toFixed(2)),
      sgst: parseFloat((gstAmount / 2).toFixed(2)),
      gstPercentage: gstDetails.gstPercentage
    };
  };

  const gstData = calculateGST();

  const renderPreview = () => {
    const currentDate = new Date().toLocaleString();
    
    if (previewType === 'A4') {
      return (
        <div className="a4-preview" ref={printRef}>
          <div className="a4-header">
            <h2>{shopDetails?.name || 'Your Shop Name'}</h2>
            <p>{shopDetails?.address || 'Shop Address'}</p>
            <p>Phone: {shopDetails?.phone || 'N/A'} | GST: {enableGST ? gstDetails.gstNumber : 'N/A'}</p>
          </div>
          
          <div className="a4-title">
            <h3>PURCHASE INVOICE</h3>
            <p>Date: {currentDate}</p>
          </div>
          
          <div className="vendor-details">
            <p><strong>Vendor:</strong> {products[0]?.vendor || 'N/A'}</p>
          </div>
          
          <table className="a4-items-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.productName}</td>
                  <td>₹{item.purchasePrice.toFixed(2)}</td>
                  <td>{item.quantity} {item.unitType}</td>
                  <td>₹{(item.purchasePrice * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="a4-totals">
            {enableGST && (
              <>
                <div className="gst-breakdown">
                  <p>Taxable Value: ₹{gstData.taxableValue.toFixed(2)}</p>
                  <p>GST ({gstData.gstPercentage}%): ₹{gstData.gstAmount.toFixed(2)}</p>
                  <p>CGST ({gstData.gstPercentage/2}%): ₹{gstData.cgst.toFixed(2)}</p>
                  <p>SGST ({gstData.gstPercentage/2}%): ₹{gstData.sgst.toFixed(2)}</p>
                </div>
              </>
            )}
            <div className="grand-total">
              <h4>GRAND TOTAL: ₹{gstData.total.toFixed(2)}</h4>
            </div>
          </div>
          
          <div className="a4-footer">
            <p>Thank you for your business!</p>
            <p>Generated on: {currentDate}</p>
          </div>
        </div>
      );
    } else {
      // 80mm or 58mm receipt
      return (
        <div className={`thermal-preview ${previewType}`} ref={printRef}>
          <div className="thermal-header">
            <h3>{shopDetails?.name || 'Your Shop Name'}</h3>
            <p>{shopDetails?.address || 'Shop Address'}</p>
            {enableGST && <p>GSTIN: {gstDetails.gstNumber}</p>}
          </div>
          
          <div className="thermal-title">
            <h4>PURCHASE RECEIPT</h4>
            <p>{currentDate}</p>
            <p>Vendor: {products[0]?.vendor || 'N/A'}</p>
          </div>
          
          <div className="thermal-items">
            {products.map((item, index) => (
              <div key={item.id} className="thermal-item">
                <div className="item-name">{index + 1}. {item.productName}</div>
                <div className="item-details">
                  <span>₹{item.purchasePrice.toFixed(2)} x {item.quantity}{item.unitType}</span>
                  <span>₹{(item.purchasePrice * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="thermal-totals">
            {enableGST && (
              <div className="thermal-gst">
                <p>Taxable: ₹{gstData.taxableValue.toFixed(2)}</p>
                <p>GST: ₹{gstData.gstAmount.toFixed(2)}</p>
              </div>
            )}
            <div className="thermal-grand-total">
              <p>TOTAL: ₹{gstData.total.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="thermal-footer">
            <p>Thank you!</p>
            <p>{shopDetails?.phone || ''}</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="modern-purchase-container">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="modern-header">
        <h2 className="modern-title">Purchase Management</h2>
        <div className="modern-view-toggle">
          <button 
            onClick={() => setShowForm(true)} 
            className={`modern-toggle-btn ${showForm ? 'active' : ''}`}
          >
            Add Purchase
          </button>
          <button 
            onClick={() => setShowForm(false)} 
            className={`modern-toggle-btn ${!showForm ? 'active' : ''}`}
          >
            View Purchases
          </button>
        </div>
      </div>

      {showForm ? (
        <PurchaseForm
          form={form}
          handleChange={handleChange}
          handleAdd={handleAdd}
          handleUpdate={handleUpdate}
          handleCancel={handleCancel}
          editId={editId}
          unitTypes={unitTypes}
          vendors={vendors}
        />
      ) : (
        <PurchaseTableView
          products={products}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          totalQty={totalQty}
          totalPurchase={totalPurchase}
          grandPurchase={grandPurchase}
          isLoading={isLoading}
          setShowPreview={setShowPreview}
          handleSave={handleSave}
        />
      )}

      <PurchasePreviewModal
        showPreview={showPreview}
        setShowPreview={setShowPreview}
        previewType={previewType}
        setPreviewType={setPreviewType}
        enableGST={enableGST}
        setEnableGST={setEnableGST}
        printRef={printRef}
      >
        {renderPreview()}
      </PurchasePreviewModal>
    </div>
  );
};

export default PurchaseEntry;