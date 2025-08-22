import { FaHome, FaSyncAlt, FaEnvelope, FaExclamationTriangle } from 'react-icons/fa';

const PlanExpiredPage = () => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  };

  const cardStyle = {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    maxWidth: '900px',
    width: '100%',
    transition: 'transform 0.3s ease',
    ':hover': {
      transform: 'translateY(-5px)',
    },
  };

  const headingStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#2c3e50',
    position: 'relative',
    paddingBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  };

  const textStyle = {
    fontSize: '16px',
    marginBottom: '30px',
    color: '#7f8c8d',
    lineHeight: '1.6',
  };

  const buttonStyle = {
    padding: '12px 25px',
    margin: '10px',
    fontSize: '16px',
    borderRadius: '50px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '180px',
    gap: '8px',
  };

  const renewButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#2ecc71',
    color: '#fff',
    boxShadow: '0 4px 15px rgba(46, 204, 113, 0.4)',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(46, 204, 113, 0.6)',
    },
  };

  const contactButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#3498db',
    color: '#fff',
    boxShadow: '0 4px 15px rgba(52, 152, 219, 0.4)',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(52, 152, 219, 0.6)',
    },
  };

  const homeButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#9b59b6',
    color: '#fff',
    boxShadow: '0 4px 15px rgba(155, 89, 182, 0.4)',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(155, 89, 182, 0.6)',
    },
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headingStyle}>
          <FaExclamationTriangle color="#e74c3c" size={28} />
          Your Plan Has Expired
        </div>
        <div style={textStyle}>
          We noticed your subscription has ended. Renew now to continue enjoying all our premium 
          features without interruption. Our support team is also available to assist you with 
          any questions.
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            style={renewButtonStyle}
            onClick={() => {
              window.location.href = '/pricing';
            }}
          >
            <FaSyncAlt /> Renew Subscription
          </button>
          <button
            style={contactButtonStyle}
            onClick={() => {
              window.location.href = '/contact';
            }}
          >
            <FaEnvelope /> Contact Support
          </button>
          <button
            style={homeButtonStyle}
            onClick={() => {
              window.location.href = '/';
            }}
          >
            <FaHome /> Return Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanExpiredPage;