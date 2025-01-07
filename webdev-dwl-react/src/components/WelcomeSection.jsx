import React, { useState } from 'react';
import { FaCamera, FaRegBell, FaWifi, FaBolt, FaTint, FaMoneyBill, FaHome, FaBed } from 'react-icons/fa';

const cardContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '20px',
  justifyContent: 'center',
  marginTop: '20px',
};

const baseCardStyle = {
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '20px',
  width: '300px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent background
  backdropFilter: 'blur(10px)', // Apply blur effect for glass look
  transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Transition for smooth hover effect
};

const iconStyle = {
  fontSize: '40px',
  color: '#000',
  marginBottom: '10px',
};

const WelcomeSection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredCard(index);
  };

  const handleMouseLeave = () => {
    setHoveredCard(null);
  };

  const getCardStyle = (index) => {
    return hoveredCard === index
      ? { ...baseCardStyle, transform: 'scale(1.05)', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)' }
      : baseCardStyle;
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', fontSize: '36px', fontWeight: 'bold' }}>Welcome to Dwell-o</h1>
      <p style={{ textAlign: 'center', fontSize: '18px', margin: '10px 0' }}>
        Our dormitory provides a comfortable and convenient living space for all students. With spacious rooms, modern
        amenities, and a friendly community, you’ll feel right at home. Explore the different areas of our dorm and
        discover everything we have to offer!
      </p>

      <div style={cardContainerStyle}>
        {/* Affordable and Secure */}
        <div
          style={getCardStyle(0)}
          onMouseEnter={() => handleMouseEnter(0)}
          onMouseLeave={handleMouseLeave}
        >
          <FaHome style={iconStyle} />
          <h2 style={{ fontSize: '22px', color: '#000', fontWeight: 'bold' }}>Affordable and Secure</h2>
          <p style={{ textAlign: 'justify', color: '#000' }}>
            Welcome to a boarding house designed for comfort, convenience, and affordability. Perfect for students or
            professionals, this space provides everything you need for a worry-free stay.
          </p>
        </div>

        {/* Safety and Security */}
        <div
          style={getCardStyle(1)}
          onMouseEnter={() => handleMouseEnter(1)}
          onMouseLeave={handleMouseLeave}
        >
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px' }}>
            <FaCamera style={{ ...iconStyle, marginRight: '20px' }} /> {/* Camera icon */}
            <FaRegBell style={{ ...iconStyle, marginLeft: '20px' }} /> {/* Fire alarm icon */}
          </div>
          <h2 style={{ fontSize: '22px', color: '#000', fontWeight: 'bold' }}>Safety and Security</h2>
          <p style={{ textAlign: 'justify', color: '#000' }}>
            <strong>CCTV Monitoring:</strong> 24/7 surveillance ensures a safe environment for all tenants.
          </p>
          <p style={{ textAlign: 'justify', color: '#000' }}>
            <strong>Fire Alarms:</strong> Strategically placed for emergencies, ensuring everyone’s safety.
          </p>
        </div>

        {/* Utilities and Services */}
        <div
          style={getCardStyle(2)}
          onMouseEnter={() => handleMouseEnter(2)}
          onMouseLeave={handleMouseLeave}
        >
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px' }}>
            <FaWifi style={{ ...iconStyle, marginRight: '20px' }} /> {/* Wi-Fi icon */}
            <FaTint style={{ ...iconStyle }} /> {/* Water icon */}
            <FaBolt style={{ ...iconStyle, marginLeft: '15px' }} /> {/* Power icon */}
          </div>
          <h2 style={{ fontSize: '22px', color: '#000', fontWeight: 'bold', textAlign: 'center' }}>Utilities and Services</h2>
          <p style={{ textAlign: 'justify', color: '#000' }}>
            <strong>Internet Service:</strong> Stay connected with reliable Wi-Fi available throughout the property.
          </p>
          <p style={{ textAlign: 'justify', color: '#000' }}>
            <strong>Continuous Water Supply:</strong> Enjoy uninterrupted access to clean water.
          </p>
          <p style={{ textAlign: 'justify', color: '#000' }}>
            <strong>Stable Power Supply:</strong> A reliable power source for all your needs is guaranteed.
          </p>
        </div>

        {/* Affordable Rent */}
        <div
          style={getCardStyle(3)}
          onMouseEnter={() => handleMouseEnter(3)}
          onMouseLeave={handleMouseLeave}
        >
          <FaMoneyBill style={iconStyle} />
          <h2 style={{ fontSize: '22px', color: '#000', fontWeight: 'bold' }}>Affordable Rent</h2>
          <p style={{ textAlign: 'justify', color: '#000' }}>
            <strong>₱1,300 per month per tenant:</strong> Includes water bill and other utilities, but does not cover
            Wi-Fi and electricity. Budgeting is simple and hassle-free.
          </p>
        </div>

        {/* Accommodation Details */}
        <div
          style={getCardStyle(4)}
          onMouseEnter={() => handleMouseEnter(4)}
          onMouseLeave={handleMouseLeave}
        >
          <FaBed style={iconStyle} />
          <h2 style={{ fontSize: '22px', color: '#000', fontWeight: 'bold' }}>Accommodation Details</h2>
          <p style={{ textAlign: 'justify', color: '#000' }}>
            <strong>2 Units Available:</strong> Each unit is thoughtfully designed to meet the needs of its occupants.
          </p>
          <p style={{ textAlign: 'justify', color: '#000' }}>
            <strong>2 Bathrooms in each unit:</strong> For shared convenience.
          </p>
          <p style={{ textAlign: 'justify', color: '#000' }}>
            <strong>2 Rooms Per Unit:</strong>
            <br />
            Room 1: Comfortable space for up to 4 people.
            <br />
            Room 2: Spacious enough to accommodate up to 6 people.
          </p>
        </div>

        <p style={{ textAlign: 'center', fontSize: '18px', margin: '10px 0', color: '#000' }}>
          This boarding house combines practicality with affordability, ensuring a safe and comfortable living experience. 
          Secure your spot now and enjoy all the amenities included at an unbeatable price!
        </p>
      </div>
    </div>
  );
};

export default WelcomeSection;
