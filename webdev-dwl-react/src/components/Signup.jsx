import React, { useState } from "react";
import { Link } from "react-router-dom";

function Signup() {
  const [showModal, setShowModal] = useState(false);
  const [userRole, setUserRole] = useState("");

  const handleSignUpClick = () => {
    setShowModal(true);
  };

  const handleRoleSelect = (role) => {
    setUserRole(role);
    setShowModal(false);
    console.log(`User selected role: ${role}`);
  };

  return (
    <div style={styles.container}>
      {/* Form Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Sign Up</h1>
        <p style={styles.subtitle}>Create your account to get started!</p>
      </div>

      {/* Form Body */}
      <div style={styles.body}>
        <div style={styles.column}>
          <div style={styles.inputGroup}>
            <span style={styles.icon}>👤</span>
            <input
              type="text"
              placeholder="First Name"
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <span style={styles.icon}>👤</span>
            <input
              type="text"
              placeholder="Last Name"
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <span style={styles.icon}>✉️</span>
            <input
              type="email"
              placeholder="Email Address"
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <span style={styles.icon}>📞</span>
            <input
              type="tel"
              placeholder="Contact Number"
              style={styles.input}
              required
            />
          </div>
        </div>

        <div style={styles.column}>
          <div style={styles.inputGroup}>
            <span style={styles.icon}>👥</span>
            <input
              type="text"
              placeholder="Create Username"
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <span style={styles.icon}>🔒</span>
            <input
              type="password"
              placeholder="Enter at least 8+ characters"
              style={styles.input}
              required
            />
          </div>
        </div>
      </div>

      {/* Sign Up Button */}
      <div style={styles.footer}>
        <button
          onClick={handleSignUpClick}
          style={styles.submitButton}
        >
          Create Account
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Choose Your Role</h3>
            <div style={styles.modalButtons}>
              <button
                onClick={() => handleRoleSelect("Student")}
                style={{ ...styles.modalButton, backgroundColor: "#007bff" }}
              >
                Student
              </button>
              <button
                onClick={() => handleRoleSelect("Admin")}
                style={{ ...styles.modalButton, backgroundColor: "#28a745" }}
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

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f9f9f9",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "24px",
    color: "#333",
  },
  subtitle: {
    fontSize: "16px",
    color: "#666",
  },
  body: {
    display: "flex",
    justifyContent: "space-between",
  },
  column: {
    flex: "1",
    margin: "0 10px",
  },
  inputGroup: {
    marginBottom: "15px",
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  icon: {
    position: "absolute",
    left: "10px",
    fontSize: "18px",
    color: "#666",
  },
  input: {
    width: "100%",
    padding: "10px 10px 10px 35px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "14px",
  },
  footer: {
    textAlign: "center",
    marginTop: "20px",
  },
  submitButton: {
    padding: "12px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  submitButtonHover: {
    backgroundColor: "#0056b3",
  },
  modalOverlay: {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  modalTitle: {
    fontSize: "20px",
    marginBottom: "15px",
    color: "#333",
  },
  modalButtons: {
    display: "flex",
    justifyContent: "space-around",
  },
  modalButton: {
    padding: "10px 20px",
    fontSize: "16px",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default Signup;
