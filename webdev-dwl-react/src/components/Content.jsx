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
import BGM from '../assets/gradient-image.svg';
import Bot from './Bot'; // Ensure correct path to Bot component
import WelcomeSection from './WelcomeSection';

function Content() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Tracks which image is currently shown
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [hoveredRoom, setHoveredRoom] = useState(null); // State to track hovered room

  const images = [IMG0, IMG1, IMG2, IMG3, IMG4, IMG5, IMG6, IMG7, IMG8, IMG9, IMG10];
  const bgimage = [BGM];

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

  // Handle hover effect
  const handleMouseEnter = (roomNumber) => {
    setHoveredRoom(roomNumber);
  };

  const handleMouseLeave = () => {
    setHoveredRoom(null);
  };

  return (
    <div className="content-container" style={{
      backgroundImage: `url(${bgimage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh', // Ensure it covers the entire viewport height
      position: 'relative',
    }}>
      {/* Large Image Display */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          width: '100%', // Full width of the screen
          height: '600px', // Fixed height
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
          alt={Image `${currentImageIndex + 1}`}
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

      <WelcomeSection />

      <div
      style={{
        display: 'flex',
        overflowX: 'hidden', // Hide overflow to avoid visual gaps
        margin: '20px',
        padding: '10px 0',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          animation: 'scroll 30s linear infinite', // Apply the scrolling animation
          // whiteSpace: 'nowrap', // Ensures the cards don't wrap to the next line
        }}
      >
        {/* Original set of room cards */}
        {rooms
          .slice()
          .sort((a, b) => a.room_number - b.room_number) // Sort rooms by room_number
          .map((room) => (
            <div
              key={`original-${room.room_number}`}
              className="room-card"
              onMouseEnter={() => handleMouseEnter(room.room_number)}
              onMouseLeave={handleMouseLeave}
              style={{
                flex: 'none',
                width: '300px',
                marginRight: '20px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '15px',
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.2)', // Transparent background
                backdropFilter: 'blur(10px)', // Apply frosted glass effect
                boxShadow: hoveredRoom === room.room_number
                  ? '0 8px 16px rgba(0, 0, 0, 0.3)' // Stronger shadow when hovered
                  : '0 4px 8px rgba(0, 0, 0, 0.1)', // Default shadow
                transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth transition
                transform: hoveredRoom === room.room_number ? 'scale(1.05)' : 'scale(1)', // Scaling on hover
              }}
            >
              <img
                src={room.image_filename || IMG1} // Assuming IMG1 is a fallback image
                alt={`Room ${room.room_number}`}
                style={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '8px 8px 0 0',
                }}
              />
              <div style={{ marginTop: '10px', fontSize: '16px', color: '#333' }}>
                <strong>Room Number:</strong> {room.room_number}
              </div>
              <div style={{ marginTop: '10px', fontSize: '16px', color: '#333' }}>
                <strong>Total Beds:</strong> {room.total_beds}
              </div>
              <div style={{ marginTop: '10px', fontSize: '16px', color: '#333' }}>
                <strong>Available Beds:</strong> {room.available_beds}
              </div>
              <div style={{ marginTop: '10px', fontSize: '16px', color: '#333' }}>
                <strong>Status:</strong>{' '}
                {room.available_beds === 0 ? (
                  <span style={{ color: 'red', fontWeight: 'bold' }}>Occupied</span>
                ) : (
                  <span style={{ color: 'green', fontWeight: 'bold' }}>Available</span>
                )}
              </div>
              <div style={{ marginTop: '10px', fontSize: '16px', color: '#333' }}>
                <strong>Price:</strong> ₱{room.price}
              </div>
            </div>
          ))}

        {/* Duplicated set of room cards for continuous scrolling */}
        {rooms
          .slice()
          .sort((a, b) => a.room_number - b.room_number)
          .map((room) => (
            <div
              key={`duplicate-${room.room_number}`}
              className="room-card"
              onMouseEnter={() => handleMouseEnter(room.room_number)}
              onMouseLeave={handleMouseLeave}
              style={{
                flex: 'none',
                width: '300px',
                marginRight: '20px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '15px',
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.2)', // Transparent background
                backdropFilter: 'blur(10px)', // Apply frosted glass effect
                boxShadow: hoveredRoom === room.room_number
                  ? '0 8px 16px rgba(0, 0, 0, 0.3)' // Stronger shadow when hovered
                  : '0 4px 8px rgba(0, 0, 0, 0.1)', // Default shadow
                transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth transition
                transform: hoveredRoom === room.room_number ? 'scale(1.05)' : 'scale(1)', // Scaling on hover
              }}
            >
              <img
                src={room.image_filename || IMG1} // Assuming IMG1 is a fallback image
                alt={`Room ${room.room_number}`}
                style={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '8px 8px 0 0',
                }}
              />
              <div style={{ marginTop: '10px', fontSize: '16px', color: '#333' }}>
                <strong>Room Number:</strong> {room.room_number}
              </div>
              <div style={{ marginTop: '10px', fontSize: '16px', color: '#333' }}>
                <strong>Total Beds:</strong> {room.total_beds}
              </div>
              <div style={{ marginTop: '10px', fontSize: '16px', color: '#333' }}>
                <strong>Available Beds:</strong> {room.available_beds}
              </div>
              <div style={{ marginTop: '10px', fontSize: '16px', color: '#333' }}>
                <strong>Status:</strong>{' '}
                {room.available_beds === 0 ? (
                  <span style={{ color: 'red', fontWeight: 'bold' }}>Occupied</span>
                ) : (
                  <span style={{ color: 'green', fontWeight: 'bold' }}>Available</span>
                )}
              </div>
              <div style={{ marginTop: '10px', fontSize: '16px', color: '#333' }}>
                <strong>Price:</strong> ₱{room.price}
              </div>
            </div>
          ))}
      </div>
    </div>



      {/* Chatbot */}
      {isChatOpen && <Bot />}
    </div>
  );
}

export default Content;