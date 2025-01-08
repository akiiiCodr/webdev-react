import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for HTTP requests
import UserInfo from "./UserInfo";
import Logout from "./Logout";
import Register from "./Register"; // Import Register component

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Add this state
  const [tenantStatus, setTenantStatus] = useState(null); // Track tenant status (active/inactive)
  const navigate = useNavigate();

  // Toggle the navigation menu
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  // Open the sign-up page (navigate to /register)
  const handleSignUpClick = () => {
    navigate("/register");
  };

  useEffect(() => {
    const checkAuthenticationAndTenantStatus = async () => {
      try {
        // Check if the user is authenticated
        const authResponse = await axios.get("http://localhost:5001/api/current-user", {
          withCredentials: true,
        });

        if (authResponse.data && authResponse.data.user) {
          setIsAuthenticated(true); // User is authenticated
          
          // Fetch tenant details if user is authenticated
          const tenantResponse = await axios.get(`http://localhost:5001/api/tenants`);
          if (tenantResponse.data && tenantResponse.data.tenant && tenantResponse.data.tenant["0"]) {
            const tenantData = tenantResponse.data.tenant["0"];
            if (tenantData.active === "1") {
              setTenantStatus("active");
            } else {
              setTenantStatus("inactive");
            }
          } else {
            setTenantStatus("inactive"); // No tenant found
          }
        } else {
          setIsAuthenticated(false); // User is not authenticated
          setTenantStatus("inactive"); // If user isn't authenticated, set tenant as inactive
        }
      } catch (err) {
        console.error("Error:", err);
        setIsAuthenticated(false);
        setTenantStatus("inactive");
      }
    };
  
    checkAuthenticationAndTenantStatus();
  }, []);  // Empty dependency array so this only runs once after the component mounts

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
        {isAuthenticated && tenantStatus === "active" ? (
          <div className="auth-logged-in">
            <UserInfo />
            <Logout />
          </div>
        ) : (
          // Show Login & Sign Up buttons if not authenticated or inactive
          <div className="auth-buttons">
            <Link to="/login" className="login">
              Log In
            </Link>
            <button className="sign-up" onClick={handleSignUpClick}>
              Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
