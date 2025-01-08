import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import GoogleAuth from "./GoogleAuth";
import UserInfo from "./UserInfo";
import Logout from "./Logout";
import ToastNotification from "./ToastNotification";
import BGM from "../assets/gradient-image.svg";

function Login() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setToastMessage("Please enter both username and password.");
      setToastType("error");
      return;
    }

    try {
      const accountResponse = await axios.post("http://localhost:5001/account/login", {
        username,
        password,
      });

      if (accountResponse.status === 200) {
        const { tenant_id, username } = accountResponse.data;

        setLoggedIn(true);
        localStorage.setItem("tenant_id", tenant_id);
        localStorage.setItem("tenant_username", username);

        setToastMessage("Login successful! Redirecting...");
        setToastType("success");

        setTimeout(() => {
          navigate(`/`);
        }, 2000);
      } else {
        setToastMessage("Account login failed. Trying tenant login...");
        setToastType("error");
      }
    } catch (accountError) {
      console.error("Account login failed:", accountError);

      try {
        const tenantResponse = await axios.get(
          `http://localhost:5001/api/login?username=${username}&password=${password}`
        );

        if (tenantResponse.data.success && tenantResponse.data.loggedIn) {
          const { tenant_id, username } = tenantResponse.data.tenant;

          setLoggedIn(true);
          localStorage.setItem("tenant_id", tenant_id);
          localStorage.setItem("tenant_username", username);

          setToastMessage("Login successful! Redirecting...");
          setToastType("success");

          setTimeout(() => {
            navigate(`/tenant/${tenant_id}/${username}`);
          }, 2000);
        } else {
          setToastMessage(tenantResponse.data.message || "Login failed. Please try again.");
          setToastType("error");
          setLoggedIn(false);
        }
      } catch (tenantError) {
        console.error("Tenant login failed:", tenantError);
        setToastMessage("Both login attempts failed. Please check your credentials.");
        setToastType("error");
        setLoggedIn(false);
      }
    }
  };

  useEffect(() => {
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

  return (
    <div className="login-section" style={loginSectionStyle}>
      <div className="login-box" style={loginBoxStyle}>
        <h1>Dwell-o</h1>
        <p>A Better Way to Dwell</p>

        {!isAuthenticated ? (
          <>
            <form method="POST" onSubmit={handleLogin} style={formStyle}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={inputStyle}
              />
              <input
                type="password"
                placeholder="Enter at least 8+ characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={inputStyle}
              />
              <Link to="/forgot-password" className="forgot-password" style={forgotPasswordStyle}>
                Forgot password?
              </Link>

              <button
                type="submit"
                className="login-button"
                style={buttonStyle}
              >
                Log In
              </button>
            </form>

            <div style={googleAuthContainerStyle}>
              <GoogleAuth />
            </div>

            <p className="signup-text" style={signupTextStyle}>
              Don't have an account?{" "}
              <Link to="/signup" className="menu-item">
                Sign Up
              </Link>
            </p>
          </>
        ) : (
          <>
            <UserInfo />
            <Logout onLogout={() => setIsAuthenticated(false)} />
          </>
        )}

        
      </div>
      {toastMessage && (
          <ToastNotification
            message={toastMessage}
            type={toastType}
            onClose={() => setToastMessage("")}
          />
        )}
    </div>
  );
}

// Glassmorphism Styles
const loginSectionStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh', // Ensure the container takes full viewport height
  backdropFilter: 'blur(10px)', // Frosted glass effect
  backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent background for glassmorphism
};

const loginBoxStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.12)', // Semi-transparent background
  backdropFilter: 'blur(10px)', // Frosted glass effect
  padding: '30px',
  borderRadius: '15px',
  width: '100%',
  maxWidth: '500px',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)', // Enhanced box-shadow for stronger glass effect
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center', // Center content horizontally
};

const formStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.4)', // Darker, semi-transparent background for glassmorphism
  backdropFilter: 'blur(10px)', // Frosted glass effect
  padding: '30px',
  borderRadius: '15px',
  width: '100%',
  maxWidth: '500px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  margin: 'auto',
};

const inputStyle = {
  padding: '12px 20px',
  margin: '10px 0',
  borderRadius: '8px',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent background for inputs
  color: '#fff',
  outline: 'none',
  fontSize: '16px',
  transition: 'border-color 0.3s ease',
};

const buttonStyle = {
  padding: '12px 20px',
  backgroundColor: '#007bff',
  color: 'white',
  textAlign: 'center',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
};

const forgotPasswordStyle = {
  color: '#fff',
  textDecoration: 'none',
  fontSize: '14px',
};

const signupTextStyle = {
  color: '#fff',
};

const googleAuthContainerStyle = {
  marginTop: '20px', // Add some space between the form and GoogleAuth button
  display: 'flex',
  justifyContent: 'center', // Center GoogleAuth horizontally
  width: '100%',
};

export default Login;
