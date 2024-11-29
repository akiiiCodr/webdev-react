import React, { useState } from 'react';
import Bot from './Bot'; // Ensure the correct path to your Bot component

function Content() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen((prevIsChatOpen) => !prevIsChatOpen);
  };

  return (
    <div className="reviews-container">
      {/* Top Image Gallery */}
      <div className="image-gallery">
        <div className="image-placeholder"></div>
        <div className="image-placeholder"></div>
        <div className="image-placeholder"></div>
        <div className="image-placeholder"></div>
      </div>

      {/* Message Icon */}
      <div
        className="message-icon"
        aria-label="Messages"
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

      {/* Bot Component - Only show if chat is open */}
      {isChatOpen && <Bot />}
    </div>
  );
}

export default Content;
