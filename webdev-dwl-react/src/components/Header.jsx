import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for HTTP requests
import UserInfo from "./UserInfo";
import Logout from "./Logout";
import { useAuth } from './AuthContext.jsx'; // Import AuthProvider

function Header() {
  const { isLoggedIn } = useAuth(); // Access the logged-in state
  const [rooms, setRooms] = useState([]);
  const [availableBeds, setAvailableBeds] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Add this state
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Toggle the navigation menu
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

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
  // First useEffect: Check if the user is authenticated
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const authResponse = await axios.get("http://localhost:5001/api/current-user", {
          withCredentials: true,
        });

        if (authResponse.data && authResponse.data.user) {
          setIsAuthenticated(true); // User is authenticated
        } else {
          setIsAuthenticated(false); // User is not authenticated
        }
      } catch (err) {
        console.error("Error checking authentication:", err);
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []); // Empty dependency array so this runs once after the component mounts


  useEffect(() => {
    // Fetch available beds from /rooms endpoint
    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost:5001/rooms'); // Adjust the URL as needed
        if (response.data && Array.isArray(response.data)) {
          setRooms(response.data);

          // Calculate the total available beds from the rooms
          const totalAvailableBeds = response.data.reduce((acc, room) => {
            return acc + (room.available_beds || 0); // Add the available_beds count for each room
          }, 0);

          setAvailableBeds(totalAvailableBeds); // Set the total available beds
        }
      } catch (error) {
        console.error('Error fetching available beds:', error);
      }
    };

    fetchRooms();
  }, []); // This effect runs once to fetch available beds when the component mounts


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
              <Link to="/reserve" className="menu-item">
                Reserve
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
            <div className="availability-text">{availableBeds} Bed Availability</div>
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
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
