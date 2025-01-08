import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { FaPaperPlane, FaEnvelope } from "react-icons/fa"; // Import send icon

// Create a socket connection
const socket = io("http://localhost:5001");

function Bot() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Listen for incoming messages from the server
    socket.on("newMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Event listener for clicks outside the chat container
    const handleOutsideClick = (e) => {
      if (isChatOpen && chatContainerRef.current && !chatContainerRef.current.contains(e.target)) {
        setIsChatOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    // Cleanup to remove event listener on component unmount
    return () => {
      socket.off("newMessage");
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isChatOpen]);

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSend = async () => {
    if (inputMessage.trim()) {
      try {
        // Prepare the message data
        const messageData = { name: "User", message: inputMessage };

        // Send the message to the backend
        await fetch("http://localhost:5001/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "User",
            message: inputMessage,
          }),
        });

        // Emit message to WebSocket for real-time updates
        socket.emit("sendMessage", messageData);

        // Clear the input fields after sending the message
        setInputMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const toggleChat = () => {
    setIsChatOpen((prevIsChatOpen) => !prevIsChatOpen);
  };

  return (
    <>
      {/* Chat icon */}
      {!isChatOpen && (
        <div
          className="chat-icon"
          onClick={toggleChat}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "80px",
            height: "80px",
            color: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "50%",
            cursor: "pointer",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            
          }}
        >
          <FaEnvelope style={{ fontSize: "40px" }} /> {/* FaMail icon */}
        </div>
      )}


      {/* Chat window */}
      {isChatOpen && (
        <div
          ref={chatContainerRef}
          className="bot-container"
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "300px",
            padding: "10px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(10px)", // Glassmorphism effect
            background: "rgba(255, 255, 255, 0.2)", // Transparent white background
            border: "1px solid rgba(255, 255, 255, 0.3)", // Light border for the frosted glass look
          }}
        >
          <h2 style={{ color: "#fff" }}>Dwell-o</h2>
          <div
            className="chat-window"
            style={{
              maxHeight: "300px",
              overflowY: "auto",
              marginBottom: "10px",
              padding: "5px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              background: "rgba(255, 255, 255, 0.1)", // Slightly more transparent chat window
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className="chat-message"
                style={{
                  marginBottom: "5px",
                  padding: "5px",
                  backgroundColor: msg.sender === "bot" ? "#e0e0e0" : "#f1f1f1",
                  borderRadius: "5px",
                }}
              >
                <p>
                  <strong>{msg.name || "user"}:</strong> {msg.message}
                </p>
              </div>
            ))}
          </div>
          <div className="input-area" style={{ display: "flex", gap: "5px", position: "relative" }}>
            <input
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              placeholder="Type a message..."
              style={{
                flex: "1",
                padding: "10px 30px 10px 10px", // Add padding to the right to make space for the icon
                border: "1px solid #ddd",
                borderRadius: "3px",
                backgroundColor: "rgba(255, 255, 255, 0.2)", // Glassmorphism input background
                color: "#fff", // White text
                position: "relative", // For positioning the icon
              }}
            />
            {/* Send button with icon inside the input field */}
            <button
              onClick={handleSend}
              style={{
                position: "absolute",
                right: "10px", // Position the button inside the input field
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "transparent",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              <FaPaperPlane style={{ fontSize: "20px" }} /> {/* Send icon */}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Bot;
