import React, { useState, useRef } from "react";

const FAQs = () => {
  const [openQuestion, setOpenQuestion] = useState(null);
  const [activeSection, setActiveSection] = useState(null); // To track the active sidebar item
  const sectionsRefs = {
    AccountManagement: useRef(null),
    BookingDetails: useRef(null),
    Cancellation: useRef(null),
    PaymentRefund: useRef(null),
    ChangeBookingDates: useRef(null),
    ManageGuest: useRef(null),
    BookingConfirmation: useRef(null),
    SpecialRequests: useRef(null),
    PropertyQuestions: useRef(null),
    CustomerService: useRef(null),
  };

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const scrollToSection = (section) => {
    setActiveSection(section); // Set the active section
    sectionsRefs[section].current.scrollIntoView({ behavior: "smooth" });
  };

  const styles = {
    app: {
      display: "flex",
    },
    sidebar: {
      width: "250px",
      background: "#f4f4f4",
      padding: "20px",
      position: "sticky",
      top: "0",
      height: "100vh",
    },
    sidebarList: {
      listStyle: "none",
      padding: "0",
    },
    sidebarListItem: {
      margin: "10px 0",
      cursor: "pointer",
      padding: "10px",
      borderRadius: "5px",
      transition: "background-color 0.3s",
    },
    activeSidebarListItem: {
      backgroundColor: "#fff",
      color: "blue",
    },
    content: {
      flex: "1",
      padding: "20px",
    },
    faq: {
      maxWidth: "600px",
      margin: "0 auto",
    },
    faqItem: {
      marginBottom: "15px",
    },
    faqQuestion: {
      cursor: "pointer",
      padding: "10px",
      background: "#f0f0f0",
      border: "1px solid #ccc",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    arrow: {
      marginLeft: "10px",
    },
    faqAnswer: {
      padding: "10px",
      border: "1px solid #ccc",
      borderTop: "none",
      background: "#f9f9f9",
    },
    sectionTitle: {
        marginBottom: "20px", // Adds space between category and questions
    },
  };

  const faqData = {
    AccountManagement: [
      { question: "How do I create an account?", answer: "To create an account, click on the Sign-Up button on the homepage and follow the instructions." },
      { question: "How do I change my Password?", answer: "Go to Account Settings and click on 'Change Password' to update your password." },
    ],
    BookingDetails: [
      { question: "How can I view my booking details?", answer: "Log in to your account and navigate to 'My Bookings' to view your booking details." },
      { question: "Can I add special requests to my booking?", answer: "Yes, you can add special requests during the booking process or contact the property directly." },
    ],
    Cancellation: [
      { question: "How can I cancel my booking?", answer: "To cancel your booking, log in to your account, navigate to 'My Bookings,' select the booking you want to cancel, and click 'Cancel Booking.'" },
      { question: "Will I get a refund if I cancel?", answer: "Refunds depend on the cancellation policy of the property. Check the cancellation terms in your booking confirmation." },
    ],
    PaymentRefund: [
      { question: "What payment methods are accepted?", answer: "We accept Gcash, Maya, and in some cases, local payment methods." },
      { question: "How long does it take to receive a refund?", answer: "Refunds typically take 5–10 business days to process, depending on your payment method." },
    ],
    ChangeBookingDates: [
      { question: "How do I change my booking dates?", answer: "Log in to your account, go to 'My Bookings,' select the booking you want to modify, and click 'Change Dates.'" },
      { question: "Will I be charged extra for changing dates?", answer: "Any additional charges depend on the property’s policy. Check the updated price before confirming the change." },
    ],
    ManageGuest: [
      { question: "How do I add additional guests to my booking?", answer: "Go to 'My Bookings,' select the booking, and click 'Edit Guest Information' to add more guests." },
      { question: "Are there limits to the number of guests per room?", answer: "Yes, each room has a maximum occupancy. Check the property details or contact the property directly." },
    ],
    BookingConfirmation: [
      { question: "How do I know if my booking is confirmed?", answer: "Once your booking is confirmed, you will receive a confirmation email with the booking details." },
      { question: "What should I do if I don’t receive a confirmation email?", answer: "Check your spam folder. If it’s not there, log in to your account and check your bookings or contact support." },
    ],
    SpecialRequests: [
      { question: "Can I request an early check-in or late check-out?", answer: "Early check-ins and late check-outs are subject to availability and the property’s policy." },
      { question: "Are special requests guaranteed?", answer: "Special requests are not guaranteed but are subject to availability at the property." },
    ],
    PropertyQuestions: [
      { question: "How do I contact the property directly?", answer: "You can find the property’s contact details in your booking confirmation email." },
      { question: "Can I ask for a room upgrade?", answer: "Room upgrades are subject to availability. Contact the property directly to inquire." },
    ],
    CustomerService: [
      { question: "How do I reach customer service?", answer: "You can contact customer service through our support page or by calling the helpline listed on our website." },
    ],
  };

  const FAQSection = ({ title, questions, sectionRef }) => (
    <div ref={sectionRef}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      {questions.map((item, index) => (
        <div 
            key={index} 
            style={styles.faqItem}>
          <div style={styles.faqQuestion} onClick={() => toggleQuestion(`${title}-${index}`)}>
            {item.question}
            <span style={styles.arrow}>{openQuestion === `${title}-${index}` ? "▲" : "▼"}</span>
          </div>
          {openQuestion === `${title}-${index}` && <div style={styles.faqAnswer}>{item.answer}</div>}
        </div>
      ))}
    </div>
  );

  return (
    <div style={styles.app}>
      <div style={styles.sidebar}>
        <ul style={styles.sidebarList}>
          {Object.keys(faqData).map((key) => (
            <li
              key={key}
              style={{
                ...styles.sidebarListItem,
                ...(activeSection === key ? styles.activeSidebarListItem : {}),
              }}
              onClick={() => scrollToSection(key)}
            >
              {key.replace(/([A-Z])/g, " $1").trim()}
            </li>
          ))}
        </ul>
      </div>
      <div style={styles.content}>
        <div style={styles.faq}>
          {Object.entries(faqData).map(([key, questions]) => (
            <FAQSection
              key={key}
              title={key.replace(/([A-Z])/g, " $1").trim()}
              questions={questions}
              sectionRef={sectionsRefs[key]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQs;
