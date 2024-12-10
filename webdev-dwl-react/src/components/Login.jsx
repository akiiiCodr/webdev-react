import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GoogleAuth from './GoogleAuth'; // Ensure this component is correctly created and imported
import UserInfo from './UserInfo'; // Ensure this component is correctly created and imported
import Logout from './Logout'; // Ensure this component is correctly created and imported

function Login() {
  // Simulated authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to simulate user login
  const handleLogin = (e) => {
    e.preventDefault();
    // Add logic to check authentication here (e.g., API call)
    setIsAuthenticated(true); // Set to true if authentication is successful
  };

  return (
    <>
      {/* Login Section */}
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
                  required
                />
                <input
                  type="password"
                  placeholder="Enter at least 8+ characters"
                  required
                />
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
