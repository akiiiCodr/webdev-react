import React from 'react';
import Header from './Header'; // Import Header component
import Footer from './Footer'; // Import Footer component

import { Link } from 'react-router-dom'; // Import Link from react-router-dom

function Login() {
  return (
    <>


      {/* Login Section */}
      <div className="login-section">
        <div className="login-box">
          <h1>Dwell-o</h1>
          <p>A Better Way to Dwell</p>

          {/* Login Form */}
          <form method="POST">
            <input type="text" placeholder="Username" required />
            <input
              type="password"
              placeholder="Enter at least 8+ characters"
              required
            />
            <Link to="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>

            <Link
              to="/user-screen" // Update the link to a valid route in your app
              className="login-button"
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                textAlign: 'center',
                textDecoration: 'none',
                borderRadius: '5px',
              }}
            >
              Log In
            </Link>
          </form>

          {/* Sign Up Link */}
          <p className="signup-text">
            Don't have an account?{' '}
            <Link to="/signup" className="menu-item">Sign Up</Link>
          </p>
        </div>
      </div>

    </>
  );
}

export default Login;
