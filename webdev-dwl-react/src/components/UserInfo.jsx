import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserInfo() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/current-user', {
          withCredentials: true, // Ensure cookies are sent if needed
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Log the response for debugging
        console.log('API Response:', response.data);

        if (response.data && response.data.user) {
          setUser(response.data.user);
        } else {
          setError('Invalid user data received.');
        }
      } catch (err) {
        console.error('Error fetching user info:', err);
        if (err.response) {
          if (err.response.status === 401) {
            setError('Authentication failed. Please log in again.');
          } else if (err.response.status === 404) {
            setError('User not found.');
          } else {
            setError('Error fetching user data. Please try again.');
          }
        } else {
          setError('An unexpected error occurred. Please check your network connection.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;
  }

  if (!user) {
    return <div style={{ textAlign: 'center' }}>No user data available</div>;
  }

  return (
    <div className="user-info">
      <img
        src={user.picture || '/default-avatar.png'}
        alt={user.name || 'User Avatar'}
        className="user-image"
        style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '10px' }}
      />
      <h2 style={{ marginBottom: '5px' }}>{user.name || 'Anonymous User'}</h2>
      <div style={{ color: '#555' }}>{user.email || 'No email provided'}</div>
      <div style={{ color: '#555', marginTop: '10px' }}>
        <strong>Google ID:</strong> {user.googleId || 'No Google ID available'}
      </div>
    </div>
  );
}

export default UserInfo;
