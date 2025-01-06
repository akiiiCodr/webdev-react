import React, { useState, useEffect } from 'react';
import IMG0 from '../assets/IMG0.jpg';
import IMG1 from '../assets/IMG1.jpg';
import IMG2 from '../assets/IMG2.jpg';
import IMG3 from '../assets/IMG3.jpg';
import IMG4 from '../assets/IMG4.jpg';
import IMG5 from '../assets/IMG5.jpg';
import IMG6 from '../assets/IMG6.jpg';
import IMG7 from '../assets/IMG7.jpg';
import IMG8 from '../assets/IMG8.jpg';
import IMG9 from '../assets/IMG9.jpg';
import IMG10 from '../assets/IMG10.jpg';
import Bot from './Bot'; // Ensure correct path to Bot component

function Content() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Tracks which image is currently shown
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rooms, setRooms] = useState([]);

  const images = [IMG0, IMG1, IMG2, IMG3, IMG4, IMG5, IMG6, IMG7, IMG8, IMG9, IMG10];

  const toggleChat = () => {
    setIsChatOpen((prevIsChatOpen) => !prevIsChatOpen);
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('http://localhost:5001/rooms');
        if (!response.ok) throw new Error('Failed to fetch room data');
        const data = await response.json();
        setLoading(false);
        setRooms(data);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRooms();

    // Auto slide every 3 seconds
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // 3000ms = 3 seconds

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const texts = [
    "",  
    "Our dorm has two well-designed rooms to choose from.",
    "Take a look at the room layout, designed for comfort and convenience.",
    "The first deck of our double-deck room provides a great space for both work and rest.",
    "The second deck offers additional space and a great view.",
    "The living room is a shared space for relaxation and socializing.",
    "The sink on the first floor is designed for easy use and practicality.",
    "The second-floor sink follows the same practical design as the first.",
    "The restroom on the first floor is simple, clean, and functional.",
    "The restroom on the second floor is designed for comfort and convenience.",
    "The open area for laundry is spacious"
  ];

  const textOverlayStyle = {
    position: 'absolute',
    bottom: '10%',
    left: '50%',
    transform: 'translateX(-50%)',
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    padding: '10px 20px',
    borderRadius: '5px',
    textAlign: 'center',
  };

  const boxContainerStyle = {
    width: '50%',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#fff',
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
    <div className="content-container">
      {/* Large Image Display */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          width: '80%',
          height: '600px',
          margin: '0 auto 30px',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          borderRadius: '8px',
          overflow: 'hidden',
          backdropFilter: 'blur(10px)',
        }}
      >
        <img
          key={currentImageIndex} // Force a re-render on each image change
          src={images[currentImageIndex]}
          alt={`Image ${currentImageIndex + 1}`}
          className="fade-image"
          style={{
            width: '100%',
            height: '120%',
            objectFit: 'contain',
            opacity: 0,
            transition: 'opacity 1s ease',
            animation: 'fadeInOut 6s infinite', // Added animation for smooth fade
          }}
        />
        <div style={textOverlayStyle}>
          {texts[currentImageIndex]} {/* Overlay Text */}
        </div>
      </div>

      {/* Welcome Text and Description */}
      <div style={boxContainerStyle}>
        <h1 style={welcomeTextStyle}>Welcome to Dwell-o</h1>
        <p style={descriptionTextStyle}>
          Our dormitory provides a comfortable and convenient living space for all students. 
          With spacious rooms, modern amenities, and a friendly community, you’ll feel right at home. 
          Explore the different areas of our dorm and discover everything we have to offer!
        </p>
        
        {/* New Section */}
        <h2 style={{ fontSize: '28px', color: '#333', fontWeight: 'bold', marginTop: '20px' }}>
          Affordable and Secure Boarding House
        </h2>
        <p style={descriptionTextStyle}>
          Welcome to a boarding house designed for comfort, convenience, and affordability. Perfect for students or professionals, 
          this space provides everything you need for a worry-free stay.
        </p>

        <h3 style={{ fontSize: '24px', color: '#333', fontWeight: 'bold', marginTop: '20px' }}>
          Safety and Security
        </h3>
        <p style={descriptionTextStyle}>
          <strong>CCTV Monitoring:</strong> 24/7 surveillance ensures a safe environment for all tenants.<br />
          <strong>Fire Extinguishers:</strong> Strategically placed for emergencies, ensuring everyone’s safety.
        </p>

        <h3 style={{ fontSize: '24px', color: '#333', fontWeight: 'bold', marginTop: '20px' }}>
          Utilities and Services
        </h3>
        <p style={descriptionTextStyle}>
          <strong>Internet Service:</strong> Stay connected with reliable Wi-Fi available throughout the property.<br />
          <strong>Continuous Water Supply:</strong> Enjoy uninterrupted access to clean water.<br />
          <strong>Stable Power Supply:</strong> A reliable power source for all your needs is guaranteed.
        </p>

        <h3 style={{ fontSize: '24px', color: '#333', fontWeight: 'bold', marginTop: '20px' }}>
          Affordable Rent
        </h3>
        <p style={descriptionTextStyle}>
          <strong>₱1,300 per month per tenant:</strong> Includes water bill and other utilities, but does not cover Wi-Fi and electricity. 
          You can easily manage these additional costs based on usage, making budgeting simple and hassle-free.
        </p>

        <h3 style={{ fontSize: '24px', color: '#333', fontWeight: 'bold', marginTop: '20px' }}>
          Accommodation Details
        </h3>
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


 {/* Room Availability */}
 <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Room Availability</h1>
      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading...</p>
      ) : error ? (
        <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>
      ) : (
        <div
          style={{
            display: 'flex',
            overflowX: 'auto', // Enable horizontal scrolling
            margin: '20px',
            padding: '10px 0',
          }}
        >
          {rooms.map((room, index) => (
            <div
              key={room.room_number}
              className="room-card" // Applying the sliding animation class
              style={{
                flex: 'none',
                width: '300px', // Adjust width to fit your design
                marginRight: '20px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                padding: '15px',
                backgroundColor: '#fff',
                textAlign: 'center',
                transition: 'transform 0.3s ease',
              }}
            >
              <img
                src={room.image_filename || IMG1}
                alt={`Room ${room.room_number}`}
                style={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '8px 8px 0 0',
                }}
              />
              <div style={{ marginTop: '10px', fontSize: '16px', color: '#555' }}>
                <strong>Room Number:</strong> {room.room_number}
              </div>
              <div style={{ marginTop: '10px', fontSize: '16px', color: '#555' }}>
                <strong>Total Beds:</strong> {room.total_beds}
              </div>
              <div style={{ marginTop: '10px', fontSize: '16px', color: '#555' }}>
                <strong>Available Beds:</strong> {room.available_beds}
              </div>
              <div style={{ marginTop: '10px', fontSize: '16px', color: '#555' }}>
                <strong>Status:</strong>{' '}
                {room.available_beds === 0 ? (
                  <span style={{ color: 'red', fontWeight: 'bold' }}>Occupied</span>
                ) : (
                  <span style={{ color: 'green', fontWeight: 'bold' }}>Available</span>
                )}
              </div>
              <div style={{ marginTop: '10px', fontSize: '16px', color: '#555' }}>
                <strong>Price:</strong> ₱{room.price}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chat Icon */}
      <div
        onClick={toggleChat}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#007bff',
          color: 'white',
          borderRadius: '50%',
          padding: '15px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
          cursor: 'pointer',
          fontSize: '24px',
        }}
      >
        🗨️
      </div>

      {/* Chatbot */}
      {isChatOpen && <Bot />}
    </div>
  );
}

export default Content;
