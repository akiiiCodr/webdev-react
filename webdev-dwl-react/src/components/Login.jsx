import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import GoogleAuth from "./GoogleAuth";
import UserInfo from "./UserInfo";
import Logout from "./Logout";
import ToastNotification from "./ToastNotification";
import BGM from "../assets/gradient-image.svg";
import { useAuth } from './AuthContext.jsx'; // Import AuthProvider

function Login({ isLoggedIn }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameOrEmail, setUsernameOrEmail] = useState("");  // Renamed to handle both username and email
  const [password, setPassword] = useState("");
  const { setIsLoggedIn } = useAuth(); // Use setIsLoggedIn to update login state
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [loginType, setLoginType] = useState("user"); // New state to handle login type (tenant or user)
  const navigate = useNavigate();
  const [tenants, setTenants] = useState([]);


// Fetch tenants on component mount
useEffect(() => {
  const fetchTenants = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/tenants");
      if (response.status === 200) {
        setTenants(response.data.tenants); // Assuming the API response has a 'tenants' field
      } else {
        console.error("Failed to fetch tenants: Invalid response status");
      }
    } catch (error) {
      console.error("Error fetching tenants:", error);
    }
  };

    fetchTenants();

    // Apply background image to the body of the page
    document.body.style.backgroundImage = `url(${BGM})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.minHeight = "100vh";

    return () => {
      // Clean up background styles when component is unmounted
      document.body.style.backgroundImage = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundPosition = "";
      document.body.style.backgroundRepeat = "";
      document.body.style.minHeight = "";
    };
  }, []); // Empty dependency array ensures it runs only on mount

  const handleLogin = async (e) => {
    e.preventDefault();

    // Check if the login is for admin
    if (usernameOrEmail === "eaptadmin" && password === "eaptadmin") {
      setIsLoggedIn(true); // Set the user as logged in(true);

      setToastMessage("Admin login successful! Redirecting...");
      setToastType("success");

      setTimeout(() => {
        navigate('/admin255');
      }, 2000);
      return;
    }

    // Ensure both username/email and password are provided
    if (!usernameOrEmail || !password) {
      setToastMessage("Please enter both username/email and password.");
      setToastType("error");
      return;
    }

    if (loginType === "tenant") {
      // Tenant login logic
      try {
        const tenantResponse = await axios.post(
          `http://localhost:5001/api/login/?username=${usernameOrEmail}&password=${password}`
        );

        if (tenantResponse.data.tenant) {
          const { tenant_id, username } = tenantResponse.data.tenant;

          setIsLoggedIn(true); // Set the user as logged in(true);
          localStorage.setItem("tenant_id", tenant_id);
          localStorage.setItem("tenant_username", username);

          setToastMessage("Tenant login successful! Redirecting...");
          setToastType("success");

          setTimeout(() => {
            navigate(`/tenant/${tenant_id}/${username}`);
          }, 2000);
        } else {
          setToastMessage("Tenant login failed. Please check your credentials.");
          setToastType("error");
          setIsLoggedIn(false); // Set the user as logged in to (false);
        }
      } catch (tenantError) {
        console.error("Tenant login failed:", tenantError);
        setToastMessage("Tenant login failed. Please check your credentials.");
        setToastType("error");
        setIsLoggedIn(false); // Set the user as logged in to (false);
      }
    } else {
      // Regular user login logic
      try {
        const accountResponse = await axios.post("http://localhost:5001/account/login", {
          usernameOrEmail,
          password,
        });

        if (accountResponse.status === 200) {
          const { username } = accountResponse.data;

          setIsLoggedIn(true); // Set the user as logged in
          localStorage.setItem("user_username", username);

          setToastMessage("User login successful! Redirecting...");
          setToastType("success");

          setTimeout(() => {
            navigate(`/`);
          }, 2000);
        } else {
          setToastMessage("Account login failed. Please try again.");
          setToastType("error");
        }
      } catch (accountError) {
        console.error("Account login failed:", accountError);
        setToastMessage("Account login failed. Please check your credentials.");
        setToastType("error");
        setIsLoggedIn(false);
      }
    }
  };


  return (
    <>


      {/* Login Section */}
      <div className="login-section">
        <div className="login-box">
          <h1>Dwell-o</h1>
          <p>A Better Way to Dwell</p>

        {!isAuthenticated || !isLoggedIn ? (
          <>
            <form method="POST" onSubmit={handleLogin} style={formStyle}>
              {/* Select for tenant or user login */}
              <div className="form_login_type" style={{ marginBottom: '16px' }}>
                <select
                  value={loginType}
                  onChange={(e) => setLoginType(e.target.value)}
                  style={selectStyle}
                >
                  <option style={{ color: "black" }} value="user">Regular User</option>
                  <option style={{ color: "black" }} value="tenant">Tenant</option>
                </select>
              </div>

              {/* Floating Label for Username or Email */}
              <div className="form_email_username" style={{ marginBottom: '16px', position: 'relative' }}>
                <input
                  className="input__email"
                  type="text"
                  placeholder=""
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  required
                />
                <label className="username_email__label">
                  Username or Email
                </label>
              </div>

              {/* Floating Label for Password */}
              <div className="form_password" style={{ marginBottom: '16px', position: 'relative' }}>
                <input
                  className="input__password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder=""
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label className="password_label">
                  Password
                </label>
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    color: '#fff',
                    fontSize: '20px',
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <Link to="/forgot-password" className="forgot-password" style={forgotPasswordStyle}>
                Forgot password?
              </Link>

            <Link
              to="/user-screen" // Update the link to a valid route in your app
              className="login-button"
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                textAlign: 'center',
                textDecoration: 'none',
                borderRadius: '5px',
              }}
            >
              Log In
            </Link>
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
      {/* Automatically rendered toast */}
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
  minHeight: '100vh',
  backdropFilter: 'blur(10px)', 
  backgroundColor: 'rgba(0, 0, 0, 0.4)', 
};

const loginBoxStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.12)', 
  backdropFilter: 'blur(10px)', 
  padding: '30px',
  borderRadius: '15px',
  width: '100%',
  maxWidth: '500px',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const formStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.4)', 
  backdropFilter: 'blur(10px)', 
  padding: '30px',
  borderRadius: '15px',
  width: '100%',
  maxWidth: '500px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  margin: 'auto',
};

const selectStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: '#fff',
  fontSize: '16px',
  marginBottom: '16px',
};

const buttonStyle = {
  display: 'inline-block',
  padding: '12px 20px',
  backgroundColor: '#007bff',
  color: 'white',
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

const googleAuthContainerStyle = {
  marginTop: '20px',
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
};

const signupTextStyle = {
  color: '#fff',
};

export default Login;