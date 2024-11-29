95% of storage used … If you run out, you can't create, edit and upload files. Get 100 GB of storage for ₱89.00 ₱0 for 1 month.
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 5001;
app.use(express.json());
app.use(cors());

// Store the last message to prevent duplicate broadcasts and self-replies
let lastMessage = '';
let isBotResponding = false;
const botId = process.env.TELEGRAM_BOT_ID; // Add your bot's ID here

// Function to send a message to Telegram (from the backend)
const sendMessageToTelegram = async (message, chatId) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const response = await axios.post(url, {
      chat_id: chatId,
      text: message,
    });
    // Return the message ID for potential deletion
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

// Set up the webhook
const setWebhook = async () => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const webhookUrl = 'https://9bc6-120-28-177-206.ngrok-free.app/telegram-webhook'; // Replace with your server URL

  try {
    await axios.post(`https://api.telegram.org/bot${botToken}/setWebhook`, {
      url: webhookUrl,
    });
  } catch (error) {
    console.error('Error setting webhook:', error.message);
  }
};

// Call setWebhook once to initialize the webhook
setWebhook();

// Webhook route to receive messages from Telegram
app.post('/telegram-webhook', async (req, res) => {
  try {
    const update = req.body;

    if (update.message) {
      const { chat, text, from, message_id } = update.message;
      const chatId = chat.id;

      // Check if the message is from the bot itself
      if (from && from.id === botId) {
        return res.status(200).send('OK'); // Ignore messages from the bot
      }

      // Check if the message is a duplicate of the last message or a bot's response
      if (text !== lastMessage && !isBotResponding) {
        // Emit the incoming message to the frontend
        io.emit('newMessage', { name: 'Dwell-o', message: text, sender: 'Dwell-o' });

        // Send the message to Telegram (from the bot)
        const messageId = await sendMessageToTelegram(text, chatId);

        // Store the last message and the message_id for deletion later
        lastMessage = text;

        // Delete the bot's own message after 5 seconds (adjust as needed)
        setTimeout(() => {
          if (messageId) {
            deleteMessage(chatId, messageId);
          }
        }, 500); // 
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Error handling Telegram update:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Route to handle messages from the frontend and send them to Telegram
app.post('/send', async (req, res) => {
  const { name, email, message } = req.body;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!chatId) {
    return res.status(500).json({ error: 'Chat ID not set' });
  }

  try {
    // Check if the message is a duplicate of the last message
    if (message !== lastMessage && !isBotResponding) {
      // Send the message to Telegram (as the user)
      const messageId = await sendMessageToTelegram(message, chatId);

      // Emit the message to the frontend (user)
      io.emit('newMessage', { name, email, message, sender: 'user' });

      // Store the last message
      lastMessage = message;
    }

    res.status(200).json({ status: 'Message sent successfully' });
  } catch (error) {
    console.error('Error in /send endpoint:', error.message);
    res.status(500).json({ error: error.message });
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('sendMessage', async (messageData) => {
    const { name, message } = messageData;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    try {
      // Prevent duplicate responses and ensure the bot doesn't reply to itself
      if (message !== lastMessage && !isBotResponding) {
        // Emit the message to the frontend as a user message
        io.emit('newMessage', { ...messageData, sender: 'user' });

        // Set the bot's responding state
        isBotResponding = true;

        // Send the outgoing message to Telegram (as the user)
        const messageId = await sendMessageToTelegram(message, chatId);

        // Reset the bot's responding state after a short delay
        setTimeout(() => {
          isBotResponding = false;
        }, 500); // Adjust delay as needed
      }
    } catch (err) {
      console.error('Error sending message to Telegram:', err.message);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});