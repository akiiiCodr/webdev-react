import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx'; // Import the Header component
import Footer from './components/Footer.jsx'; // Import the Footer component
import Content from './components/Content.jsx'; // Import the main Content component
import Signup from './components/Signup.jsx'; // Import the SignUp component
import Login from './components/Login.jsx'; // Import the Login component
import Reservation from './components/Reservation.jsx'; // Import the Reservation and Payment
import Admin from './components/Admin.jsx'; // Import the Admin
import Contact from './components/Contact.jsx'; // Import the Contact
import TenantLounge from './components/TenantLounge.jsx';


function App() {
  return (
    <Router>
      <>
        {/* Header is static across pages */}
        <Header/>


        <Routes>
          {/* Default Content */}
          <Route path="/" element={<Content/>} />

          {/* SignUp Page */}
          <Route path="/signup" element={<Signup/>} />

          {/* Login Page */}
          <Route path="/login" element={<Login/>} />

          {/* Payment Page */}
          <Route path="/book-a-room" element={<Reservation/>} />

          {/* Admin Page - Forbidden 'Note: Do not add this as front-end it should be hidden'*/}
          <Route path="/admin255" element={<Admin/>} />

          {/* Contact Page */}
          <Route path="/contact-us" element={<Contact/>} />

          {/* Tenant Page */}
          <Route path="/tenant/:tenant_id/:username" element={<TenantLounge />} />


        </Routes>

        {/* Footer is static across pages */}
        <Footer />
      </>
    </Router>
  );
}

export default App;
