const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const db = require('./config/db');

console.log("--- Initializing Server ---");

// --- App & Server Setup ---
const app = express();
const server = http.createServer(app);

// --- Socket.IO Setup with CORS ---
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
console.log("✅ Socket.IO and CORS configured.");

const PORT = 3000;

// --- Middleware ---
app.use(cors());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
console.log("✅ Middleware loaded.");

// --- API Routes ---
try {
  console.log("🔄 Loading routes...");
  const registerRoute = require('./routes/register');
  console.log("  - ./routes/register loaded successfully.");
  const adminRoute = require('./routes/admin')(db);
  console.log("  - ./routes/admin loaded successfully.");
  const attendanceRoute = require('./routes/attendance')(db, io);
  console.log("  - ./routes/attendance loaded successfully.");
  const exportRoute = require('./routes/export')(db);
  console.log("  - ./routes/export loaded successfully.");

  app.use('/api/register', registerRoute);
  app.use('/api/admin', adminRoute);
  app.use('/api/attendance', attendanceRoute);
  app.use('/api/export', exportRoute);
  console.log("✅ API routes configured.");
} catch (error) {
  console.error("❌ FATAL ERROR: Could not load a route file.", error);
  process.exit(1); // Stop the server if routes can't be loaded
}


// --- Fallback Route ---
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// --- Start Server ---
server.listen(PORT, () => {
  console.log(`\n🚀 Server is running and listening at http://localhost:${PORT}`);
});