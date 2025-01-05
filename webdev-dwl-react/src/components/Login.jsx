import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import GoogleAuth from './GoogleAuth'; // Ensure this component is correctly created and imported
import UserInfo from './UserInfo'; // Ensure this component is correctly created and imported
import Logout from './Logout'; // Ensure this component is correctly created and imported
import ToastNotification from './ToastNotification'; // Ensure this component is correctly created and imported

function Login() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [toastMessage, setToastMessage] = useState(''); // State to hold toast message
  const [toastType, setToastType] = useState(''); // State to hold toast type (success, error, etc.)
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!username || !password) {
      setToastMessage('Please enter both username and password.');
      setToastType('error');
      return;
    }
  
    try {
      const response = await axios.get(`http://localhost:5001/api/login?username=${username}&password=${password}`);
  
      if (response.data.success && response.data.loggedIn) {
        const { tenant_id, username } = response.data.tenant;
  
        setLoggedIn(true);
        localStorage.setItem('tenant_id', tenant_id);
        localStorage.setItem('tenant_username', username);
  
        setToastMessage('Login successful! Redirecting...');
        setToastType('success');
  
        setTimeout(() => {
          navigate(`/tenant/${tenant_id}/${username}`);
        }, 2000); // Redirect after a short delay for the toast to be visible
      } else {
        setToastMessage(response.data.message || 'Login failed. Please try again.');
        setToastType('error');
        setLoggedIn(false);
      }
    } catch (error) {
      setToastMessage('An error occurred during login. Please try again.');
      setToastType('error');
      setLoggedIn(false);
      console.error('Login error:', error);
    }
  };
  
  // Function to handle redirection based on user's choice
  const handleRedirect = (choice) => {
    if (choice === 'dashboard') {
      navigate(`/tenant/${username}`);
    } else {
      navigate('/');
    }
    setShowModal(false);
  };

  return (
    <>
      <div className="login-section">
        <div className="login-box">
          <h1>Dwell-o</h1>
          <p>A Better Way to Dwell</p>

          {!isAuthenticated ? (
            <>
              <form method="POST" onSubmit={handleLogin}>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Enter at least 8+ characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Link to="/forgot-password" className="forgot-password">
                  Forgot password?
                </Link>

                <button
                  type="submit"
                  className="login-button"
                  style={{
                    display: 'inline-block',
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    textAlign: 'center',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  Log In
                </button>
              </form>

              <GoogleAuth />

              <p className="signup-text">
                Don't have an account?{' '}
                <Link to="/signup" className="menu-item">Sign Up</Link>
              </p>
            </>
          ) : (
            <>
              <UserInfo />
              <Logout onLogout={() => setIsAuthenticated(false)} />
            </>
          )}

          {/* ToastNotification component to show messages */}
          {toastMessage && (
            <ToastNotification
              message={toastMessage}
              type={toastType}
              onClose={() => setToastMessage('')} // Reset message on close
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Login;
