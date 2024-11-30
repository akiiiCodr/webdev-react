import { google } from 'googleapis';
import express from 'express';

import dotenv from 'dotenv'

dotenv.config();

const GOOGLE_CLIENT_ID = process.env.CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.REDIRECT_URI;

const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

const app = express();

// Generate the authentication URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
  redirect_uri: GOOGLE_REDIRECT_URI, // This should match the one in the Google Cloud Console
});

app.get('/auth', (req, res) => {
  res.redirect(authUrl);
});

app.get('/oauthcallbackdwl', async (req, res) => {
  const { code } = req.query;

  if (code) {
    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);
      console.log('Refresh Token:', tokens.refresh_token);
      res.send('Authorization successful! Check your console for the refresh token.');
    } catch (error) {
      console.error('Error getting tokens:', error);
      res.send('Error during authorization');
    }
  } else {
    res.send('Authorization failed');
  }
});

app.listen(5001, () => {
  console.log('Server started on http://localhost:5001');
  console.log('Visit http://localhost:5001/auth to initiate the authorization flow');
});
