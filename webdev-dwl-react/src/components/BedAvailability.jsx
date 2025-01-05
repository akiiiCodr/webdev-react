import React, { useState, useEffect } from "react";
import axios from "axios";

const BedAvailability = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newRoom, setNewRoom] = useState({
    room_number: "",
    total_beds: "",
    available_beds: "",
    image_room: null,
  });

  const [editedRoom, setEditedRoom] = useState({
    room_number: "",
    total_beds: "",
    available_beds: "",
    image_room: null,
  });

  // Fetch room data from the backend
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://localhost:5001/rooms");
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleAddRoom = async (event) => {
    event.preventDefault();

    // Validate that all required fields are filled
    if (!newRoom.room_number || !newRoom.total_beds || !newRoom.available_beds) {
      alert("Please fill in all required fields.");
      return;
    }

    // Prepare the form data
    const formData = new FormData();
    formData.append("room_number", newRoom.room_number);
    formData.append("total_beds", newRoom.total_beds);
    formData.append("available_beds", newRoom.available_beds);

    // Append image if it exists
    if (newRoom.image_room) {
      formData.append("image_room", newRoom.image_room);
    }

    try {
      // Send POST request to add the room
      await axios.post("http://localhost:5001/rooms", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Refresh room data after adding
      fetchRooms();

      // Close modal and reset form
      setShowModal(false);
      setNewRoom({ room_number: "", total_beds: "", available_beds: "", image_room: null });
    } catch (error) {
      console.error("Error adding new room:", error);
      alert("An error occurred while adding the room. Please try again.");
    }
  };

  // Handle opening the edit modal
  const handleEditRoom = (room) => {
    setEditedRoom({
      room_number: room.room_number,
      total_beds: room.total_beds,
      available_beds: room.available_beds,
      image_room: room.image_room, // Keep the existing image
    });
    setShowEditModal(true);
  };

  const handleUpdateRoom = async (event) => {
    event.preventDefault();

    // Validate required fields
    if (!editedRoom.room_number || !editedRoom.total_beds || !editedRoom.available_beds) {
      alert("Please fill in all required fields.");
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("room_number", editedRoom.room_number);
    formData.append("total_beds", editedRoom.total_beds);
    formData.append("available_beds", editedRoom.available_beds);

    // Append image if exists
    if (editedRoom.image_room) {
      formData.append("image_room", editedRoom.image_room);
    }

    try {
      // Send PUT request to update the room
      const response = await axios.put(
        `http://localhost:5001/rooms/${editedRoom.room_number}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Check if the response is successful
      if (response.status === 200) {
        // Refresh room data after update
        fetchRooms();

        // Close the edit modal
        setShowEditModal(false);

        // Reset editedRoom state
        setEditedRoom({
          room_number: "",
          total_beds: "",
          available_beds: "",
          image_room: null,
        });

        alert("Room updated successfully!");
      }
    } catch (error) {
      console.error("Error updating room:", error);
      alert("An error occurred while updating the room. Please try again.");
    }
  };

  // Function to remove a room
  const handleRemoveRoom = async (room_number) => {
    try {
      await axios.delete(`http://localhost:5001/rooms/${room_number}`);
      fetchRooms(); // Refresh room list after deletion
    } catch (error) {
      console.error("Error deleting room:", error);
      alert("An error occurred while deleting the room. Please try again.");
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <h2 style={styles.navTitle}>Room Management</h2>
        <div style={styles.navButtons}>
          <button style={styles.navButton} onClick={() => setShowModal(true)}>
            Add Room
          </button>
        </div>
      </nav>

      {/* Room Cards */}
      <div style={styles.container}>
        <h2>Room Availability</h2>
        <div style={styles.cardContainer}>
          {rooms.map((room) => (
            <div
              key={room.id}
              style={{
                ...styles.card,
                border: selectedRoom === room.room_number ? "3px solid #4CAF50" : "1px solid #ddd",
              }}
              onClick={() =>
                setSelectedRoom(selectedRoom === room.room_number ? null : room.room_number)
              }
            >
              <h3>Room: {room.room_number}</h3>
              <p>Total Beds: {room.total_beds}</p>
              <p>Available Beds: {room.available_beds}</p>
              <p>
                Status:{" "}
                {room.available_beds > 0 ? (
                  <span style={styles.available}>Available</span>
                ) : (
                  <span style={styles.occupied}>Occupied</span>
                )}
              </p>
              {/* Check if the image exists */}
              {room.image_filename && (
                <img
                  src={`${room.image_filename}`} // URL to fetch image
                  alt="Room"
                  style={{ width: "100%", height: "auto" }}
                />
              )}

              {/* Edit and Remove Room Buttons */}
              <div style={styles.cardButtonsContainer}>
                <button style={styles.removeButton} onClick={() => handleRemoveRoom(room.room_number)}>
                  Remove Room
                </button>
                <button style={styles.navButton} onClick={() => handleEditRoom(room)}>
                  Edit Room
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Room Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Add Room</h3>
            <form onSubmit={handleAddRoom}>
              <label style={styles.modalLabel}>Room Number:</label>
              <input
                type="text"
                value={newRoom.room_number}
                onChange={(e) => setNewRoom({ ...newRoom, room_number: e.target.value })}
                required
                style={styles.modalInput}
              />
              <label style={styles.modalLabel}>Total Beds:</label>
              <input
                type="number"
                value={newRoom.total_beds}
                onChange={(e) => setNewRoom({ ...newRoom, total_beds: e.target.value })}
                required
                style={styles.modalInput}
              />
              <label style={styles.modalLabel}>Available Beds:</label>
              <input
                type="number"
                value={newRoom.available_beds}
                onChange={(e) => setNewRoom({ ...newRoom, available_beds: e.target.value })}
                required
                style={styles.modalInput}
              />
              <label style={styles.modalLabel}>Room Image:</label>
              <input
                type="file"
                onChange={(e) => setNewRoom({ ...newRoom, image_room: e.target.files[0] })}
                style={styles.modalInput}
              />
              <div style={styles.modalActions}>
                <button
                  type="submit"
                  style={{ ...styles.navButton, backgroundColor: "#4CAF50" }}
                >
                  Add Room
                </button>
                <button
                  type="button"
                  style={{ ...styles.navButton, backgroundColor: "#f44336" }}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Room Modal */}
      {showEditModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Edit Room</h3>
            <form onSubmit={handleUpdateRoom}>
              <label style={styles.modalLabel}>Room Number:</label>
              <input
                type="text"
                value={editedRoom.room_number}
                disabled
                style={styles.modalInput}
              />
              <label style={styles.modalLabel}>Total Beds:</label>
              <input
                type="number"
                value={editedRoom.total_beds}
                onChange={(e) => setEditedRoom({ ...editedRoom, total_beds: e.target.value })}
                required
                style={styles.modalInput}
              />
              <label style={styles.modalLabel}>Available Beds:</label>
              <input
                type="number"
                value={editedRoom.available_beds}
                onChange={(e) => setEditedRoom({ ...editedRoom, available_beds: e.target.value })}
                required
                style={styles.modalInput}
              />
              <label style={styles.modalLabel}>Room Image:</label>
              <input
                type="file"
                onChange={(e) => setEditedRoom({ ...editedRoom, image_room: e.target.files[0] })}
                style={styles.modalInput}
              />
              <div style={styles.modalActions}>
                <button
                  type="submit"
                  style={{ ...styles.navButton, backgroundColor: "#4CAF50" }}
                >
                  Update Room
                </button>
                <button
                  type="button"
                  style={{ ...styles.navButton, backgroundColor: "#f44336" }}
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
    navbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#333",
      color: "#fff",
      padding: "10px 20px",
    },
    navTitle: {
      fontSize: "24px",
      fontWeight: "bold",
    },
    navButtons: {
      display: "flex",
      alignItems: "center",
    },
    navButton: {
      backgroundColor: "#4CAF50",
      color: "#fff",
      border: "none",
      padding: "10px 20px",
      cursor: "pointer",
      marginLeft: "10px",
      borderRadius: "5px",
      fontSize: "14px",
      transition: "background-color 0.3s",
    },
    container: {
      padding: "20px",
    },
    cardContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "20px",
      marginTop: "20px",
    },
    card: {
      border: "1px solid #ddd",
      padding: "15px",
      borderRadius: "5px",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      minHeight: "250px",
      backgroundColor: "#fff",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      transition: "transform 0.3s, box-shadow 0.3s",
    },
    available: {
      color: "green",
      fontWeight: "bold",
    },
    occupied: {
      color: "red",
      fontWeight: "bold",
    },
    removeButton: {
      backgroundColor: "#f44336",
      color: "#fff",
      border: "none",
    //   padding: "10px 20px",
      cursor: "pointer",
      borderRadius: "5px",
      fontSize: "14px",
      marginRight: "10px",
    //   flex: 1, // Ensures the button occupies equal space
      transition: "background-color 0.3s",
    },
    editButton: {
      backgroundColor: "#ff9800",
      color: "#fff",
      border: "none",
      padding: "10px 20px",
      cursor: "pointer",
      borderRadius: "5px",
      fontSize: "14px",
      marginLeft: "10px",
      flex: 1, // Ensures the button occupies equal space
      transition: "background-color 0.3s",
    },
    cardButtonsContainer: {
      display: "flex",
      justifyContent: "space-between", // Space buttons equally
      marginTop: "auto", // Push buttons to the bottom of the card
      width: "100%", // Ensure buttons take full width
      gap: "10px", // Space between buttons
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    modal: {
      backgroundColor: "#fff",
      padding: "30px",
      borderRadius: "5px",
      width: "500px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    modalLabel: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "bold",
    },
    modalInput: {
      width: "100%",
      padding: "12px",
      marginBottom: "15px",
      borderRadius: "5px",
      border: "1px solid #ddd",
      fontSize: "14px",
    },
    modalActions: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "15px",
    },
  };
  

export default BedAvailability;
