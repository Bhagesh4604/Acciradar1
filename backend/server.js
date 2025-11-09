// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
const port = process.env.PORT || 3001;

// --- Twilio Configuration ---
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Basic validation to ensure credentials are set
if (!accountSid || !authToken) {
  console.error('ERROR: Twilio credentials are not set in the .env file.');
  process.exit(1);
}

const client = twilio(accountSid, authToken);

// --- Middleware ---
// Enable CORS for all routes to allow requests from the frontend
app.use(cors());
// Enable the express.json middleware to parse JSON request bodies
app.use(express.json());

// --- API Endpoint ---
app.post('/api/report-accident', async (req, res) => {
  console.log('Received accident report:', req.body);

  const { userProfile, location, emergencyContacts } = req.body;

  // Validate incoming data
  if (!userProfile || !location || !emergencyContacts || emergencyContacts.length === 0) {
    return res.status(400).json({ success: false, message: 'Missing required accident data.' });
  }

  // Construct the SMS message
  const locationLink = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
  let messageBody = `--- EMERGENCY ALERT: ACCIDENT DETECTED ---\n`;
  messageBody += `This is an automated message for ${userProfile.name}.\n\n`;
  messageBody += `PROFILE:\n`;
  messageBody += `- Phone: ${userProfile.phone}\n`;
  messageBody += `- Blood Type: ${userProfile.bloodType}\n`;
  messageBody += `- Allergies: ${userProfile.allergies}\n`;
  messageBody += `- Conditions: ${userProfile.medicalConditions}\n\n`;
  messageBody += `Last Known Location:\n${locationLink}`;

  // Use Promise.allSettled to send all SMS messages and wait for their outcomes
  const sendPromises = emergencyContacts.map(contact => {
    return client.messages.create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: contact.phone // Assumes phone numbers are in E.164 format
    });
  });

  try {
    const results = await Promise.allSettled(sendPromises);
    
    const failedMessages = results.filter(result => result.status === 'rejected');

    if (failedMessages.length > 0) {
      console.error('Some messages failed to send:', failedMessages);
      // Still return success if at least one message was sent
      if (failedMessages.length < results.length) {
        return res.status(207).json({ success: true, message: 'Some notifications failed, but others were sent.' });
      }
      return res.status(500).json({ success: false, message: 'All emergency notifications failed to send.' });
    }
    
    console.log('All emergency SMS messages sent successfully.');
    res.status(200).json({ success: true, message: 'All emergency notifications sent successfully.' });

  } catch (error) {
    console.error('A critical error occurred while sending SMS messages:', error);
    res.status(500).json({ success: false, message: 'An internal server error occurred.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`AcciRadar backend server running on port ${port}`);
});
