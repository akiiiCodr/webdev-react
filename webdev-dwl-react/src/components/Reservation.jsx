import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Reservation() {
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [error, setError] = useState(null);  // Added error state

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

    fetchRoomsData();
  }, []); // Empty dependency array means it runs once when the component mounts
  
  // Toggle Modal visibility
  const toggleModal = () => setShowModal(!showModal);
  
  // Handle room selection
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
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '80%',
    maxWidth: '600px',
    maxHeight: '80vh', // Limit the height of the modal content
    overflowY: 'auto', // Allow vertical scrolling if content exceeds max-height
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  };

  const roomCardStyle = {
    marginBottom: '20px',
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s',
  };

  const roomCardHoverStyle = {
    backgroundColor: '#f5f5f5',
    transform: 'scale(1.05)',
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15)',
  };

  const roomImageStyle = {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
    marginBottom: '10px',
  };

  return (
    <div className="room-booking-form">
      <h1>Book a Room</h1>

      <form>
        {/* Name Fields */}
        <div className="form-group">
          <label htmlFor="first-name">Name <span>*</span></label>
          <div className="name-fields">
            <input type="text" id="first-name" placeholder="First Name" required />
            <input type="text" id="last-name" placeholder="Last Name" required />
          </div>
        </div>

        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="email">E-mail <span>*</span></label>
          <input type="email" id="email" placeholder="example@example.com" required />
        </div>

        {/* Selected Room Display */}
        {selectedRoom && (
          <div className="selected-room">
            <h3>Selected Room</h3>
            <p>Room Number: {selectedRoom.room_number}</p>
            <img
              src={selectedRoom.image_filename}
              alt={`Room ${selectedRoom.room_number}`}
              style={roomImageStyle}
            />
            <p>Total Beds: {selectedRoom.total_beds}</p>
            <p>Available Beds: {selectedRoom.available_beds}</p>
            <p>{selectedRoom.status}</p>
            <p>Price: Php {selectedRoom.price}</p>
          </div>
        )}

        {/* Room Type Button */}
        <div className="form-group">
          <label>Room Type <span>*</span></label>
          <button type="button" onClick={toggleModal}>
            {selectedRoom ? selectedRoom.name : 'Select a Room'}
          </button>
        </div>

        {/* Number of Guests */}
        <div className="form-group">
          <label htmlFor="number-of-guests">Number of Guests <span>*</span></label>
          <input type="number" id="number-of-guests" min="1" required />
        </div>

        {/* Arrival Date & Time */}
        <div className="form-group">
          <label htmlFor="arrival-date">Arrival Date & Time <span>*</span></label>
          <input type="date" id="arrival-date" required />
          <input type="time" id="arrival-time" required />
        </div>

        {/* Departure Date */}
        <div className="form-group">
          <label htmlFor="departure-date">Departure Date <span>*</span></label>
          <input type="date" id="departure-date" required />
        </div>

        {/* Total Amount */}
        <div className="form-group">
          <label>Total</label>
          <div className="total-amount">{selectedRoom ? `$${selectedRoom.price}` : '$0.00'}</div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="reserve">Submit</button>
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
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
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
            <button onClick={toggleModal}>Close</button>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Reservation;
