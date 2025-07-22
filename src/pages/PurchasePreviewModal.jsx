// components/PurchasePreviewModal.js


const PurchasePreviewModal = ({ 
  showPreview, 
  setShowPreview, 
  previewType, 
  setPreviewType,
  enableGST,
  setEnableGST,
  printRef,
  children
}) => {
  return (
    <div className={`modal ${showPreview ? 'show' : ''}`}>
      <div className="modal-overlay" onClick={() => setShowPreview(false)}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Purchase Invoice Preview</h3>
          <button className="close-btn" onClick={() => setShowPreview(false)}>×</button>
        </div>
        <div className="modal-body">
          <div className="preview-options">
            <div className="btn-group">
              <button 
                className={`btn ${previewType === 'A4' ? 'active' : ''}`}
                onClick={() => setPreviewType('A4')}
              >
                A4
              </button>
              <button 
                className={`btn ${previewType === '80MM' ? 'active' : ''}`}
                onClick={() => setPreviewType('80MM')}
              >
                80MM
              </button>
              <button 
                className={`btn ${previewType === '58MM' ? 'active' : ''}`}
                onClick={() => setPreviewType('58MM')}
              >
                58MM
              </button>
            </div>
            
            <div className="gst-toggle">
              <label>
                <input 
                  type="checkbox" 
                  checked={enableGST} 
                  onChange={(e) => setEnableGST(e.target.checked)} 
                />
                Include GST
              </label>
            </div>
          </div>
          
          <div className="preview-content">
            {children}
          </div>
        </div>
        <div className="modal-footer">
           <button className="btn primary">Print</button>
          <button className="btn secondary" onClick={() => setShowPreview(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchasePreviewModal;