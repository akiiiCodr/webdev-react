import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Authenticate the user via an API endpoint
      const response = await axios.post('/api/auth/login', { username, password });

      if (response.data.success) {
        // Redirect to user screen upon successful login
        window.location.href = '/user-screen';
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials and try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      // Simulate Google sign-in process
      const user = { username: 'GoogleUser', email: 'googleuser@example.com' };

      // Save user data to the database via an API endpoint
      await axios.post('/api/auth/google-login', user);

      // Redirect the user to the desired page, e.g., '/user-screen'
      window.location.href = '/user-screen';
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      alert("Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="login-section">
      <div className="login-box">
        <h1>Dwell-o</h1>
        <p>A Better Way to Dwell</p>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
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
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              textAlign: 'center',
              textDecoration: 'none',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Log In
          </button>
        </form>

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleSignIn}
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: 'teal',
            color: 'black',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Sign in with Google
        </button>

        {/* Sign Up Link */}
        <p className="signup-text">
          Don't have an account?{' '}
          <Link to="/signup" className="menu-item">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
