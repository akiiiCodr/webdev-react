import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Bot from "./Bot"; // Import the Bot component
import BGM from '../assets/gradient-image.svg'; // Import the background image

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

    // Apply background image to the body of the page
    document.body.style.backgroundImage = `url(${BGM})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.minHeight = '100vh'; // Ensure body covers the entire viewport height

    return () => {
      // Clean up background styles when component is unmounted
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundRepeat = '';
      document.body.style.minHeight = '';
    };
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

  // Inline styles for the Contact component form
  const formStyle = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginBottom: "20px",
    backdropFilter: "blur(10px)", // Apply blur effect to the form area
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Semi-transparent background
    padding: "20px", // Padding for the form area
    borderRadius: "10px", // Rounded corners for the glassmorphism effect
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Slight shadow to enhance the glass effect
    maxWidth: "600px", // Limit the form width
    marginTop: "50px", // Add some space at the top for better alignment
  };

  const inputStyle = {
    padding: "12px",
    border: "1px solid rgba(255, 255, 255, 0.4)", // Light border with transparency
    borderRadius: "8px",
    width: "100%",
    fontSize: "14px",
    backdropFilter: "blur(5px)", // Apply slight blur behind the input field
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Transparent background for the input
    color: "#fff", // Text color to make it readable on a light background
    outline: "none", // Remove default outline
  };

  const textareaStyle = {
    padding: "12px",
    border: "1px solid rgba(255, 255, 255, 0.4)", // Light border with transparency
    borderRadius: "8px",
    width: "100%",
    fontSize: "14px",
    resize: "vertical",
    backdropFilter: "blur(5px)", // Apply slight blur behind the textarea
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Transparent background for the textarea
    color: "#fff", // Text color to make it readable on a light background
    outline: "none", // Remove default outline
  };

  const buttonStyle = {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s",
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: "#0056b3",
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
    width: "300px",
  };

  const closeButtonStyle = {
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: "18px",
    cursor: "pointer",
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center' }}>
      <h1 style={{ color: "#fff", marginBottom: '20px' }}>Contact Us</h1>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div>
          <label style={{ color: "#fff" }}>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} />
        </div>
        <div>
          <label style={{ color: "#fff" }}>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} />
        </div>
        <div>
          <label style={{ color: "#fff" }}>Message</label>
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
