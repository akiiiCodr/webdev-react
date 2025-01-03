import React, { useState } from 'react';
import ToastNotification from './ToastNotification'; // Import ToastNotification component
import { ToastContainer } from 'react-toastify';

function ToastContainer() {
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Function to show success toast
  const handleSuccessToast = () => {
    setToastMessage('Success! Your action was successful.');
    setToastType('success');
    setShowToast(true);
  };

  // Function to show error toast
  const handleErrorToast = () => {
    setToastMessage('Error! Something went wrong.');
    setToastType('error');
    setShowToast(true);
  };

  // Function to show warning toast
  const handleWarningToast = () => {
    setToastMessage('Warning! Please check your input.');
    setToastType('warning');
    setShowToast(true);
  };

  // Function to close the toast
  const closeToast = () => {
    setShowToast(false);
  };

  return (
    <div>
      <button onClick={handleSuccessToast}>Show Success Toast</button>
      <button onClick={handleErrorToast}>Show Error Toast</button>
      <button onClick={handleWarningToast}>Show Warning Toast</button>

      {/* Conditionally render the ToastNotification only when showToast is true */}
      {showToast && (
        <ToastNotification
          message={toastMessage}
          type={toastType}
          onClose={closeToast} // Close the toast after the timeout or when clicked
        />
      )}
    </div>
  );
}

export default ToastContainer;
