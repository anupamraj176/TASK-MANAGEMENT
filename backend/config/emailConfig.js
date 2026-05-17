const nodemailer = require('nodemailer');
const dns = require('dns');
require('dotenv').config();

let cachedTransporter = null;

/**
 * Creates a Nodemailer transporter that is guaranteed to connect via IPv4.
 * Render's container network lacks IPv6 routing, so we manually resolve
 * smtp.gmail.com to its IPv4 address and connect to the raw IP directly.
 */
async function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  let host = 'smtp.gmail.com';
  try {
    const addresses = await dns.promises.resolve4('smtp.gmail.com');
    if (addresses && addresses.length > 0) {
      host = addresses[0]; // Use raw IPv4 address (e.g., 142.250.x.x)
      console.log('✅ Resolved smtp.gmail.com to IPv4:', host);
    }
  } catch (err) {
    console.log('⚠️ DNS resolve4 failed, using hostname fallback:', err.message);
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
    tls: {
      servername: 'smtp.gmail.com', // Required for TLS certificate validation when using raw IP
      rejectUnauthorized: false,
    },
    connectionTimeout: 10000,
  });

  return cachedTransporter;
}

module.exports = getTransporter;
