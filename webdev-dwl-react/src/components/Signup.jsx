import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import Header from './Header'; // Import Header component
import Footer from './Footer'; // Import Footer component

function Signup() {
  return (
    <>


      {/* Form Container */}
      <div className="form-container">
        <div className="form-header">
          <h2>Personal Information</h2>
          <h2>Sign Up Form</h2>
        </div>

        <div className="form-body">
          <div className="left-form">
            <div className="input-group">
              <span className="icon">👤</span>
              <input type="text" placeholder="First Name" required />
            </div>
            <div className="input-group">
              <span className="icon">👤</span>
              <input type="text" placeholder="Last Name" required />
            </div>
            <div className="input-group">
              <span className="icon">✉️</span>
              <input type="email" placeholder="Email Address" required />
            </div>
            <div className="input-group">
              <span className="icon">📞</span>
              <input type="tel" placeholder="Contact Number" required />
            </div>
          </div>

          <div className="right-form">
            <div className="input-group">
              <span className="icon">👥</span>
              <input type="text" placeholder="Create Username" required />
            </div>
            <div className="input-group password-group">
              <span className="icon">🔒</span>
              <input
                type="password"
                placeholder="Enter at least 8+ characters"
                required
              />
              <button
                type="button"
                className="toggle-password"
                aria-label="Toggle password visibility"
              >
                👁️
              </button>
            </div>
          </div>
        </div>

        <div className="form-footer">
          <Link
            to="/login" // Use React Router Link for navigation
            className="submit-button"
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              textAlign: 'center',
              textDecoration: 'none',
              borderRadius: '5px',
            }}
          >
            Create Account
          </Link>
        </div>
      </div>

    </>
  );
}

export default Signup;
