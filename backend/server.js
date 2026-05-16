require('dotenv').config();
const connectDB = require('./config/database');
const app = require('./app');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🔐 Auth Base URL: http://localhost:${PORT}/api/auth`);
  console.log(`👨‍💼 Admin Base URL: http://localhost:${PORT}/api/admin`);
  console.log(`👤 Users Base URL: http://localhost:${PORT}/api/users`);
  console.log(`🗂️ Tasks Base URL: http://localhost:${PORT}/api/tasks`);
  console.log(`📚 Swagger Docs: http://localhost:${PORT}/api/docs`);
  console.log(`💚 Health Check: http://localhost:${PORT}/health\n`);
});
