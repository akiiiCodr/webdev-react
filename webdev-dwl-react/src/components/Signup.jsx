import React, { useState } from "react";
import { Link } from "react-router-dom";

function Signup() {
  const [showModal, setShowModal] = useState(false);
  const [userRole, setUserRole] = useState("");

  // This function opens the modal when the sign up button is clicked
  const handleSignUpClick = () => {
    setShowModal(true);
  };

  // This function will set the user role and close the modal
  const handleRoleSelect = (role) => {
    setUserRole(role);
    setShowModal(false); // Close the modal after selecting the role
    console.log(`User selected role: ${role}`);
    // Proceed with the next step, like submitting the form or navigating
  };

  return (
    <div className="form-container">
      {/* Form Header */}
      <div className="form-header">
        <h2>Personal Information</h2>
        <h2>Sign Up Form</h2>
      </div>

      {/* Form Body */}
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

      {/* Sign Up Button */}
      <div className="form-footer">
        <button
          type="button"
          className="submit-button"
          onClick={handleSignUpClick}
          style={{
            display: "inline-block",
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            textAlign: "center",
            textDecoration: "none",
            borderRadius: "5px",
          }}
        >
          Create Account
        </button>
      </div>

      {/* Modal for selecting role (Student or Admin) */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Choose Your Role</h3>
            <div className="modal-buttons">
              <button
                onClick={() => handleRoleSelect("Student")}
                className="modal-button"
              >
                Student
              </button>
              <button
                onClick={() => handleRoleSelect("Admin")}
                className="modal-button"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signup;
