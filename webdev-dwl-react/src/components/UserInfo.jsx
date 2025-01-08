import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ToastNotification from './ToastNotification'; // Ensure this component is correctly created and imported

function UserInfo() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [toastType, setToastType] = useState(''); // Type of the toast (success, error, etc.)

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
          setToastType('success');
          setNotificationMessage('User data loaded successfully.');
          setShowNotification(true);
        } else {
          setError('Invalid user data received.');
          setToastType('error');
          setNotificationMessage('Invalid user data received.');
          setShowNotification(true);
        }
      } catch (err) {
        console.error('Error fetching user info:', err);
        if (err.response) {
          if (err.response.status === 401) {
            setError('Authentication failed. Please log in again.');
            setToastType('error');
            setNotificationMessage('Authentication failed. Please log in again.');
          } else if (err.response.status === 404) {
            setError('User not found.');
            setToastType('error');
            setNotificationMessage('User not found.');
          } else {
            setError('Error fetching user data. Please try again.');
            setToastType('error');
            setNotificationMessage('Error fetching user data. Please try again.');
          }
        } else {
          setError('An unexpected error occurred. Please check your network connection.');
          setToastType('error');
          setNotificationMessage('An unexpected error occurred. Please check your network connection.');
        }
        setShowNotification(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!user) {
    return <div style={{ textAlign: 'center' }}>No user data available</div>;
  }

  return (
    <div className="user-info">
      {showNotification && (
        <ToastNotification
          message={notificationMessage}
          type={toastType}
          onClose={handleCloseNotification}
        />
      )}
      <img
        src={user.picture || '/default-avatar.png'}
        alt={user.name || 'User Avatar'}
        className="user-image"
        style={{ width: '50px', height: '50px', borderRadius: '50%', marginBottom: '10px' }}
      />
      <h2 style={{ marginBottom: '5px' }}>{user.name || 'Anonymous User'}</h2>
      <div style={{ color: '#555' }}>{user.email || 'No email provided'}</div>
      <div style={{ color: '#555', marginTop: '10px' }}></div>
    </div>
  );
}

export default UserInfo;
