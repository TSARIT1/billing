import "./PriceComponent.css";
import { Link } from "react-router-dom";
import Razorpay from "razorpay";
import { useState,useEffect } from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const PriceComponent = () => {
  const [email, setEmail] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const pricingPlans = [
  {
    id: "plan_3m",
    originalPrice: 3000, // 1000 * 3
    discount: "50%",
    monthlyEquivalent: 500,
    duration: "3 months",
    total: 1500,
    savings: "Save ₹1,500",
    highlight: false,
  },
  {
    id: "plan_6m",
    originalPrice: 6000, // 1000 * 6
    discount: "50%",
    monthlyEquivalent: 500,
    duration: "6 months",
    total: 3000,
    savings: "Save ₹3,000",
    highlight: true,
    highlightText: "Best Value",
  },
  {
    id: "plan_1y",
    originalPrice: 12000, // 1000 * 12
    discount: "50%",
    monthlyEquivalent: 500,
    duration: "1 year",
    total: 6000,
    savings: "Save ₹6,000",
    highlight: false,
  },
  {
    id: "plan_2y",
    originalPrice: 24000, // 1000 * 24
    discount: "50%",
    monthlyEquivalent: 500,
    duration: "2 years",
    total: 12000,
    savings: "Save ₹12,000",
    highlight: false,
  }
];






const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("Razorpay script failed to load");
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

  const handlePayment = async (plan) => {
    if (plan.isContact) {
      window.location.href = "/contact";
      return;
    }

    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };


const initiateRazorpayPayment = async () => {
  if (!email) {
    toast.error("Please enter your email");
    return;
  }

  const res = await loadRazorpayScript();
  if (!res) {
    toast.error("Razorpay SDK failed to load. Are you online?");
    return;
  }

  const options = {
    key: "rzp_live_nLA9QGo9irYCMN",
    amount: selectedPlan.total * 100,
    currency: "INR",
  
    name: "Your Company",
    description: `Test Payment - ${selectedPlan.duration} Plan`,
    image: "https://example.com/logo.png", 
    handler: function (response) {
      toast.success("Test payment successful!");
     
    },
    prefill: {
      email: email,
      name: "Test User",
      contact: "9876543210"
    },
    notes: {
      mode: "test",
      plan: selectedPlan.id
    },
    theme: {
      color: "#3399cc"
    }
  };

  try {
    const paymentObject = new window.Razorpay(options);
    
    paymentObject.on("payment.failed", function (response) {
      toast.error(`Test payment failed: ${response.error.description}`);
      console.error("Test payment failed:", response);
    });

    paymentObject.open();
    setShowPaymentModal(false);
  } catch (error) {
    toast.error("Failed to initialize payment");
    console.error("Payment initialization error:", error);
  }
};


useEffect(() => {
  if (window.HTMLCanvasElement) {
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, attributes) {
      if (!this) return null; // Prevent calling on null
      if (type === "2d") {
        attributes = attributes || {};
        attributes.willReadFrequently = true;
      }
      return originalGetContext.call(this, type, attributes);
    };
  }
}, []);



  return (
   <>
    <div className="price-container">
      <motion.h2 
        className="price-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Choose Your Plan
      </motion.h2>
      
      <div className="price-grid">
        {pricingPlans.map((plan, index) => (
          <motion.div
            key={index}
            className={`price-card ${plan.highlight ? "highlighted" : ""}`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            {plan.highlight && (
              <div className="price-badge">{plan.highlightText}</div>
            )}
            <div className="price-header">
              <span className="price-original">₹{plan.originalPrice}/month</span>
              <span className="price-discount">{plan.discount} OFF</span>
            </div>
            <div className="price-main">
              <span className="price-amount">
                {plan.isContact ? (
                  "Contact Us"
                ) : (
                  <>
                    ₹{plan.total.toLocaleString()}
                    <span className="price-slash"> total</span>
                  </>
                )}
              </span>
              <span className="price-duration">{plan.duration}</span>
              {plan.savings && (
                <div className="price-savings">{plan.savings}</div>
              )}
              <div className="price-equivalent">
                {!plan.isContact && `(₹${plan.monthlyEquivalent}/month)`}
              </div>
            </div>
            {plan.isContact ? (
              <Link to="/contact">
                <button className="price-button contact-button">
                  Contact Us
                </button>
              </Link>
            ) : (
              <button
                className="price-button"
                onClick={() => handlePayment(plan)}
              >
                Get Started
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <motion.div
          className="payment-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="payment-modal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <h3>Complete Your Purchase</h3>
            <p>
              You're subscribing to the <strong>{selectedPlan.duration}</strong>{" "}
              plan for ₹{selectedPlan.total.toLocaleString()}
            </p>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="modal-buttons">
              <button
                className="cancel-button"
                onClick={() => setShowPaymentModal(false)}
              >
                Cancel
              </button>
              <button
                className="pay-now-button"
                onClick={initiateRazorpayPayment}
              >
                Pay Now
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  

    <div className="price-container" style={{border:'1px solid #ccc',width:'320px',borderRadius:'10px',boxShadow:'1px 3px 9px #ccc'}}>
      
      
      <div className="price-grid" style={{width:'250px'}}>
        
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
           
            <div className="price-header">
              {/* <span className="price-custom">Custom</span> */}
              
            </div>
            <div className="price-main">
              <span className="price-amount">
               
                  Customize
                
              </span>
              <span className="price-duration">Based On Your Custom features we will develop...!</span>
            

            </div>
            
              <Link to="/contact">
                <button className="price-button contact-button">
                  Contact Us
                </button>
              </Link>
           
             
          </motion.div>
       
      </div>

      
    </div>
   </>
  );
};

export default PriceComponent;