import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Logout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionToken, setSessionToken] = useState(null);

  useEffect(() => {
    const fetchSessionToken = async () => {
      try {
        // Fetch the session token from the server
        const response = await axios.get('http://localhost:5001/get-session-token', {
          withCredentials: true, // Ensure cookies are sent with the request
        });

        if (response.data && response.data.sessionToken) {
          setSessionToken(response.data.sessionToken);
        } else {
          console.error('No session token found');
          setError('Unable to retrieve session token. Please log in again.');
        }
      } catch (error) {
        console.error('Error fetching session token:', error.message);
        setError('Error retrieving session token. Please try again.');
      }
    };

    fetchSessionToken();
  }, []);

  const handleLogout = async () => {
    if (!sessionToken) {
      setError('Session token not found. Please log in again.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const controller = new AbortController();
      const signal = controller.signal;

      // Set a timeout for the request
      const timeoutId = setTimeout(() => {
        controller.abort();
        setError('Logout request timed out. Please try again.');
        setIsLoading(false);
      }, 5000); // Timeout set for 5 seconds

      // Make the logout request
      const response = await axios.post(
        'http://localhost:5001/logout',
        { sessionToken }, // Pass the session token for the user
        {
          withCredentials: true,
          signal,
        }
      );

      clearTimeout(timeoutId); // Clear the timeout if the request completes in time

      if (response.status === 200) {
        alert('Logged out successfully');
        window.location.href = '/'; // Redirect to the home or login page after logout
      } else {
        setError('Unexpected response during logout. Please try again.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ERR_CANCELED') {
          console.warn('Request was cancelled due to timeout');
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
      <h1>Logout Page</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleLogout} disabled={isLoading}>
        {isLoading ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  );
}

export default Logout;
