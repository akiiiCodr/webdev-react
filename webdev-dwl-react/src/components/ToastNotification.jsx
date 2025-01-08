import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'; // Import the icons

function ToastNotification({ message, onClose, type, index }) {
  useEffect(() => {
    // Automatically close the notification after 5 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  // Define different styles for success, error, and warning
  const getToastStyle = () => {
    switch (type) {
      case 'success':
        return { backgroundColor: '#fff', color: '#000' }; // Green for success
      case 'error':
        return { backgroundColor: '#fff', color: '#000' }; // Red for error
      case 'warning':
        return { backgroundColor: '#fff', color: '#000' }; // Orange for warning
      default:
        return { color: 'white' }; // Fallback to white text
    }
  };

  // Get the appropriate icon for each type of toast
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FontAwesomeIcon icon={faCheck} />; // Success icon
      case 'error':
        return <FontAwesomeIcon icon={faTimes} />; // Error icon
      case 'warning':
        return <FontAwesomeIcon icon={faExclamationTriangle} />; // Warning icon
      default:
        return <FontAwesomeIcon icon={faGoogle} />; // Default info icon
    }
  };

  return (
    <div
      className={`toast ${type}`} // Dynamically add class based on toast type
      style={{
        ...getToastStyle(),
        position: 'fixed',
        bottom: '30px', // Fixed position at the bottom of the screen
        right: '30px',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        alignItems: 'center',
        zIndex: 9999 + index, // Ensure proper stacking order
        width: 'auto', // Allow for flexible width depending on content
        maxWidth: '300px', // Set a max width for the toast
      }}
    >
      <div
        style={{
          marginRight: '15px',
          fontSize: '30px', // Adjusted size for the icon
          color: 'white',
          backgroundColor:
            type === 'error' ? '#f44336' : type === 'warning' ? '#FF9800' : '#4CAF50',
          padding: '15px', // Adjust padding to ensure the icon fits nicely
          height: '50px', // Set height for the circle
          width: '50px', // Set width for the circle
          borderRadius: '50%', // Make the icon circular
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {getIcon()}
      </div>
      <p style={{ margin: 0, fontSize: '16px', color: 'inherit' }}>{message}</p>

      {/* Close button */}
      <button
        onClick={onClose}
        className="toast-close-button"
        style={{
          background: 'transparent',
          border: 'none',
          fontSize: '20px',
          color: 'white',
          cursor: 'pointer',
          marginLeft: '10px',
        }}
      >
        ×
      </button>

      {/* Progress bar animation */}
      <div
        className="toast-progress-bar"
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          height: '5px',
          backgroundColor:
            type === 'error' ? '#f44336' : type === 'warning' ? '#FF9800' : '#4CAF50',
          animation: 'anim 5s linear forwards',
        }}
      ></div>

      {/* Styles for the toast progress bar animation */}
      <style>{`
        @keyframes moveleft {
          100% {
            transform: translateX(0);
          }
        }

        @keyframes anim {
          100% {
            width: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default ToastNotification;