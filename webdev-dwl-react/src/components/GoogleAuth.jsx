import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from '@fortawesome/free-brands-svg-icons'; // Importing the Google icon from FontAwesome

function GoogleAuth() {
  // Function to handle the button click that redirects to the authorization URL
  const handleAuthClick = () => {
    console.log('Button clicked! Redirecting to the auth URL...');
    window.location.href = 'http://localhost:5001/auth';
  };

  return (
    <div className="google-auth-button">
      <button
        onClick={handleAuthClick}
        style={{
          padding: '10px 20px',
          backgroundColor: 'tomato', // Google's blue color
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          fontWeight: 'bold',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
          transition: 'background-color 0.3s, box-shadow 0.3s',
        }}
        onMouseEnter={(e) => {
          console.log('Mouse entered the button area');
          e.currentTarget.style.backgroundColor = '#357AE8'; // Darker blue on hover
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
        }}
        onMouseLeave={(e) => {
          console.log('Mouse left the button area');
          e.currentTarget.style.backgroundColor = '#4285F4';
          e.currentTarget.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
        }}
      >
        <FontAwesomeIcon
          icon={faGoogle}
          style={{ fontSize: '20px', marginRight: '10px' }} // Font Awesome icon styling
        />
        Sign in with Google
      </button>
    </div>
  );
}

export default GoogleAuth;
