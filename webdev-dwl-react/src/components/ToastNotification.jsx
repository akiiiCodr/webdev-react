import React, { useEffect } from 'react';


function ToastNotification({ message, onClose }) {
  useEffect(() => {
    // Automatically close the notification after 3 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast-notification">
      <p>{message}</p>
      <button onClick={onClose} className="toast-close-button">×</button>
    </div>
  );
}

export default ToastNotification;
