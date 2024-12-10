import React, { useState } from 'react';
import axios from 'axios';

function Logout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = async () => {
    setIsLoading(true);
    setError('');

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
        alert('Logged out successfully');
        window.location.href = '/'; // Redirect to the home or login page after logout
      } else {
        setError('Unexpected response during logout. Please try again.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ERR_CANCELED') {
          console.warn('Logout request was cancelled due to timeout');
          setError('Logout request timed out. Please try again.');
        } else {
          console.error('Logout error:', error.message);
          setError('Error logging out. Please try again.');
        }
      } else {
        console.error('Unexpected error:', error);
        setError('Error logging out. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleLogout} disabled={isLoading}>
        {isLoading ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  );
}

export default Logout;
