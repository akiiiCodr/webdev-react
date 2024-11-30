// Import required packages
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';
import mysql from 'mysql2/promise'; // Use promise-based API for async/await

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Replace with your frontend URL for security
    methods: ['GET', 'POST'],
  },
});

// Port configuration
const PORT = process.env.PORT || 5001;
app.use(express.json());
app.use(cors());

// Store the last message and bot's state
let lastMessage = '';
let isBotResponding = false;
const botId = process.env.TELEGRAM_BOT_ID; // Bot ID from environment

// Set up the MySQL connection
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
  } catch (error) {
    console.error('Error connecting to the MySQL database:', error.message);
  }
};

initializeDatabase();

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

// Set up the webhook URL
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

// Route to handle incoming updates from Telegram
app.post('/telegram-webhook', async (req, res) => {
  try {
    const update = req.body;

    if (update.message) {
      const { chat, text, from, message_id } = update.message;
      const chatId = chat.id;

      if (from && from.id === botId) {
        return res.status(200).send('OK'); // Ignore messages from the bot
      }

      if (text !== lastMessage && !isBotResponding) {
        io.emit('newMessage', { name: 'Dwell-o', message: text, sender: 'Dwell-o' });

        const messageId = await sendMessageToTelegram(text, chatId);
        lastMessage = text;

        setTimeout(() => {
          if (messageId) {
            deleteMessage(chatId, messageId);
          }
        }, 5000); // Adjust as needed
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Error handling Telegram update:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Route for sending messages from the frontend to Telegram
app.post('/send', async (req, res) => {
  const { name, email, message } = req.body;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!chatId) {
    return res.status(500).json({ error: 'Chat ID not set' });
  }

  try {
    if (message !== lastMessage && !isBotResponding) {
      const messageId = await sendMessageToTelegram(message, chatId);
      io.emit('newMessage', { name, email, message, sender: 'user' });
      lastMessage = message;
    }

    res.status(200).json({ status: 'Message sent successfully' });
  } catch (error) {
    console.error('Error in /send endpoint:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('sendMessage', async (messageData) => {
    const { name, message } = messageData;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    try {
      if (message !== lastMessage && !isBotResponding) {
        io.emit('newMessage', { ...messageData, sender: 'user' });

        isBotResponding = true;
        const messageId = await sendMessageToTelegram(message, chatId);

        setTimeout(() => {
          isBotResponding = false;
        }, 500); // Adjust delay as needed
      }
    } catch (err) {
      console.error('Error sending message to Telegram:', err.message);
    }
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
