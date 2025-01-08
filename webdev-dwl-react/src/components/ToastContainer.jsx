import React, { useState } from 'react';
import ToastNotification from './ToastNotification'; // Import ToastNotification component

function ToastContainer() {
  const [toasts, setToasts] = useState([]); // Array to store multiple toasts

  // Function to show a new toast
  const showToast = (message, type) => {
    const newToast = {
      id: Date.now(), // Unique id for each toast
      message,
      type,
    };

    // Add the new toast to the list
    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Log the new state to ensure it's updating
    console.log("Toast added:", newToast);
    console.log("Current toasts:", [...toasts, newToast]);
  };

  // Function to close a toast by its id
  const closeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    console.log("Toast removed:", id);
  };

  return (
    <div>
      <button onClick={() => showToast('Success! Your action was successful.', 'success')}>Show Success Toast</button>
      <button onClick={() => showToast('Error! Something went wrong.', 'error')}>Show Error Toast</button>
      <button onClick={() => showToast('Warning! Please check your input.', 'warning')}>Show Warning Toast</button>

      {/* Render toasts with unique index */}
      {toasts.map((toast, index) => (
        <ToastNotification
          key={toast.id} // Unique key for each toast
          message={toast.message}
          type={toast.type}
          index={index} // Pass index to handle stacking
          onClose={() => closeToast(toast.id)} // Close toast by id
        />
      ))}
    </div>
  );
}

export default ToastContainer;
