import React from 'react';
import { Link } from 'react-router-dom';
import GoogleAuth from './GoogleAuth'; // Ensure this component is correctly created and imported

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
        </div>
      </div>
    </>
  );
}

export default Login;
