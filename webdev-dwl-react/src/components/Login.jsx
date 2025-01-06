// Full component (as shared earlier with updated `handleLogin` function)
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import GoogleAuth from "./GoogleAuth";
import UserInfo from "./UserInfo";
import Logout from "./Logout";
import ToastNotification from "./ToastNotification";

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

  return (
    <div className="login-section">
      <div className="login-box">
        <h1>Dwell-o</h1>
        <p>A Better Way to Dwell</p>

        {!isAuthenticated ? (
          <>
            <form method="POST" onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Enter at least 8+ characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>

              <button
                type="submit"
                className="login-button"
                style={{
                  display: "inline-block",
                  padding: "10px 20px",
                  backgroundColor: "#007bff",
                  color: "white",
                  textAlign: "center",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Log In
              </button>
            </form>

            <GoogleAuth />

            <p className="signup-text">
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

        {toastMessage && (
          <ToastNotification
            message={toastMessage}
            type={toastType}
            onClose={() => setToastMessage("")}
          />
        )}
      </div>
    </div>
  );
}

export default Login;
