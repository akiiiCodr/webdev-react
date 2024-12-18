// Import required packages
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';
import mysql from 'mysql2/promise';
import { google } from 'googleapis';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import crypto from 'crypto';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Setup for Google OAuth2
const GOOGLE_CLIENT_ID = process.env.CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.REDIRECT_URI;

const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);
const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

// Setup Express server
const app = express();
const server = createServer(app);

// Middleware to ensure only application/json is accepted
const jsonContentTypeMiddleware = (req, res, next) => {
  if (req.headers['content-type'] !== 'application/json') {
    return res.status(400).json({ error: 'Only application/json content type is allowed' });
  }
  next();
};


app.use(cors({
  origin: ['http://localhost:5173'], // Allow both frontend URLs
  methods: ['GET', 'POST', 'OPTIONS', 'PUT'],
  credentials: true,
}));


// Initialize Socket.IO with the HTTP server instance
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Replace with your frontend's URL for security
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(express.json());
app.use(cookieParser());

// Port configuration
const PORT = 5001;

// Store the last message and bot's state
let lastMessage = '';
let isBotResponding = false;

// Database connection setup
const dbConfig = {
  host: 'localhost',
  user: 'root', // Change this as needed
  password: '', // Add your MySQL password if any
  database: 'dwll_react', // Replace with your database name
};

let dbConnection;

const initializeDatabase = async () => {
  try {
    dbConnection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL database successfully');

    // Create users table if it doesn't exist
    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        googleId VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255) NULL,
        email VARCHAR(255) NULL,
        picture VARCHAR(255) NULL,
        tokens TEXT NULL,
        isActive BOOLEAN DEFAULT false,
        sessionToken VARCHAR(255) NULL
      );
    `;
    await dbConnection.execute(createUsersTableQuery);
    console.log('Users table created or already exists');

    // Create tenants table if it doesn't exist
    const createTenantsTableQuery = `
      CREATE TABLE IF NOT EXISTS tenants (
        tenant_id INT(11) AUTO_INCREMENT PRIMARY KEY,
        tenant_name VARCHAR(255) NOT NULL,
        birthday DATE NULL,
        email_address VARCHAR(255) NULL UNIQUE,
        guardian_name VARCHAR(255) NULL,
        home_address VARCHAR(255) NULL,
        rental_start DATE NULL,
        lease_end DATE NULL,
        contact_no VARCHAR(255) NOT NULL UNIQUE
      );
    `;
    await dbConnection.execute(createTenantsTableQuery);
    console.log('Tenants table created or already exists');

    // Get the maximum tenant_id value
    const [rows] = await dbConnection.execute('SELECT MAX(tenant_id) AS max_id FROM tenants');
    const maxId = rows[0].max_id || 0;

    // Set the new AUTO_INCREMENT value
    const newAutoIncrement = maxId + 1;

    // Construct and execute the ALTER TABLE query to adjust the AUTO_INCREMENT
    if (maxId > 0) {
      const alterTableQuery = `ALTER TABLE tenants AUTO_INCREMENT = ${newAutoIncrement}`;
      await dbConnection.execute(alterTableQuery);
      console.log('AUTO_INCREMENT for tenants table adjusted');
    }

  } catch (error) {
    console.error('Error connecting to the MySQL database:', error.message);
    process.exit(1); // Exit the process if database connection fails
  }
};




// Ensure database is initialized before starting the server
initializeDatabase().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error('Error initializing database:', error.message);
  process.exit(1);
});

// Function to send a message to Telegram
const sendMessageToTelegram = async (message, chatId) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const response = await axios.post(url, {
      chat_id: chatId,
      text: message,
    });
    return response.data.result.message_id;
  } catch (error) {
    console.error('Error sending message to Telegram:', error.message);
  }
};

// Function to delete a message in Telegram
const deleteMessage = async (chatId, messageId) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const url = `https://api.telegram.org/bot${botToken}/deleteMessage`;

  try {
    await axios.post(url, {
      chat_id: chatId,
      message_id: messageId,
    });
  } catch (error) {
    console.error('Error deleting message from Telegram:', error.message);
  }
};

// Set up the webhook URL for Telegram
const setWebhook = async () => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const webhookUrl = `${process.env.WEBHOOK}/telegram-webhook`;

  try {
    await axios.post(`https://api.telegram.org/bot${botToken}/setWebhook`, {
      url: webhookUrl,
    });
    console.log('Webhook set successfully');
  } catch (error) {
    console.error('Error setting webhook:', error.message);
  }
};

// Initialize webhook setup
setWebhook();

// OAuth2 authentication URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/gmail.readonly',
  ],
  redirect_uri: GOOGLE_REDIRECT_URI,
});

// Redirect to Google's OAuth2 login page
app.get('/auth', (req, res) => {
  res.redirect(authUrl);
});

app.get('/oauthcallbackdwl', async (req, res) => {
  const { code } = req.query;

  if (code) {
    try {
      // Exchange the code for tokens
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      const oauth2 = google.oauth2({
        version: 'v2',
        auth: oauth2Client,
      });

      // Get user info
      const userInfo = await oauth2.userinfo.get();
      const { id: googleId, name, email, picture } = userInfo.data;

      // Generate a session token or JWT
      const sessionToken = crypto.randomBytes(32).toString('hex');

      // Save user information in the database
      const query = `
        INSERT INTO users (
          googleId, name, email, picture, tokens, isActive, sessionToken
        )
        VALUES (?, ?, ?, ?, ?, true, ?)
        ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        email = VALUES(email),
        picture = VALUES(picture),
        tokens = VALUES(tokens),
        isActive = true,
        sessionToken = VALUES(sessionToken);
      `;
      await dbConnection.execute(query, [googleId, name, email, picture, JSON.stringify(tokens), sessionToken]);

      // Create a user data object to store in a cookie
      const userData = {
        googleId,
        name,
        email,
        picture,
        tokens: JSON.stringify(tokens),
      };

      // Set the session token and user data as cookies
      res.cookie('sessionToken', sessionToken, {
        httpOnly: true,
        secure: true, // Set to true if using HTTPS
        sameSite: 'Strict',
        maxAge: 3600000, // 1 hour
      });

      // Store user data as a JSON string in a cookie
      res.cookie('userData', JSON.stringify(userData), {
        httpOnly: true,
        secure: true, // Set to true if using HTTPS
        sameSite: 'Strict',
        maxAge: 3600000, // 1 hour
      });


      res.redirect(`http://localhost:5173/dashboard?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error('Error during OAuth callback:', error.message);
      res.status(500).send('Error during authorization');
    }
  } else {
    res.status(400).send('Authorization failed: Missing code');
  }
});


const authenticateUser = async (req, res, next) => {
  try {
    const sessionToken = req.cookies.sessionToken;
    if (!sessionToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const query = 'SELECT googleId, name, email, picture, isActive FROM users WHERE sessionToken = ? AND isActive = true';
    const [rows] = await dbConnection.execute(query, [sessionToken]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found or session inactive' });
    }

    req.user = rows[0]; // Add user info to the request object
    next();
  } catch (error) {
    console.error('Error authenticating user:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Apply middleware to routes that require authentication
app.use('/api/current-user', authenticateUser);




// Function to handle user deletion and update JSON in real-time
async function handleUserDeletion(googleid) {
  try {
    if (dbConnection) {
      const query = 'SELECT * FROM users WHERE googleId = ?';
      const [rows] = await dbConnection.execute(query, [googleid]);

      if (rows.length === 0) {
        console.log('User not found');
        return;
      }

      const updateQuery = 'UPDATE users SET isActive = false WHERE googleId = ?';
      await dbConnection.execute(updateQuery, [googleid]);

      console.log('User successfully deactivated');
    } else {
      console.error('Database connection not established');
    }
  } catch (error) {
    console.error('Error during user deactivation:', error.message);
  }
}

// Endpoint for handling user deletion
app.post('/delete', async (req, res) => {
  try {
    const { googleid } = req.body;

    if (googleid) {
      await handleUserDeletion(googleid);
      res.status(200).send('User deactivated');
    } else {
      res.status(400).send('Invalid request');
    }
  } catch (error) {
    console.error('Error handling deletion request:', error.message);
    res.status(500).send('Server error');
  }
});

app.post('/logout', async (req, res) => {
  try {
    // Retrieve the session token from the cookies
    const sessionToken = req.cookies.sessionToken;

    if (!sessionToken) {
      return res.status(400).json({ error: 'Session token is required' });
    }

    // Check if the session token exists in the database and if the user is active
    const query = 'SELECT isActive FROM users WHERE sessionToken = ?';
    const [rows] = await dbConnection.execute(query, [sessionToken]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found or invalid session token' });
    }

    if (rows[0].isActive !== 1) {
      return res.status(400).json({ message: 'User is not active or already logged out' });
    }

    // Update the user's isActive status to false and clear the session token
    const updateQuery = 'UPDATE users SET isActive = false, sessionToken = NULL WHERE sessionToken = ?';
    await dbConnection.execute(updateQuery, [sessionToken]);

    // Optionally, clear the session token cookie on the client side
    res.clearCookie('sessionToken', {
      httpOnly: true,
      secure: true, // Set to true if using HTTPS
      sameSite: 'Strict',
    });

    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});



app.get('/get-google-id', async (req, res) => {
  try {
    // Extract session token from the request (e.g., from a cookie or header)
    const sessionToken = req.cookies.sessionToken; // Adjust as needed if using a different method

    if (!sessionToken) {
      return res.status(401).json({ error: 'Unauthorized. Session token missing' });
    }

    // Query the database for the user's googleId based on the session token
    const query = 'SELECT googleId FROM users WHERE sessionToken = ? AND isActive = true';
    const [rows] = await dbConnection.execute(query, [sessionToken]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Google ID not found or session inactive' });
    }

    res.status(200).json({ googleId: rows[0].googleId });
  } catch (error) {
    console.error('Error fetching user googleId:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/get-session-token', async (req, res) => {
  try {
    // Assuming the 'userData' cookie contains a JSON string
    const userDataCookie = req.cookies.userData;

    if (!userDataCookie) {
      return res.status(401).json({ error: 'Unauthorized. User data not found' });
    }

    // Parse the JSON string to access user data
    const userData = JSON.parse(userDataCookie);

    // Extract the googleId
    const { googleId } = userData;

    if (!googleId) {
      return res.status(401).json({ error: 'Unauthorized. Google ID not found' });
    }

    // Query the database for the session token based on googleId
    const query = 'SELECT sessionToken FROM users WHERE googleId = ? AND isActive = true';
    const [rows] = await dbConnection.execute(query, [googleId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Session token not found or inactive' });
    }

    // Return the session token as a JSON response
    res.status(200).json({ sessionToken: rows[0].sessionToken });
  } catch (error) {
    console.error('Error fetching session token:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});


app.get('/api/current-user', (req, res) => {
  if (req.user) {
    res.status(200).json({
      user: req.user,

      message: 'User is authenticated',
    });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});




app.post('/api/tenants', async (req, res) => {
  try {
    const { 
      name = null, 
      birthday = null, 
      contactNo = null, 
      email = null, 
      guardianName = null, 
      homeAddress = null, 
      rentalStart = null, 
      leaseEnd = null 
    } = req.body;
    
    const query = `INSERT INTO tenants (tenant_name, birthday, contact_no, email_address, guardian_name, home_address, rental_start, lease_end)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    await dbConnection.execute(query, [name, birthday, contactNo, email, guardianName, homeAddress, rentalStart, leaseEnd]);
    res.status(201).json({ message: 'Tenant added successfully' });
  } catch (error) {
    console.error('Error adding tenant:', error);
    res.status(500).json({ error: 'Failed to add tenant' });
  }
});

app.get('/api/tenants/:tenantId', async (req, res) => {
  try {
    // Extract tenantId from the route parameters
    const { tenantId } = req.params;

    // Validate tenantId to ensure it's a number
    if (isNaN(tenantId)) {
      return res.status(400).json({ error: 'Invalid tenant ID provided' });
    }

    // Construct the query to fetch a specific tenant by tenant_id
    const query = 'SELECT * FROM tenants WHERE tenant_id = ?';
    const params = [tenantId];

    // Execute the query and wait for the result
    const [rows] = await dbConnection.execute(query, params);

    // Check if a tenant with the given ID exists
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    // Send the result as a JSON response
    res.status(200).json(rows[0]); // Send only the first record (should be unique due to the primary key)
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error fetching tenant by ID:', error);

    // Return a 500 status with an appropriate error message
    res.status(500).json({ error: 'Failed to fetch tenant' });
  }
});

app.get('/api/tenants', async (req, res) => {
  try {
    const { id } = req.query; // Use 'id' to filter the data
    let query = 'SELECT * FROM tenants';
    const params = [];

    if (id) {
      query += ' WHERE tenant_id = ?';
      params.push(id);
    }

    const [rows] = await dbConnection.execute(query, params);



    if (rows.length === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    res.status(200).json(rows); // Return the data as an array
  } catch (error) {
    console.error('Error fetching tenants:', error);
    res.status(500).json({ error: 'Failed to fetch tenants' });
  }
});




app.put('/api/tenants/editInfo', async (req, res) => {
  try {
    const {
      tenantId, // Unique identifier for the tenant
      name,
      birthday,
      email,
      guardianName,
      homeAddress,
      rentalStart,
      leaseEnd,
      contactNo, // Contact number to be updated
    } = req.body;

    // Validate that the tenantId is provided
    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID is required to update.' });
    }

    // Prepare the SQL query dynamically
    let updateQuery = 'UPDATE tenants SET ';
    const values = [];
    const updateFields = [];

    // Check for each field and add to the query and values array if it's provided
    if (name !== undefined) {
      updateFields.push('tenant_name = ?');
      values.push(name);
    }
    if (birthday !== undefined) {
      updateFields.push('birthday = ?');
      values.push(birthday);
    }
    if (email !== undefined) {
      updateFields.push('email_address = ?');
      values.push(email);
    }
    if (guardianName !== undefined) {
      updateFields.push('guardian_name = ?');
      values.push(guardianName);
    }
    if (homeAddress !== undefined) {
      updateFields.push('home_address = ?');
      values.push(homeAddress);
    }
    if (rentalStart !== undefined) {
      updateFields.push('rental_start = ?');
      values.push(rentalStart);
    }
    if (leaseEnd !== undefined) {
      updateFields.push('lease_end = ?');
      values.push(leaseEnd);
    }
    if (contactNo !== undefined) {
      updateFields.push('contact_no = ?');
      values.push(contactNo);
    }

    // If no fields were provided, return an error
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields provided to update.' });
    }

    // Combine the query with the updated fields and the WHERE clause
    updateQuery += updateFields.join(', ') + ' WHERE tenant_id = ?';
    values.push(tenantId); // Add the tenantId as the last value

    // Execute the query
    const [results] = await dbConnection.execute(updateQuery, values);

    if (results.affectedRows > 0) {
      res.status(200).json({ message: 'Tenant updated successfully.' });
    } else {
      res.status(404).json({ error: 'Tenant not found.' });
    }
  } catch (error) {
    console.error('Error updating tenant:', error);
    res.status(500).json({ error: 'Failed to update tenant.' });
  }
});


app.put('/api/tenants/terminateLease/:tenantId', async (req, res) => {
  const { tenantId } = req.params;
  const { terminationDate } = req.body;

  try {
    const updateQuery = `
      UPDATE tenants 
      SET lease_end = ? 
      WHERE tenant_id = ?
    `;
    const [result] = await dbConnection.execute(updateQuery, [terminationDate, tenantId]);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Lease terminated successfully.' });
    } else {
      res.status(404).json({ error: 'Tenant not found.' });
    }
  } catch (error) {
    console.error('Error updating tenant lease:', error);
    res.status(500).json({ error: 'Failed to terminate lease.' });
  }
});




