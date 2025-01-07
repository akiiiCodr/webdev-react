import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="footer-content">
      {/* About Section */}
      <div className="footer-section">
        <h3>About Us</h3>
        <p>
          Dwell-O, a digital boarding house platform, helps anyone to achieve
          a wonderful rest with great value deals.
        </p>
      </div>

      {/* Quick Links Section */}
      <div className="footer-section">
        <h3>Quick Links</h3>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/services">Services</Link></li> {/* Updated with Link */}
          <li><Link to="/contact-us">Contact</Link></li>
          <li><Link to="/privacy-policy">Privacy Policy</Link></li>
          <li><Link to="/faqs">FAQs</Link></li>
        </ul>
      </div>

      {/* Social Media Section */}
      <div className="footer-section">
        <h3>Follow Us</h3>
        <div className="social-icons">
          <a
            href="https://www.facebook.com/profile.php?id=61571741602840"
            aria-label="Facebook"
            target="_blank" 
            rel="noopener noreferrer" 
          >
            F
          </a>
          <a href="#" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
            T
          </a>
          <a
            href="https://www.instagram.com/dwe.llo/"
            aria-label="Instagram"
            target="_blank" 
            rel="noopener noreferrer"
          >
            I
          </a>
          <a href="#" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
            L
          </a>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} Dwell-o. All rights reserved.
      </div>
    </div>
  );
}

export default Footer;
