const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Use SSL/TLS directly on port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false // Prevents cloud certificate resolution delays
  },
  family: 4, // Forces IPv4 ONLY to bypass Render's broken IPv6 ENETUNREACH network routing
  connectionTimeout: 10000, // Fail fast (10s) instead of hanging
});

module.exports = transporter;
