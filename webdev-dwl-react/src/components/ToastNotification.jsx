import React, { useEffect } from 'react';

function ToastNotification({ message, onClose, type }) {
  useEffect(() => {
    // Automatically close the notification after 1.5 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onClose]);

  // Define different styles for success, error, and warning
  const getToastStyle = () => {
    switch (type) {
      case 'success':
        return { backgroundColor: '#4CAF50', color: 'white' }; // Green for success
      case 'error':
        return { backgroundColor: '#f44336', color: 'white' }; // Red for error
      case 'warning':
        return { backgroundColor: '#FF9800', color: 'white' }; // Orange for warning
      default:
        return {};
    }
  };

  return (
    <div className="toast-notification" style={getToastStyle()}>
      <p>{message}</p>
      <button onClick={onClose} className="toast-close-button">×</button>
    </div>
  );
}

export default ToastNotification;
