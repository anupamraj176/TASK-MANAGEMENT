// Polyfill global crypto for older Node environments (fixes MongoDB ReferenceError: crypto is not defined)
if (!globalThis.crypto) {
  globalThis.crypto = require('crypto');
}

// Force IPv4 DNS resolution globally — Render's container network lacks IPv6 routing,
// causing ENETUNREACH errors when Node.js tries to connect to Gmail's IPv6 SMTP servers.
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

require('dotenv').config();
const http = require('http');
const connectDB = require('./config/database');
const app = require('./app');
const socketConfig = require('./config/socket');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Create HTTP server and initialize Socket.io
const httpServer = http.createServer(app);
socketConfig.init(httpServer);

httpServer.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🔐 Auth Base URL: http://localhost:${PORT}/api/auth`);
  console.log(`👨‍💼 Admin Base URL: http://localhost:${PORT}/api/admin`);
  console.log(`👤 Users Base URL: http://localhost:${PORT}/api/users`);
  console.log(`🗂️ Tasks Base URL: http://localhost:${PORT}/api/tasks`);
  console.log(`📚 Swagger Docs: http://localhost:${PORT}/api/docs`);
  console.log(`💚 Health Check: http://localhost:${PORT}/health\n`);
});
