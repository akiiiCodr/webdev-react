import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx'; // Import the Header component
import Footer from './components/Footer.jsx'; // Import the Footer component
import Content from './components/Content.jsx'; // Import the main Content component
import Signup from './components/Signup.jsx'; // Import the SignUp component
import Login from './components/Login.jsx'; // Import the Login component

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
        </Routes>

        {/* Footer is static across pages */}
        <Footer />
      </>
    </Router>
  );
}

export default App;
