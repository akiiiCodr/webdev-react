import React, { useState } from 'react';
import axios from 'axios';
import ToastNotification from './ToastNotification'; // Import the ToastNotification component
import { useNavigate } from 'react-router-dom'; // Import useNavigate to handle navigation

function Logout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState(''); // success | error
  const navigate = useNavigate(); // Hook for navigation

  const handleLogout = async () => {
    setIsLoading(true);
    setError('');
    setToastMessage(''); // Clear previous messages
    setToastType('');

    try {
      // Send a logout request to the server
      const response = await axios.post(
        'http://localhost:5001/logout',
        {},
        {
          withCredentials: true, // Ensure cookies are sent with the request
          timeout: 5000, // Set timeout to 5 seconds
        }
      );

      if (response.status === 200) {
        setToastMessage('Logged out successfully');
        setToastType('success');
        
        // Wait until toast has been shown before redirecting
        setTimeout(() => {
          navigate('/'); // Redirect to the home or login page after toast notification
        }, 3000); // Wait for 3 seconds (adjust as needed)
      } else {
        setToastMessage('Unexpected response during logout. Please try again.');
        setToastType('error');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ERR_CANCELED') {
          console.warn('Logout request was cancelled due to timeout');
          setToastMessage('Logout request timed out. Please try again.');
          setToastType('error');
        } else {
          console.error('Logout error:', error.message);
          setToastMessage('Error logging out. Please try again.');
          setToastType('error');
        }
      } else {
        console.error('Unexpected error:', error);
        setToastMessage('Error logging out. Please try again.');
        setToastType('error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Render ToastNotification only when toastMessage is not empty */}
      {toastMessage && (
        <ToastNotification
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage('')} // Clear message when the toast is closed
        />
      )}

      <button onClick={handleLogout} disabled={isLoading}>
        {isLoading ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  );
}

export default Logout;
