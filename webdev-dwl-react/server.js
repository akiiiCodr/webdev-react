// Import required packages
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";
import mysql from "mysql2/promise";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import crypto from "crypto";
import moment from "moment";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Directory to store files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Create a unique file name
  },
});

const upload = multer({ storage: storage });

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Setup for Google OAuth2
const GOOGLE_CLIENT_ID = process.env.CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.REDIRECT_URI;

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);
const gmail = google.gmail({ version: "v1", auth: oauth2Client });

// Setup Express server
const app = express();
const server = createServer(app);

// Middleware to ensure only application/json is accepted
const jsonContentTypeMiddleware = (req, res, next) => {
  if (req.headers["content-type"] !== "application/json") {
    return res
      .status(400)
      .json({ error: "Only application/json content type is allowed" });
  }
  next();
};

app.use(
  cors({
    origin: ["http://localhost:5173"], // Allow both frontend URLs
    methods: ["GET", "POST", "OPTIONS", "PUT"],
    credentials: true,
  })
);

// Initialize Socket.IO with the HTTP server instance
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Replace with your frontend's URL for security
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(express.json());
app.use(cookieParser());

// Port configuration
const PORT = 5001;

const dbConfig = {
  host: "localhost",
  user: "root", // Change this as needed
  password: "", // Add your MySQL password if any
  database: "dwll_react", // Replace with your database name
};

let dbConnection;

const initializeDatabase = async () => {
  try {
    // Connect to MySQL without specifying the database
    const initialConnection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
    });

    console.log("Connected to MySQL server successfully");

    // Check if the database exists, and create it if it doesn't
    await initialConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``
    );
    console.log(`Database '${dbConfig.database}' is ready.`);

    // Close the initial connection
    await initialConnection.end();

    // Connect to the specific database
    dbConnection = await mysql.createConnection(dbConfig);
    console.log("Connected to MySQL database successfully");

    // Create `users` table if it doesn't exist
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
    console.log("Users table created or already exists");

    // SQL query to create the payments table with payment status
    const createPaymentsTableQuery = `
    CREATE TABLE IF NOT EXISTS payments (
    payment_id VARCHAR(20) PRIMARY KEY,  -- Changed to VARCHAR for custom format (e.g., 20241220-0001)
    tenant_id INT(11),  -- Foreign key referencing tenant_id
    payment_amount DECIMAL(10, 2) NOT NULL,  -- Payment amount in Peso
    payment_date DATE NOT NULL,  -- Date of the payment
    payment_status ENUM('paid', 'unpaid') DEFAULT 'unpaid',  -- Payment status (paid or unpaid)
    proof_of_payment VARCHAR(255),  -- Store file path of the image
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id)  -- Foreign key to tenants table
  );
  `;

    await dbConnection.execute(createPaymentsTableQuery);
    console.log("Payment table created or already exists");

    // Create `tenants` table if it doesn't exist
    const createTenantsTableQuery = `
   CREATE TABLE IF NOT EXISTS tenants (
    tenant_id INT(11) AUTO_INCREMENT PRIMARY KEY,
    tenant_name VARCHAR(255) NULL,
    birthday DATE NULL,
    email_address VARCHAR(255) NULL UNIQUE,
    guardian_name VARCHAR(255) NULL,
    home_address VARCHAR(255) NULL,
    rental_start DATE NULL,
    lease_end DATE NULL,
    contact_no VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255) NULL,  -- NULL allowed here
    password VARCHAR(255) NULL,
    active VARCHAR(255) NULL,
    avatar VARCHAR(255) NULL
  );
  `;

    await dbConnection.execute(createTenantsTableQuery);
    console.log("Tenants table created or already exists");

    // Get the maximum tenant_id value
    const [rows] = await dbConnection.execute(
      "SELECT MAX(tenant_id) AS max_id FROM tenants"
    );
    const maxId = rows[0].max_id || 0;

    // Set the new AUTO_INCREMENT value
    const newAutoIncrement = maxId + 1;

    // Adjust AUTO_INCREMENT if needed
    if (maxId > 0) {
      const alterTableQuery = `ALTER TABLE tenants AUTO_INCREMENT = ${newAutoIncrement}`;
      await dbConnection.execute(alterTableQuery);
      console.log("AUTO_INCREMENT for tenants table adjusted");
    }
  } catch (error) {
    console.error("Error during database initialization:", error.message);
    process.exit(1); // Exit the process if database initialization fails
  }
};

// Ensure database is initialized before starting the server
initializeDatabase()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error initializing database:", error.message);
    process.exit(1);
  });

// Function to send a message to Telegram //

// Store the last message and bot's state
let lastMessage = "";
let isBotResponding = false;
const botId = process.env.TELEGRAM_BOT_ID; // Bot ID from environment

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
    console.error("Error sending message to Telegram:", error.message);
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
    console.error("Error deleting message from Telegram:", error.message);
  }
};

// Set up the webhook URL
const setWebhook = async () => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const webhookUrl = `${process.env.WEBHOOK}/telegram-webhook`;

  try {
    await axios.post(`https://api.telegram.org/bot${botToken}/setWebhook`, {
      url: webhookUrl,
    });
    console.log("Webhook set successfully");
  } catch (error) {
    console.error("Error setting webhook:", error.message);
  }
};

// Initialize webhook setup
setWebhook();

// Route to handle incoming updates from Telegram
app.post("/telegram-webhook", async (req, res) => {
  try {
    const update = req.body;

    if (update.message) {
      const { chat, text, from, message_id } = update.message;
      const chatId = chat.id;

      if (from && from.id === botId) {
        return res.status(200).send("OK"); // Ignore messages from the bot
      }

      // Check for duplicate messages
      if (text !== lastMessage && !isBotResponding) {
        io.emit("newMessage", {
          name: "Dwell-o",
          message: text,
          sender: "Dwell-o",
        });

        const messageId = await sendMessageToTelegram(text, chatId);
        lastMessage = text;

        setTimeout(() => {
          if (messageId) {
            deleteMessage(chatId, messageId);
          }
        }, 5000); // Adjust as needed
      }
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("Error handling Telegram update:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route for sending messages from the frontend to Telegram
app.post("/send", async (req, res) => {
  const { name, email, message } = req.body;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!chatId) {
    return res.status(500).json({ error: "Chat ID not set" });
  }

  try {
    if (message !== lastMessage && !isBotResponding) {
      const messageId = await sendMessageToTelegram(message, chatId);
      io.emit("newMessage", { name, email, message, sender: "user" });
      lastMessage = message;
    }

    res.status(200).json({ status: "Message sent successfully" });
  } catch (error) {
    console.error("Error in /send endpoint:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("sendMessage", async (messageData) => {
    const { name, message } = messageData;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    try {
      if (message !== lastMessage && !isBotResponding) {
        io.emit("newMessage", { ...messageData, sender: "user" });

        isBotResponding = true;
        const messageId = await sendMessageToTelegram(message, chatId);

        setTimeout(() => {
          isBotResponding = false;
        }, 500); // Adjust delay as needed
      }
    } catch (err) {
      console.error("Error sending message to Telegram:", err.message);
    }
  });
});

// -------------------------------------------------------------------- //

// OAuth2 authentication URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/gmail.readonly",
  ],
  redirect_uri: GOOGLE_REDIRECT_URI,
});

// Redirect to Google's OAuth2 login page
app.get("/auth", (req, res) => {
  res.redirect(authUrl);
});

// API CALLS //

app.get("/oauthcallbackdwl", async (req, res) => {
  const { code } = req.query;

  if (code) {
    try {
      // Exchange the code for tokens
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      const oauth2 = google.oauth2({
        version: "v2",
        auth: oauth2Client,
      });

      // Get user info
      const userInfo = await oauth2.userinfo.get();
      const { id: googleId, name, email, picture } = userInfo.data;

      // Generate a session token or JWT
      const sessionToken = crypto.randomBytes(32).toString("hex");

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
      await dbConnection.execute(query, [
        googleId,
        name,
        email,
        picture,
        JSON.stringify(tokens),
        sessionToken,
      ]);

      // Create a user data object to store in a cookie
      const userData = {
        googleId,
        name,
        email,
        picture,
        tokens: JSON.stringify(tokens),
      };

      // Set the session token and user data as cookies
      res.cookie("sessionToken", sessionToken, {
        httpOnly: true,
        secure: true, // Set to true if using HTTPS
        sameSite: "Strict",
        maxAge: 3600000, // 1 hour
      });

      // Store user data as a JSON string in a cookie
      res.cookie("userData", JSON.stringify(userData), {
        httpOnly: true,
        secure: true, // Set to true if using HTTPS
        sameSite: "Strict",
        maxAge: 3600000, // 1 hour
      });

      res.redirect(
        `http://localhost:5173/dashboard?email=${encodeURIComponent(email)}`
      );
    } catch (error) {
      console.error("Error during OAuth callback:", error.message);
      res.status(500).send("Error during authorization");
    }
  } else {
    res.status(400).send("Authorization failed: Missing code");
  }
});

const authenticateUser = async (req, res, next) => {
  try {
    const sessionToken = req.cookies.sessionToken;
    if (!sessionToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const query =
      "SELECT googleId, name, email, picture, isActive FROM users WHERE sessionToken = ? AND isActive = true";
    const [rows] = await dbConnection.execute(query, [sessionToken]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "User not found or session inactive" });
    }

    req.user = rows[0]; // Add user info to the request object
    next();
  } catch (error) {
    console.error("Error authenticating user:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Apply middleware to routes that require authentication
app.use("/api/current-user", authenticateUser);

// Function to handle user deletion and update JSON in real-time
async function handleUserDeletion(googleid) {
  try {
    if (dbConnection) {
      const query = "SELECT * FROM users WHERE googleId = ?";
      const [rows] = await dbConnection.execute(query, [googleid]);

      if (rows.length === 0) {
        console.log("User not found");
        return;
      }

      const updateQuery =
        "UPDATE users SET isActive = false WHERE googleId = ?";
      await dbConnection.execute(updateQuery, [googleid]);

      console.log("User successfully deactivated");
    } else {
      console.error("Database connection not established");
    }
  } catch (error) {
    console.error("Error during user deactivation:", error.message);
  }
}

// Endpoint for handling user deletion
app.post("/delete", async (req, res) => {
  try {
    const { googleid } = req.body;

    if (googleid) {
      await handleUserDeletion(googleid);
      res.status(200).send("User deactivated");
    } else {
      res.status(400).send("Invalid request");
    }
  } catch (error) {
    console.error("Error handling deletion request:", error.message);
    res.status(500).send("Server error");
  }
});

app.post("/logout", async (req, res) => {
  try {
    // Retrieve the session token from the cookies
    const sessionToken = req.cookies.sessionToken;

    if (!sessionToken) {
      return res.status(400).json({ error: "Session token is required" });
    }

    // Check if the session token exists in the database and if the user is active
    const query = "SELECT isActive FROM users WHERE sessionToken = ?";
    const [rows] = await dbConnection.execute(query, [sessionToken]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "User not found or invalid session token" });
    }

    if (rows[0].isActive !== 1) {
      return res
        .status(400)
        .json({ message: "User is not active or already logged out" });
    }

    // Update the user's isActive status to false and clear the session token
    const updateQuery =
      "UPDATE users SET isActive = false, sessionToken = NULL WHERE sessionToken = ?";
    await dbConnection.execute(updateQuery, [sessionToken]);

    // Optionally, clear the session token cookie on the client side
    res.clearCookie("sessionToken", {
      httpOnly: true,
      secure: true, // Set to true if using HTTPS
      sameSite: "Strict",
    });

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/get-google-id", async (req, res) => {
  try {
    // Extract session token from the request (e.g., from a cookie or header)
    const sessionToken = req.cookies.sessionToken; // Adjust as needed if using a different method

    if (!sessionToken) {
      return res
        .status(401)
        .json({ error: "Unauthorized. Session token missing" });
    }

    // Query the database for the user's googleId based on the session token
    const query =
      "SELECT googleId FROM users WHERE sessionToken = ? AND isActive = true";
    const [rows] = await dbConnection.execute(query, [sessionToken]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Google ID not found or session inactive" });
    }

    res.status(200).json({ googleId: rows[0].googleId });
  } catch (error) {
    console.error("Error fetching user googleId:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/get-session-token", async (req, res) => {
  try {
    // Assuming the 'userData' cookie contains a JSON string
    const userDataCookie = req.cookies.userData;

    if (!userDataCookie) {
      return res
        .status(401)
        .json({ error: "Unauthorized. User data not found" });
    }

    // Parse the JSON string to access user data
    const userData = JSON.parse(userDataCookie);

    // Extract the googleId
    const { googleId } = userData;

    if (!googleId) {
      return res
        .status(401)
        .json({ error: "Unauthorized. Google ID not found" });
    }

    // Query the database for the session token based on googleId
    const query =
      "SELECT sessionToken FROM users WHERE googleId = ? AND isActive = true";
    const [rows] = await dbConnection.execute(query, [googleId]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Session token not found or inactive" });
    }

    // Return the session token as a JSON response
    res.status(200).json({ sessionToken: rows[0].sessionToken });
  } catch (error) {
    console.error("Error fetching session token:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/current-user", (req, res) => {
  if (req.user) {
    res.status(200).json({
      user: req.user,

      message: "User is authenticated",
    });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.post("/api/tenants", async (req, res) => {
  try {
    const {
      name = null,
      birthday = null,
      contactNo = null,
      email = null,
      guardianName = null,
      homeAddress = null,
      rentalStart = null,
      leaseEnd = null,
      username = "", // Default username to an empty string if not provided
      password = "",
    } = req.body;

    // Ensure that 'username' is either empty string or properly set
    const query = `INSERT INTO tenants (tenant_name, birthday, contact_no, email_address, guardian_name, home_address, rental_start, lease_end, username, password)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    await dbConnection.execute(query, [
      name,
      birthday,
      contactNo,
      email,
      guardianName,
      homeAddress,
      rentalStart,
      leaseEnd,
      username || "", // Ensure it's an empty string if no username provided
      password,
    ]);

    res.status(201).json({ message: "Tenant added successfully" });
  } catch (error) {
    console.error("Error adding tenant:", error);
    res.status(500).json({ error: "Failed to add tenant" });
  }
});

app.get("/api/tenants/:tenantId", async (req, res) => {
  try {
    // Extract tenantId from the route parameters
    const { tenantId } = req.params;

    // Validate tenantId to ensure it's a number
    if (isNaN(tenantId)) {
      return res.status(400).json({ error: "Invalid tenant ID provided" });
    }

    // Construct the query to fetch a specific tenant by tenant_id
    const query = "SELECT * FROM tenants WHERE tenant_id = ?";
    const params = [tenantId];

    // Execute the query and wait for the result
    const [rows] = await dbConnection.execute(query, params);

    // Check if a tenant with the given ID exists
    if (rows.length === 0) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    // Send the result as a JSON response
    res.status(200).json(rows[0]); // Send only the first record (should be unique due to the primary key)
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error fetching tenant by ID:", error);

    // Return a 500 status with an appropriate error message
    res.status(500).json({ error: "Failed to fetch tenant" });
  }
});

app.get("/api/tenants", async (req, res) => {
  try {
    const { id, username } = req.query; // Get 'id' or 'username' from query parameters
    let query = "SELECT * FROM tenants";
    const params = [];

    if (id) {
      query += " WHERE tenant_id = ?"; // Filter by tenant_id if provided
      params.push(id);
    } else if (username) {
      query += " WHERE username = ?"; // Filter by username if provided
      params.push(username);
    }

    const [rows] = await dbConnection.execute(query, params);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    res.status(200).json(rows); // Return the data as an array
  } catch (error) {
    console.error("Error fetching tenants:", error);
    res.status(500).json({ error: "Failed to fetch tenants" });
  }
});

app.put("/api/tenants/editInfo", async (req, res) => {
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
      return res
        .status(400)
        .json({ error: "Tenant ID is required to update." });
    }

    // Prepare the SQL query dynamically
    let updateQuery = "UPDATE tenants SET ";
    const values = [];
    const updateFields = [];

    // Check for each field and add to the query and values array if it's provided
    if (name !== undefined) {
      updateFields.push("tenant_name = ?");
      values.push(name);
    }
    if (birthday !== undefined) {
      updateFields.push("birthday = ?");
      values.push(birthday);
    }
    if (email !== undefined) {
      updateFields.push("email_address = ?");
      values.push(email);
    }
    if (guardianName !== undefined) {
      updateFields.push("guardian_name = ?");
      values.push(guardianName);
    }
    if (homeAddress !== undefined) {
      updateFields.push("home_address = ?");
      values.push(homeAddress);
    }
    if (rentalStart !== undefined) {
      updateFields.push("rental_start = ?");
      values.push(rentalStart);
    }
    if (leaseEnd !== undefined) {
      updateFields.push("lease_end = ?");
      values.push(leaseEnd);
    }
    if (contactNo !== undefined) {
      updateFields.push("contact_no = ?");
      values.push(contactNo);
    }

    // If no fields were provided, return an error
    if (updateFields.length === 0) {
      return res.status(400).json({ error: "No fields provided to update." });
    }

    // Combine the query with the updated fields and the WHERE clause
    updateQuery += updateFields.join(", ") + " WHERE tenant_id = ?";
    values.push(tenantId); // Add the tenantId as the last value

    // Execute the query
    const [results] = await dbConnection.execute(updateQuery, values);

    if (results.affectedRows > 0) {
      res.status(200).json({ message: "Tenant updated successfully." });
    } else {
      res.status(404).json({ error: "Tenant not found." });
    }
  } catch (error) {
    console.error("Error updating tenant:", error);
    res.status(500).json({ error: "Failed to update tenant." });
  }
});

app.put("/api/tenants/terminateLease/:tenantId", async (req, res) => {
  const { tenantId } = req.params;
  const { terminationDate } = req.body;

  try {
    const updateQuery = `
      UPDATE tenants 
      SET lease_end = ? 
      WHERE tenant_id = ?
    `;
    const [result] = await dbConnection.execute(updateQuery, [
      terminationDate,
      tenantId,
    ]);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Lease terminated successfully." });
    } else {
      res.status(404).json({ error: "Tenant not found." });
    }
  } catch (error) {
    console.error("Error updating tenant lease:", error);
    res.status(500).json({ error: "Failed to terminate lease." });
  }
});

app.put("/api/tenants/extendLease/:tenantId", async (req, res) => {
  const { tenantId } = req.params;
  const { leaseExtendDate } = req.body;

  try {
    // If no leaseEndDate is provided, set lease_end to NULL
    const newLeaseDate = leaseExtendDate ? leaseExtendDate : null;

    const updateQuery = `
      UPDATE tenants 
      SET rental_start = ?, lease_end = NULL
      WHERE tenant_id = ?
    `;

    const [result] = await dbConnection.execute(updateQuery, [
      newLeaseDate,
      tenantId,
    ]);

    if (result.affectedRows > 0) {
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false, message: "Tenant not found." });
    }
  } catch (error) {
    console.error("Error updating lease:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

app.post("/api/tenant-create/:tenantId", async (req, res) => {
  const { tenantId } = req.params;
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    // SQL query to update username and password for the specific tenant
    const query = `
      UPDATE tenants
      SET username = ?, password = ?
      WHERE tenant_id = ?;
    `;

    const result = await dbConnection.execute(query, [
      username,
      password,
      tenantId,
    ]);

    // Check if the tenant with the given tenant_id was found and updated
    if (result[0].affectedRows > 0) {
      res.status(200).json({ message: "Tenant account created successfully" });
    } else {
      res.status(404).json({ error: "Tenant not found" });
    }
  } catch (error) {
    console.error("Error updating tenant:", error);
    res.status(500).json({ error: "Failed to update tenant" });
  }
});

// TENANTS DASHBOARD //

app.post("/api/login/:username", async (req, res) => {
  const { username } = req.params; // Get the username from the URL params
  const { password } = req.body; // Get the password from the request body

  // Check if password is provided
  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Password is required",
    });
  }

  try {
    // Fetch tenant by username (from MySQL in your case)
    const [rows] = await dbConnection.execute(
      "SELECT * FROM tenants WHERE username = ?",
      [username]
    );

    if (rows.length > 0) {
      const tenant = rows[0]; // Assuming the username is unique, take the first result

      // Check if the password matches
      if (tenant.password === password) {
        // Return success and tenant data including tenant_id
        return res.json({
          success: true,
          message: "Login successful",
          tenant: {
            tenant_id: tenant.tenant_id,
            username: tenant.username,
            // other relevant tenant data you want to send back
          },
        });
      } else {
        return res.status(401).json({
          success: false,
          message: "Invalid username or password",
        });
      }
    } else {
      return res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
    }
  } catch (error) {
    console.error("Error during login process:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during login",
    });
  }
});

// Backend: POST login API to set tenant as active (logged in)
app.get("/api/login", async (req, res) => {
  const { username, password } = req.query; // Get username and password from the query string

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required",
    });
  }

  try {
    // Check if the tenant exists and if the password matches
    const [rows] = await dbConnection.execute(
      "SELECT * FROM tenants WHERE username = ? AND password = ?",
      [username, password]
    );

    if (rows.length > 0) {
      const tenant = rows[0]; // Assuming the username is unique

      // Set tenant's active status to true (mark as logged in)
      await dbConnection.execute(
        "UPDATE tenants SET active = ? WHERE tenant_id = ?",
        [true, tenant.tenant_id]
      );

      return res.json({
        success: true,
        loggedIn: true,
        message: "Login successful",
        tenant: {
          tenant_id: tenant.tenant_id,
          username: tenant.username,
          tenant_name: tenant.tenant_name, // include other tenant data you want to send
        },
      });
    } else {
      return res.status(401).json({
        success: false,
        loggedIn: false,
        message: "Invalid username or password",
      });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      success: false,
      loggedIn: false,
      message: "An error occurred during login",
    });
  }
});

app.get("/api/user/tenants", async (req, res) => {
  const { username, id } = req.query; // Get both username and id from query parameters

  let query = "SELECT * FROM tenants WHERE ";
  let params = [];

  if (username) {
    query += "username = ?";
    params.push(username);
  }

  if (id) {
    // If both username and id are provided, add an OR condition
    if (username) {
      query += " OR ";
    }
    query += "tenant_id = ?";
    params.push(id);
  }

  try {
    const tenant = await dbConnection.query(query, params); // Execute query with dynamic conditions

    console.log("Fetched tenant data:", tenant); // Log the raw tenant data

    if (tenant.length > 0) {
      const tenantData = tenant[0]; // Get the first record (assuming only one tenant matches)

      // Define fields to exclude (e.g., password, internal fields)
      const excludeFields = ["password", "internal_field1", "internal_field2"];

      // Filter the tenant data by excluding the fields
      const cleanedData = Object.keys(tenantData).reduce((result, key) => {
        if (
          !excludeFields.includes(key) &&
          tenantData[key] !== null &&
          tenantData[key] !== undefined
        ) {
          result[key] = tenantData[key];
        }
        return result;
      }, {});

      // Return the cleaned data in the desired format
      const responseData = {
        tenant: cleanedData,
      };

      res.json(responseData); // Return the transformed data as a JSON response
    } else {
      res.status(404).json({ message: "Tenant not found" });
    }
  } catch (error) {
    console.error("Error fetching tenant data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PAYMENTS API //

// POST endpoint for adding a payment
app.post(
  "/api/payments",
  upload.single("proof_of_payment"),
  async (req, res) => {
    const { tenant_id, payment_amount, payment_date } = req.body;
    const proofOfPayment = req.file ? req.file.path : null;

    // Ensure all required fields are provided
    if (!tenant_id || !payment_amount || !payment_date) {
      return res.status(400).json({ message: "All fields are required." });
    }

    try {
      // Format the payment_date to YYYYMMDD
      const formattedDate = new Date(payment_date)
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "");

      // Query the database to get the highest payment_id for the same date
      const [rows] = await dbConnection.query(
        `SELECT payment_id FROM payments WHERE payment_id LIKE ? ORDER BY payment_id DESC LIMIT 1`,
        [`${formattedDate}-%`]
      );

      // If there are no existing payments for this date, start with 0001
      const latestPaymentId =
        rows.length > 0 ? rows[0].payment_id.split("-")[1] : "0000";
      const newPaymentId = `${formattedDate}-${(
        parseInt(latestPaymentId, 10) + 1
      )
        .toString()
        .padStart(4, "0")}`;

      // Insert the new payment
      const [result] = await dbConnection.query(
        `INSERT INTO payments (payment_id, tenant_id, payment_amount, payment_date, proof_of_payment, payment_status) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          newPaymentId,
          tenant_id,
          payment_amount,
          payment_date,
          proofOfPayment,
          "paid",
        ]
      );

      // Send response
      res.status(201).json({
        message: "Payment added successfully",
        tenant_id,
        payment_amount,
        payment_date,
        proof_of_payment: proofOfPayment,
        payment_status: "paid",
        payment_id: newPaymentId,
      });
    } catch (error) {
      console.error("Error adding payment:", error);
      res.status(500).json({ message: "Failed to add payment" });
    }
  }
);

// Define the GET API route to fetch payments
app.get("/api/payments", async (req, res) => {
  const { tenant_id } = req.query; // Get tenant_id from query parameters

  try {
    let query = "SELECT * FROM payments";
    let queryParams = [];

    // If tenant_id is provided, filter the payments by tenant_id
    if (tenant_id) {
      query += " WHERE tenant_id = ?";

      queryParams.push(tenant_id);
    }
    // Execute the query with the appropriate parameters
    const results = await dbConnection.query(query, queryParams);

    // Wrap the results within a 'payment' object
    res.json({ payment: results["0"] }); // Send the payments data wrapped inside 'payment'
  } catch (err) {
    console.error("Error fetching payments:", err);
    return res.status(500).json({ message: "Error fetching payments" });
  }
});

// Endpoint to set tenant status as inactive (logged out)
app.post("/api/tenants/logout", async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res
      .status(400)
      .json({ success: false, message: "Username is required" });
  }

  try {
    // Use a promise with async/await to handle the database query
    const query = "UPDATE tenants SET active = 0 WHERE username = ?";

    // Use dbConnection.execute with async/await
    const [result] = await dbConnection.execute(query, [username]);

    // If the tenant is found and updated successfully
    if (result.affectedRows > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Tenant logged out successfully" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Tenant not found" });
    }
  } catch (error) {
    console.error("Error during logout:", error);
    return res
      .status(500)
      .json({ success: false, message: "An error occurred while logging out" });
  }
});

// Route to check if a tenant is active
app.get("/api/tenant/active", async (req, res) => {
  const tenantId = req.query.tenantId; // Get tenantId from query parameters

  if (!tenantId) {
    return res.status(400).json({ message: "Tenant ID is required" });
  }

  try {
    // Query the database to get the tenant's active status
    const [rows] = await dbConnection.execute(
      "SELECT active FROM tenants WHERE tenant_id = ?",
      [tenantId] // Pass tenantId as a parameter
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const tenant = rows[0];
    const isActive = tenant.active === "1"; // Assuming 'active' is the string value for active tenants

    return res.status(200).json({ isActive });
  } catch (err) {
    console.error("Error querying the database:", err);
    return res.status(500).json({ message: "Error querying the database" });
  }
});

app.put(
  "/api/tenants/update/:tenant_id",
  upload.single("avatar"),
  async (req, res) => {
    const tenant_id = req.params.tenant_id;
    const { tenant_name, username, birthday } = req.body;
    const avatar = req.file ? req.file.path : null; // Capture avatar file path

    try {
      if (!tenant_id) {
        return res
          .status(400)
          .json({ error: "Tenant ID is required to update." });
      }

      let updateQuery = "UPDATE tenants SET ";
      const values = [];
      const updateFields = [];

      // Check for each field and add to the query and values array if it's provided
      if (tenant_name && tenant_name.trim() !== "") {
        updateFields.push("tenant_name = ?");
        values.push(tenant_name);
      }
      if (username && username.trim() !== "") {
        updateFields.push("username = ?");
        values.push(username);
      }
      if (birthday) {
        updateFields.push("birthday = ?");
        values.push(birthday);
      }
      if (avatar) {
        updateFields.push("avatar = ?");
        values.push(avatar);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({ error: "No fields provided to update." });
      }

      updateQuery += updateFields.join(", ") + " WHERE tenant_id = ?";
      values.push(tenant_id); // Add tenant_id at the end

      const [results] = await dbConnection.execute(updateQuery, values);

      if (results.affectedRows > 0) {
        return res.status(200).json({
          message: "Tenant updated successfully.",
          avatarPath: avatar || "No avatar updated", // Include file path (destination) in the response
        });
      } else {
        return res.status(404).json({ error: "Tenant not found." });
      }
    } catch (error) {
      console.error("Error updating tenant:", error);
      return res.status(500).json({ error: "Failed to update tenant." });
    }
  }
);

// Route to get tenant avatar
app.get("/api/tenants/avatar/:tenant_id", async (req, res) => {
  const tenant_id = req.params.tenant_id;

  if (!tenant_id) {
    return res.status(400).json({ error: "Tenant ID is required." });
  }

  try {
    // Query the database to get the avatar path for the given tenant_id
    const [rows] = await dbConnection.execute(
      "SELECT avatar FROM tenants WHERE tenant_id = ?",
      [tenant_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Tenant not found." });
    }

    const tenant = rows[0];
    let avatarPath = tenant.avatar;

    // Ensure the avatar path uses forward slashes
    if (avatarPath) {
      avatarPath = avatarPath.replace(/\\/g, "/"); // Replace backslashes with forward slashes
    }

    return res.status(200).json({ avatarPath });
  } catch (error) {
    console.error("Error retrieving avatar:", error);
    return res.status(500).json({ error: "Failed to retrieve avatar." });
  }
});

//ADD HERE IF you will add APIs

//-------------------------------------------------------------------------------------------------//
