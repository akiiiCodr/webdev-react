import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

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
        // Emit message to WebSocket for real-time updates
        socket.emit("sendMessage", { name: "User", message: inputMessage });

        // Send the message to the backend `/send` endpoint
        await fetch("http://localhost:5001/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "", // Replace with a dynamic name if needed
            email: "user@example.com", // Optional
            message: inputMessage,
          }),
        });

        setInputMessage(""); // Clear the input field
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
            width: "50px",
            height: "50px",
            backgroundColor: "#007BFF",
            color: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "50%",
            cursor: "pointer",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          ✉️
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
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2>Dwell-o</h2>
          <div
            className="chat-window"
            style={{
              maxHeight: "200px",
              overflowY: "auto",
              marginBottom: "10px",
              padding: "5px",
              border: "1px solid #ddd",
              borderRadius: "5px",
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
                  <strong>{msg.name || "Bot"}:</strong> {msg.message}
                </p>
              </div>
            ))}
          </div>
          <div className="input-area" style={{ display: "flex", gap: "5px" }}>
            <input
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              placeholder="Type a message..."
              style={{
                flex: "1",
                padding: "5px",
                border: "1px solid #ddd",
                borderRadius: "3px",
              }}
            />
            <button
              onClick={handleSend}
              style={{
                padding: "5px 10px",
                backgroundColor: "#007BFF",
                color: "#fff",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Bot;
