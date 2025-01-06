import React, { useState } from 'react';
import IMG0 from '../assets/IMG0.jpg';  // Import IMG0
import IMG1 from '../assets/IMG1.jpg';
import IMG2 from '../assets/IMG2.jpg';
import IMG3 from '../assets/IMG3.jpg';
import IMG4 from '../assets/IMG4.jpg';
import IMG5 from '../assets/IMG5.jpg';  // Import IMG5
import IMG6 from '../assets/IMG6.jpg';  // Import IMG6
import IMG7 from '../assets/IMG7.jpg';  // Import IMG7
import IMG8 from '../assets/IMG8.jpg';  // Import IMG8
import IMG9 from '../assets/IMG9.jpg';  // Import IMG9
import IMG10 from '../assets/IMG10.jpg';  // Import IMG10
import Bot from './Bot'; // Ensure the correct path to your Bot component

function Content() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);  // Tracks which image is currently shown

  const images = [IMG0, IMG1, IMG2, IMG3, IMG4, IMG5, IMG6, IMG7, IMG8, IMG9, IMG10];  // Array of image sources
  const texts = [
    "",  // Text for IMG0
    "Our dorm has two well-designed rooms to choose from.",  // Text for IMG1
    "Take a look at the room layout, designed for comfort and convenience.",  // Text for IMG2
    "The first deck of our double-deck room provides a great space for both work and rest.",  // Text for IMG3
    "The second deck offers additional space and a great view.",  // Text for IMG4
    "The living room is a shared space for relaxation and socializing.",  // Text for IMG5
    "The sink on the first floor is designed for easy use and practicality.",  // Text for IMG6
    "The second-floor sink follows the same practical design as the first.",  // Text for IMG7
    "The restroom on the first floor is simple, clean, and functional.",  // Text for IMG8
    "The restroom on the second floor is designed for comfort and convenience.",  // Text for IMG9
    "The open area for laundry is spacious"  // Text for IMG10
  ];  // More straightforward descriptions for each image


  const toggleChat = () => {
    setIsChatOpen((prevIsChatOpen) => !prevIsChatOpen);
  };

  // Function to go to the next image
  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);  // Loops back to the first image
  };

  // Function to go to the previous image
  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);  // Loops back to the last image
  };

  // Inline styles for large image display and buttons
  const imageContainerStyle = {
    display: 'flex',
    justifyContent: 'center',  // Horizontally center the content inside the container
    alignItems: 'center',  // Vertically center the content inside the container
    position: 'relative',
    width: '80%',  // Set the container width (80% of its parent)
    height: '600px',
    margin: '0 auto',  // This centers the container horizontally within its parent
    marginBottom: '30px',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',  // Semi-transparent background
    borderRadius: '8px',
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',  // Applying blur effect
  };
  
  const parentStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',  // Take up full viewport height
  };

  const largeImageStyle = {
    width: '100%',  // Ensure the image stretches to fill the container
    height: '120%',
    objectFit: 'contain',
  };

  const textOverlayStyle = {
    position: 'absolute',
    bottom: '10%',  // Place text closer to the bottom of the image
    left: '50%',  // Center horizontally
    transform: 'translateX(-50%)',  // Adjust to truly center the text
    color: 'white',  // White text color for contrast
    fontSize: '24px',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Background for text to ensure readability
    padding: '10px 20px',
    borderRadius: '5px',
    textAlign: 'center',
  };

  const buttonStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '30px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    border: 'none',
    padding: '10px',
    cursor: 'pointer',
    zIndex: 10,
  };

  const leftButtonStyle = {
    ...buttonStyle,
    left: '10px',
  };

  const rightButtonStyle = {
    ...buttonStyle,
    right: '10px',
  };

  const messageIconStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '50px',
    height: '50px',
    backgroundColor: '#007BFF',
    color: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  };

  // Text and description box styling
  const boxContainerStyle = {
    width: '50%',  // Set width of the box
    margin: '0 auto',  // Centers the box
    padding: '20px',
    backgroundColor: '#fff',  // Background color of the box
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  };

  const welcomeTextStyle = {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#333',
  };

  const descriptionTextStyle = {
    fontSize: '18px',
    color: '#555',
    marginTop: '10px',
  };

  return (
    <div className="reviews-container">
      {/* Large Image Display with navigation buttons */}
      <div className="image-container" style={imageContainerStyle}>
        <img
          src={images[currentImageIndex]}
          alt={`Image ${currentImageIndex + 1}`}
          style={largeImageStyle}
        />
        <div style={textOverlayStyle}>
          {texts[currentImageIndex]} {/* Overlay Text */}
        </div>
        <button
          style={leftButtonStyle}
          onClick={goToPreviousImage}
        >
          &#60;  {/* Left Arrow */}
        </button>
        <button
          style={rightButtonStyle}
          onClick={goToNextImage}
        >
          &#62;  {/* Right Arrow */}
        </button>
      </div>

      {/* Welcome Text and Description in a Box */}
      <div style={boxContainerStyle}>
  <h1 style={welcomeTextStyle}>Welcome to Dwell-o</h1>
  <p style={descriptionTextStyle}>
    Our dormitory provides a comfortable and convenient living space for all students. 
    With spacious rooms, modern amenities, and a friendly community, you’ll feel right at home. 
    Explore the different areas of our dorm and discover everything we have to offer!
  </p>
  
  {/* New Section */}
  <h2 style={{ fontSize: '28px', color: '#333', fontWeight: 'bold', marginTop: '20px' }}>Affordable and Secure Boarding House</h2>
  <p style={descriptionTextStyle}>
    Welcome to a boarding house designed for comfort, convenience, and affordability. Perfect for students or professionals, this space provides everything you need for a worry-free stay.
  </p>

  <h3 style={{ fontSize: '24px', color: '#333', fontWeight: 'bold', marginTop: '20px' }}>Safety and Security</h3>
  <p style={descriptionTextStyle}>
    <strong>CCTV Monitoring:</strong> 24/7 surveillance ensures a safe environment for all tenants.<br />
    <strong>Fire Extinguishers:</strong> Strategically placed for emergencies, ensuring everyone’s safety.
  </p>

  <h3 style={{ fontSize: '24px', color: '#333', fontWeight: 'bold', marginTop: '20px' }}>Utilities and Services</h3>
  <p style={descriptionTextStyle}>
    <strong>Internet Service:</strong> Stay connected with reliable Wi-Fi available throughout the property.<br />
    <strong>Continuous Water Supply:</strong> Enjoy uninterrupted access to clean water.<br />
    <strong>Stable Power Supply:</strong> A reliable power source for all your needs is guaranteed.
  </p>

  <h3 style={{ fontSize: '24px', color: '#333', fontWeight: 'bold', marginTop: '20px' }}>Affordable Rent</h3>
<p style={descriptionTextStyle}>
  <strong>₱1,300 per month per tenant:</strong> Includes water bill and other utilities, but does not cover Wi-Fi and electricity. You can easily manage these additional costs based on usage, making budgeting simple and hassle-free.
</p>


  <h3 style={{ fontSize: '24px', color: '#333', fontWeight: 'bold', marginTop: '20px' }}>Accommodation Details</h3>
  <p style={descriptionTextStyle}>
    <strong>2 Units Available:</strong> Each unit is thoughtfully designed to meet the needs of its occupants.<br />
    <strong>2 Bathrooms in each unit:</strong> For shared convenience.<br />
    <strong>2 Rooms Per Unit:</strong>
    <br />
    Room 1: Comfortable space for up to 4 people.<br />
    Room 2: Spacious enough to accommodate up to 6 people.
  </p>

  <p style={descriptionTextStyle}>
    This boarding house combines practicality with affordability, ensuring a safe and comfortable living experience. 
    Secure your spot now and enjoy all the amenities included at an unbeatable price!
  </p>
</div>




      {/* Message Icon */}
      <div
        className="message-icon"
        aria-label="Messages"
        onClick={toggleChat}
        style={messageIconStyle}
      >
        ✉️
      </div>

      {/* Bot Component - Only show if chat is open */}
      {isChatOpen && <Bot />}
    </div>
  );
}

export default Content;
