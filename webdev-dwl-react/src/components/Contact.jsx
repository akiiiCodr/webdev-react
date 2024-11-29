import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Bot from "./Bot"; // Import the Bot component

const socket = io("http://localhost:5001"); // Replace with your server's address

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Listen for incoming messages from the server
    socket.on("newMessage", (messageData) => {
      console.log("Received message from server:", messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5001/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setToastMessage("Message sent successfully!");
        setShowToast(true);
        setFormData({ name: "", email: "", message: "" });
      } else {
        setToastMessage("Failed to send message.");
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage("Error: " + error.message);
      setShowToast(true);
    }
  };

  // Inline styles
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    maxWidth: "800px",
    margin: "auto",
    fontFamily: "Arial, sans-serif"
  };

  const formStyle = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginBottom: "20px"
  };

  const inputStyle = {
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    width: "100%",
    fontSize: "14px"
  };

  const textareaStyle = {
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    width: "100%",
    fontSize: "14px",
    resize: "vertical"
  };

  const buttonStyle = {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s"
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: "#0056b3"
  };

  const toastNotificationStyle = {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#333",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "4px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "300px"
  };

  const closeButtonStyle = {
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: "18px",
    cursor: "pointer"
  };

  return (
    <div style={containerStyle}>
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div>
          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} />
        </div>
        <div>
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} />
        </div>
        <div>
          <label>Message</label>
          <textarea name="message" value={formData.message} onChange={handleChange} required style={textareaStyle}></textarea>
        </div>
        <button type="submit" style={buttonStyle}>Send Message</button>
      </form>

      <div>
        <Bot socket={socket} />
      </div>

      {showToast && (
        <div style={toastNotificationStyle}>
          <p>{toastMessage}</p>
          <button onClick={() => setShowToast(false)} style={closeButtonStyle}>×</button>
        </div>
      )}
    </div>
  );
}

export default Contact;
