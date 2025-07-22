// components/PurchaseForm.js
import React from 'react';

const PurchaseForm = ({ 
  form, 
  handleChange, 
  handleAdd, 
  handleUpdate, 
  handleCancel, 
  editId, 
  unitTypes,
  vendors 
}) => {
  return (
    <div className="modern-form-container">
      <div className="modern-form-grid">
        <div className="modern-form-group">
          <label>Barcode</label>
          <input 
            name="barcode" 
            value={form.barcode} 
            onChange={handleChange} 
            placeholder="BarCode/Code" 
          />
        </div>

        <div className="modern-form-group">
          <label>Product Name*</label>
          <input 
            name="productName" 
            value={form.productName} 
            onChange={handleChange} 
            placeholder="Product Name" 
            required
          />
        </div>

        <div className="modern-form-group">
          <label>Purchase Price*</label>
          <input 
            name="purchasePrice" 
            value={form.purchasePrice} 
            onChange={handleChange} 
            type="number" 
            placeholder="Purchase Price" 
            required
          />
        </div>

        <div className="modern-form-group">
          <label>Quantity*</label>
          <input 
            name="quantity" 
            value={form.quantity} 
            onChange={handleChange} 
            type="number" 
            placeholder="Purchase Qty" 
            required
          />
        </div>

        <div className="modern-form-group">
          <label>Unit Type</label>
          <select name="unitType" value={form.unitType} onChange={handleChange}>
            {unitTypes.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>

        <div className="modern-form-group">
          <label>Purchase Date</label>
          <input 
            name="purchaseDate" 
            value={form.purchaseDate} 
            onChange={handleChange} 
            type="date" 
          />
        </div>

        <div className="modern-form-group">
          <label>MRP</label>
          <input 
            name="mrp" 
            value={form.mrp} 
            onChange={handleChange} 
            type="number" 
            placeholder="MRP" 
          />
        </div>

        <div className="modern-form-group">
          <label>Sale Price</label>
          <input 
            name="salePrice" 
            value={form.salePrice} 
            onChange={handleChange} 
            type="number" 
            placeholder="Sale Price" 
          />
        </div>

        <div className="modern-form-group">
          <label>Vendor</label>
          <select name="vendor" value={form.vendor} onChange={handleChange}>
            <option value="">Select Vendor</option>
            {vendors.map(vendor => (
              <option key={vendor.id} value={vendor.name}>{vendor.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="modern-form-actions">
        {editId ? (
          <>
            <button onClick={handleUpdate} className="modern-btn update">
              Update Product
            </button>
            <button onClick={handleCancel} className="modern-btn cancel">
              Cancel
            </button>
          </>
        ) : (
          <button onClick={handleAdd} className="modern-btn add">
            Add to List
          </button>
        )}
      </div>
    </div>
  );
};

export default PurchaseForm;