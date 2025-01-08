import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'; // Import the icons

function ToastNotification({ message, onClose, type, index }) {
  useEffect(() => {
    // Automatically close the notification after 3 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  // Define different styles for success, error, and warning
  const getToastStyle = () => {
    switch (type) {
      case 'success':
        return { backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#000' }; // Green for success
      case 'error':
        return { backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#000' }; // Red for error
      case 'warning':
        return { backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#000' }; // Orange for warning
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
        return <FontAwesomeIcon icon={faCheck} />; // Default info icon
    }
  };

  // Set the appropriate glow color for each type
  const getGlowColor = () => {
    switch (type) {
      case 'success':
        return 'rgba(76, 175, 80, 1)'; // Green for success
      case 'error':
        return 'rgba(244, 67, 54, 1)'; // Red for error
      case 'warning':
        return 'rgba(255, 152, 0, 1)'; // Orange for warning
      default:
        return 'rgba(255, 255, 255, 1)'; // Default glow color
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
        borderRadius: '15px', // More rounded edges for glassmorphism
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        zIndex: 9999 + index, // Ensure proper stacking order
        width: 'auto', // Allow for flexible width depending on content
        maxWidth: '300px', // Set a max width for the toast
        backdropFilter: 'blur(10px)', // Glassmorphic background blur
        WebkitBackdropFilter: 'blur(10px)', // For Safari support
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent background
        border: '1px solid rgba(255, 255, 255, 0.3)', // Light border for the glass effect
        overflow: 'hidden', // Prevent the progress bar from overflowing the card
        animation: 'glow-animation 1.5s infinite alternate', // Apply glow animation
        '--glow-color': getGlowColor(), // Dynamically set CSS custom property
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
          backgroundColor: 'var(--glow-color)', // Use the custom property
          animation: 'anim 3s linear forwards', // Adjusted duration to match the close time
          borderRadius: '0 0 15px 15px', // Ensure the progress bar corners match the card's bottom corners
        }}
      ></div>

      {/* Styles for the toast progress bar animation and glow */}
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

        @keyframes glow-animation {
          0% {
            box-shadow: 0 0 10px var(--glow-color), 0 0 20px var(--glow-color), 0 0 30px var(--glow-color);
          }
          100% {
            box-shadow: 0 0 15px var(--glow-color), 0 0 25px var(--glow-color), 0 0 35px var(--glow-color);
          }
        }
      `}</style>
    </div>
  );
}

export default ToastNotification;
