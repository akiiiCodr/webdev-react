import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserGraduate,
  faChalkboardTeacher,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios"; // Import axios for HTTP requests
import UserInfo from "./UserInfo";
import Logout from "./Logout";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Add this state
  const modalRef = useRef(null);
  const navigate = useNavigate();

  // Toggle the navigation menu
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  // Open the sign-up modal
  const handleSignUpClick = () => setShowModal(true);

  // Handle role selection and redirect
  const handleRoleSelect = (role) => {
    setShowModal(false);
    navigate(`/signup?role=${role}`);
  };

  // Close the modal if clicked outside
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setShowModal(false);
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/current-user", {
          withCredentials: true,
        });
        console.log("Response from /api/current-user:", response);
        setIsAuthenticated(response.data?.user);
      } catch (error) {
        console.error(
          "Error checking authentication status:",
          error.response || error.message
        );
        setIsAuthenticated(false);
      }
    };
  
    checkAuthentication();
  
    // Attach and clean up event listener for outside clicks
    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showModal]);

  return (
    <div className="container-nav">
      {/* Left Side: Navigation Menu */}
      <div className="menu-bar">
        <button
          className="menu-button"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          &#9776;
        </button>
        <div className={`dropdown ${isMenuOpen ? "active" : ""}`}>
          <ul>
            <li>
              <Link to="/" className="menu-item">
                Home
              </Link>
            </li>
            <li>
              <Link to="/book-a-room" className="menu-item">
                Book a Room
              </Link>
            </li>
            <li>
              <Link to="/manage" className="menu-item">
                Manage
              </Link>
            </li>
            <li>
              <Link to="/contact-us" className="menu-item">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Center: Title and Subtitle */}
      <div className="title-section">
        <h1>
          <Link to="/">Dwell-o</Link>
        </h1>
        <p>A Better Way to Dwell</p>
      </div>

      {/* Right Side: Actions */}
      <div className="right-header">
        <div className="header-actions">
          {/* Bed Availability Button */}
          <button className="availability-button">
            <i className="fa fa-user"></i>
            <div className="availability-text">2 Bed Availability</div>
          </button>

          {/* Calendar Button */}
          <button className="calendar-button">
            <div className="calendar-icon">&#128197;</div>
            <div className="date-text">
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </button>
        </div>

        {/* Show UserInfo and Logout if authenticated and active */}
        {isAuthenticated ? (
          <div className="auth-logged-in">
            <UserInfo />
            <Logout />
          </div>
        ) : (
          // Show Login & Sign Up buttons if not authenticated or inactive
          <div className="auth-buttons">
            <button className="sign-up" onClick={handleSignUpClick}>
              Sign Up
            </button>
            <Link to="/login" className="login">
              Log In
            </Link>
          </div>
        )}
      </div>

      {/* Modal for Role Selection */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card" ref={modalRef}>
            <h3>Select your role</h3>
            <div className="modal-buttons">
              <button
                onClick={() => handleRoleSelect("Student")}
                className="modal-button"
              >
                <FontAwesomeIcon icon={faUserGraduate} size="3x" />
                <span>Student</span>
              </button>
              <button
                onClick={() => handleRoleSelect("Admin")}
                className="modal-button"
              >
                <FontAwesomeIcon icon={faChalkboardTeacher} size="3x" />
                <span>Admin</span>
              </button>
              <button
                onClick={() => handleRoleSelect("Guest")}
                className="modal-button"
              >
                <FontAwesomeIcon icon={faUserCircle} size="3x" />
                <span>Guest</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
