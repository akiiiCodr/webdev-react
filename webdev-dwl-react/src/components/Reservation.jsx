import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BGM from '../assets/gradient-image.svg'; // Import the background image

function Reservation() {
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoomsData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/rooms');
        if (response.data && Array.isArray(response.data)) {
          setRooms(response.data); // Set room data to state
        } else {
          setError('No rooms available.');
        }
      } catch (err) {
        console.error('Error fetching rooms:', err);
        setError('Error loading rooms data.');
      }
    };

    // Apply background image to the body
    document.body.style.backgroundImage = `url(${BGM})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.minHeight = '100vh'; // Ensure body covers the entire viewport height

    fetchRoomsData();

    return () => {
      // Clean up background styles when component is unmounted
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundRepeat = '';
      document.body.style.minHeight = '';
    };
  }, []); // Empty dependency array means it runs once when the component mounts

  const toggleModal = () => setShowModal(!showModal);

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setShowModal(false); // Close modal after selection
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const modalContentStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Transparent white background for glassmorphism
    backdropFilter: 'blur(10px)', // Frosted glass effect
    padding: '20px',
    borderRadius: '12px',
    width: '80%',
    maxWidth: '600px',
    maxHeight: '80vh',
    overflowY: 'auto',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  };

  const roomCardStyle = {
    marginBottom: '20px',
    padding: '15px',
    border: '1px solid rgba(255, 255, 255, 0.3)', // Semi-transparent border for glassmorphism
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent background
    backdropFilter: 'blur(8px)', // Frosted glass effect
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s',
  };

  const roomCardHoverStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Slightly more opaque on hover
    transform: 'scale(1.05)',
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15)',
  };

  const roomImageStyle = {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
    marginBottom: '10px',
  };

  const formStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Transparent background for the form
    backdropFilter: 'blur(10px)', // Frosted glass effect
    padding: '30px',
    borderRadius: '15px',
    maxWidth: '800px',
    width: '100%',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    margin: 'auto',
  };

  const formGroupStyle = {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
  };

  const inputStyle = {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.3)', // Transparent border
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent background for inputs
    color: '#000',
    outline: 'none',
    fontSize: '16px',
    transition: 'border-color 0.3s ease',
  };

  const buttonStyle = {
    padding: '12px 20px',
    backgroundColor: '#0a74da',
    color: '#000',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const totalAmountStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#000',
  };

  return (
    <div className="room-booking-form">
      <h1>Book a Room</h1>

      <form style={formStyle}>
        {/* Name Fields */}
        <div className="form-group" style={formGroupStyle}>
          <label htmlFor="first-name" style={{ color: '#000' }}>Name <span>*</span></label>
          <div className="name-fields" style={{ display: 'flex', gap: '15px' }}>
            <input type="text" id="first-name" placeholder="First Name" style={inputStyle} required />
            <input type="text" id="last-name" placeholder="Last Name" style={inputStyle} required />
          </div>
        </div>

        {/* Email Field */}
        <div className="form-group" style={formGroupStyle}>
          <label htmlFor="email" style={{ color: '#000' }}>E-mail <span>*</span></label>
          <input type="email" id="email" placeholder="example@example.com" style={inputStyle} required />
        </div>

        {/* Selected Room Display */}
        {selectedRoom && (
          <div className="selected-room" style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#000' }}>Selected Room</h3>
            <p style={{ color: '#000' }}>Room Number: {selectedRoom.room_number}</p>
            <img
              src={selectedRoom.image_filename}
              alt={`Room ${selectedRoom.room_number}`}
              style={roomImageStyle}
            />
            <p style={{ color: '#000' }}>Total Beds: {selectedRoom.total_beds}</p>
            <p style={{ color: '#000' }}>Available Beds: {selectedRoom.available_beds}</p>
            <p style={{ color: '#000' }}>{selectedRoom.status}</p>
            <p style={{ color: '#000' }}>Price: Php {selectedRoom.price}</p>
          </div>
        )}

        {/* Room Type Button */}
        <div className="form-group" style={formGroupStyle}>
          <label style={{ color: '#000' }}>Room Type <span>*</span></label>
          <button
            type="button"
            onClick={toggleModal}
            style={buttonStyle}
          >
            {selectedRoom ? selectedRoom.name : 'Select a Room'}
          </button>
        </div>

        {/* Number of Guests */}
        <div className="form-group" style={formGroupStyle}>
          <label htmlFor="number-of-guests" style={{ color: '#000' }}>Number of Guests <span>*</span></label>
          <input type="number" id="number-of-guests" min="1" style={inputStyle} required />
        </div>

        {/* Arrival Date & Time */}
        <div className="form-group" style={formGroupStyle}>
          <label htmlFor="arrival-date" style={{ color: '#000' }}>Arrival Date & Time <span>*</span></label>
          <input type="date" id="arrival-date" style={inputStyle} required />
          <input type="time" id="arrival-time" style={inputStyle} required />
        </div>

        {/* Departure Date */}
        <div className="form-group" style={formGroupStyle}>
          <label htmlFor="departure-date" style={{ color: '#000' }}>Departure Date <span>*</span></label>
          <input type="date" id="departure-date" style={inputStyle} required />
        </div>

        {/* Total Amount */}
        <div className="form-group" style={formGroupStyle}>
          <label style={{ color: '#000' }}>Total</label>
          <div style={totalAmountStyle}>{selectedRoom ? `Php ${selectedRoom.price}` : 'Php 0.00'}</div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="reserve" style={buttonStyle}>Submit</button>
      </form>

      {/* Room Selection Modal */}
      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2>Select a Room</h2>
            <div className="room-cards">
              {rooms.length > 0 ? (
                rooms.map(room => (
                  <div
                    key={room.id}
                    style={roomCardStyle}
                    onMouseEnter={(e) => e.target.style.backgroundColor = roomCardHoverStyle.backgroundColor}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                    onClick={() => handleRoomSelect(room)}
                  >
                    <h3>Room {room.room_number}</h3>
                    <img
                      src={room.image_filename}
                      alt={`Room ${room.room_number}`}
                      style={roomImageStyle}
                    />
                    <p>Total Beds: {room.total_beds}</p>
                    <p>Available Beds: {room.available_beds}</p>
                    <p>{room.status}</p>
                    <p>Price: Php {room.price}</p>
                  </div>
                ))
              ) : (
                <p>No rooms available</p>
              )}
            </div>
            <button onClick={toggleModal} style={{ ...buttonStyle, marginTop: '20px' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reservation;
