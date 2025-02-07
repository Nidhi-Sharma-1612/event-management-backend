require("dotenv").config();
const connectDB = require("./config/db");
const app = require("./app");
const http = require("http");
const socketIo = require("socket.io");
const socket = require("./socket"); // ✅ Import socket module

const PORT = process.env.PORT || 5000;

// ✅ Create HTTP server
const server = http.createServer(app);

// ✅ Initialize Socket.IO & Store in `socket.js`
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});
socket.init(io); // ✅ Initialize WebSocket globally

// ✅ WebSocket Connection Handling
io.on("connection", (socket) => {
  console.log("🔗 New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

connectDB();
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
