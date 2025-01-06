import React, { useState } from 'react';
import axios from 'axios';
import ToastNotification from './ToastNotification'; // Import the ToastNotification component

function Logout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState(''); // success | error

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
        window.location.href = '/'; // Redirect to the home or login page after logout
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
      <ToastNotification message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />

      <button onClick={handleLogout} disabled={isLoading}>
        {isLoading ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  );
}

export default Logout;
