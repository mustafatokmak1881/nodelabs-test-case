// Node Modules
const http = require("http");
const express = require("express");
const cors = require("cors");

// Database connection
const connectDB = require('./config/database');

// Redis connection
const { connectRedis, setOnlineUsersCount, getOnlineUsersCount, incrementOnlineUsers, decrementOnlineUsers } = require('./config/redis');

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

// Connect to Redis
connectRedis();

// Middleware Files
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const messageRoutes = require("./routes/message.route");
const conversationRoutes = require("./routes/conversation.route");
const apiLimiter = require('./middlewares/rateLimit');

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/conversations", conversationRoutes);

// Rate limiting middleware (sadece API için)
app.use('/api', apiLimiter);

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

// Function to emit online users count
const emitOnlineUsersCount = async () => {
    try {
        const count = await getOnlineUsersCount();
        io.emit('online_users_count', { count });
        console.log(`Online users: ${count}`);
    } catch (error) {
        console.error('Error emitting online users count:', error);
        // Fallback to local count if Redis fails
        const localCount = onlineUsers.size;
        io.emit('online_users_count', { count: localCount });
        console.log(`Online users (fallback): ${localCount}`);
    }
};

// Online users count endpoint
app.get("/api/stats/online-users", async (req, res) => {
    try {
        const count = await getOnlineUsersCount();
        res.json({
            success: true,
            data: {
                onlineUsers: count,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Get online users count error:', error);
        // Fallback to local count if Redis fails
        const localCount = onlineUsers.size;
        res.json({
            success: true,
            data: {
                onlineUsers: localCount,
                timestamp: new Date().toISOString()
            }
        });
    }
});

function verifySocketJWT(socket) {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) throw new Error('No token');
    const jwt = require('jsonwebtoken');
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
}

// Socket.IO connection handling
io.on("connection", async (socket) => {
    let userId = null;
    try {
        const decoded = verifySocketJWT(socket);
        userId = decoded.id;
        if (userId) {
            onlineUsers.add(userId);
            socket.join(`user_${userId}`);
            await incrementOnlineUsers();
            socket.broadcast.emit('user_online', { userId });
            await emitOnlineUsersCount();
        }
    } catch (e) {
        console.log('Socket auth error:', e.message);
        socket.emit('auth_error', { message: 'Geçersiz veya eksik token.' });
        socket.disconnect(true);
        return;
    }

    socket.on("disconnect", async () => {
        if (userId) {
            onlineUsers.delete(userId);
            await decrementOnlineUsers();
            socket.broadcast.emit('user_offline', { userId });
            await emitOnlineUsersCount();
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
