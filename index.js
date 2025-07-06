// Node Modules
const http = require("http");
const express = require("express");
const cors = require("cors");

// Database connection
const connectDB = require('./config/database');

// Constants
const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Connect to MongoDB
connectDB();

// Middleware Files
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const messageRoutes = require("./routes/message.route");
const conversationRoutes = require("./routes/conversation.route");

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/conversations", conversationRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "Server is running",
        timestamp: new Date().toISOString()
    });
});

// Online users tracking
const onlineUsers = new Set();

// Socket.IO connection handling
io.on("connection", (socket) => {
    // Kullanıcı kimliği almak için auth token kontrolü
    let userId = null;
    try {
        const token = socket.handshake.auth?.token || socket.handshake.query?.token;
        if (token) {
            const jwt = require('jsonwebtoken');
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            userId = decoded.id;
            if (userId) {
                onlineUsers.add(userId);
                // Kullanıcıyı kendi odasına ekle
                socket.join(`user_${userId}`);
                
                // Diğer kullanıcılara online durumunu bildir
                socket.broadcast.emit('user_online', { userId });
            }
        }
    } catch (e) {
        // Token yoksa veya hatalıysa online ekleme
        console.log('Socket auth error:', e.message);
    }

    socket.on("disconnect", () => {
        if (userId) {
            onlineUsers.delete(userId);
            // Diğer kullanıcılara offline durumunu bildir
            socket.broadcast.emit('user_offline', { userId });
        }
        console.log("User disconnected");
    });
});

// Online users'ı diğer dosyalara aç
app.set('onlineUsers', onlineUsers);
app.set('io', io);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Listen   
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`API Base URL: http://localhost:${PORT}/api`);
});
