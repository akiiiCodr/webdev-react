import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



import { faUserGraduate, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';


function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false); // To toggle the modal visibility
  const modalRef = useRef(null); // Reference to the modal element
  const navigate = useNavigate(); // Get the navigate function

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Open the modal when the Sign Up button is clicked
  const handleSignUpClick = () => {
    setShowModal(true);
  };

  // Handle role selection and redirect to the signup page with the selected role
  const handleRoleSelect = (role) => {
    setShowModal(false); // Close the modal
    navigate(`/signup?role=${role}`);
  };

  // Close the modal if user clicks outside of it
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setShowModal(false); // Close the modal if click is outside
    }
  };

  // Add the event listener for outside clicks when the modal is open
  useEffect(() => {
    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  return (
    <div className="container-nav">
      {/* Left Side: Menu Icon */}
      <div className="menu-bar">
        <button
          className="menu-button"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          &#9776; {/* Menu icon */}
        </button>

        {/* Dropdown Content */}
        <div className={`dropdown ${isMenuOpen ? "active" : ""}`} id="dropdownMenu">
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
              <Link to="/" className="menu-item">
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
          <Link to="/">Dwell-o</Link> {/* Using Link for navigation */}
        </h1>
        <p>A Better Way to Dwell</p>
      </div>

      {/* Right Side: Actions */}
      <div className="right-header">
        <div className="header-actions">
          {/* Bed Availability as a Button */}
          <button className="availability-button">
            <i className="fa fa-user"></i>
            <div className="availability-text">2 Bed Availability</div>
          </button>

          {/* Calendar as a Button */}
          <button className="calendar-button">
            <div className="calendar-icon">&#128197;</div>
            <div className="date-text">
              <span id="current-date">
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Login & Sign Up */}
      <div className="auth-buttons">
        <button
          className="sign-up"
          onClick={handleSignUpClick} // Open the modal on click
        >
          Sign Up
        </button>
        <Link to="/login" className="login">
          Log In
        </Link>
      </div>

      {/* Modal for Role Selection */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card" ref={modalRef}>

            <h3>Select your Role</h3>
=======
            <h3>Select based on your preference</h3>

            <h3>Select your Role</h3>

            <h3>Select your Role</h3>

            <div className="modal-buttons">
              {/* Student Button with Icon */}
              <button onClick={() => handleRoleSelect("Student")} className="modal-button">
                <FontAwesomeIcon icon={faUserGraduate} size="3x" /> {/* Student Icon */}
                <span>Student</span>
              </button>

              {/* Admin Button with Icon */}
              <button onClick={() => handleRoleSelect("Admin")} className="modal-button">
                <FontAwesomeIcon icon={faChalkboardTeacher} size="3x" /> {/* Admin Icon */}
                <span>Admin</span>
                <span>Are you a Student?</span>
              </button>

              {/* Admin Button with Icon */}
              <button onClick={() => handleRoleSelect("Guest")} className="modal-button">
                <FontAwesomeIcon icon={faUserCircle} size="3x" /> {/* Admin Icon */}
                <span>Are you a Guest?</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
