import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import GoogleAuth from './GoogleAuth'; // Ensure this component is correctly created and imported
import UserInfo from './UserInfo'; // Ensure this component is correctly created and imported
import Logout from './Logout'; // Ensure this component is correctly created and imported

function Login() {
  // Simulated authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false); // State to track login status
  const [error, setError] = useState(''); // State to handle errors
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }
  
    try {
      // Call the API to authenticate and set tenant as active
      const response = await axios.get(`http://localhost:5001/api/login?username=${username}&password=${password}`);
  
      if (response.data.success && response.data.loggedIn) {
        const { tenant_id, username } = response.data.tenant;
  
        // Set the login state to true
        setLoggedIn(true);
  
        // Optionally store the tenant details in local storage or context
        localStorage.setItem('tenant_id', tenant_id);
        localStorage.setItem('tenant_username', username);
  
        // Redirect to the tenant dashboard
        navigate(`/tenant/${tenant_id}/${username}`);
      } else {
        setError(response.data.message || "Login failed. Please try again.");
        setLoggedIn(false); // Set loggedIn to false on failure
      }
    } catch (error) {
      setError("An error occurred during login. Please try again.");
      setLoggedIn(false); // Set loggedIn to false on error
      console.error("Login error:", error);
    }
  };
  
  
  // Function to handle redirection based on user's choice
  const handleRedirect = (choice) => {
    if (choice === 'dashboard') {
      navigate(`/tenant/${username}`); // Redirect to tenant dashboard using username
    } else {
      navigate('/'); // Redirect to main website
    }
    setShowModal(false); // Close modal after redirection
  };

  return (
    <>
      <div className="login-section">
        <div className="login-box">
          <h1>Dwell-o</h1>
          <p>A Better Way to Dwell</p>

          {!isAuthenticated ? (
            <>
              {/* Login Form */}
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
                {/* {loginError && <p style={{ color: 'red' }}>{loginError}</p>} */}
                <Link to="/forgot-password" className="forgot-password">
                  Forgot password?
                </Link>

                {/* Styled login button */}
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

              {/* Google Auth Button */}
              <GoogleAuth />

              {/* Sign Up Link */}
              <p className="signup-text">
                Don't have an account?{' '}
                <Link to="/signup" className="menu-item">Sign Up</Link>
              </p>
            </>
          ) : (
            <>
              {/* User Info and Logout Components */}
              <UserInfo />
              <Logout onLogout={() => setIsAuthenticated(false)} />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Login;
