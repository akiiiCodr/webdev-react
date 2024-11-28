import React, { useState } from "react";
import { Link } from "react-router-dom";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
          {/* Add your dropdown menu items here */}
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
        <Link to="/signup" className="sign-up">
          Sign Up
        </Link>
        <Link to="/login" className="login">
          Log In
        </Link>
      </div>
    </div>
  );
}

export default Header;
