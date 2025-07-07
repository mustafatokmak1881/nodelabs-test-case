// Node Modules
const http = require("http");
const express = require("express");
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

// Database connection
const connectDB = require('./config/database');

// Redis connection
const { connectRedis, setOnlineUsersCount, getOnlineUsersCount, incrementOnlineUsers, decrementOnlineUsers, resetOnlineUsersCount, addOnlineUser, removeOnlineUser, isUserOnline, getOnlineUsers } = require('./config/redis');

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
connectRedis().then(async () => {
    // Reset online users count on server start
    await resetOnlineUsersCount();
    console.log('Online users count reset to 0 on server start');
});

// Middleware Files
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const messageRoutes = require("./routes/message.route");
const conversationRoutes = require("./routes/conversation.route");
const apiLimiter = require('./middlewares/rateLimit');

// Middlewares
app.use(express.json());
app.use(cors());

// Serve static files from frontend/www directory
app.use(express.static('frontend/www'));

// Root route to serve frontend
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/frontend/www/index.html');
});

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'NodeLabs Test Case API Documentation'
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/conversations", conversationRoutes);

// Rate limiting middleware (sadece API için)
app.use('/api', apiLimiter);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server health status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Server is running
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2024-01-01T12:00:00.000Z
 */
app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "Server is running",
        timestamp: new Date().toISOString()
    });
});

// Online users tracking
const onlineUsers = new Set();

// Function to sync Redis with actual online users count
const syncOnlineUsersCount = async () => {
    try {
        const actualCount = onlineUsers.size;
        await setOnlineUsersCount(actualCount);
        io.emit('online_users_count', { count: actualCount });
        console.log(`Online users synced: ${actualCount}`);
        return actualCount;
    } catch (error) {
        console.error('Error syncing online users count:', error);
        // Fallback to local count if Redis fails
        const localCount = onlineUsers.size;
        io.emit('online_users_count', { count: localCount });
        console.log(`Online users (fallback): ${localCount}`);
        return localCount;
    }
};

// Function to sync Redis Set with local online users
const syncOnlineUsersSet = async () => {
    try {
        // Clear Redis Set and add current online users
        await resetOnlineUsersCount();
        for (const userId of onlineUsers) {
            await addOnlineUser(userId);
        }
        console.log(`Online users set synced: ${onlineUsers.size} users`);
    } catch (error) {
        console.error('Error syncing online users set:', error);
    }
};

/**
 * @swagger
 * /api/stats/online-users:
 *   get:
 *     summary: Get online users count
 *     tags: [Statistics]
 *     responses:
 *       200:
 *         description: Online users count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     onlineUsers:
 *                       type: integer
 *                       example: 5
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-01-01T12:00:00.000Z
 */
app.get("/api/stats/online-users", async (req, res) => {
    try {
        // Sync Redis with actual count first
        const count = await syncOnlineUsersCount();
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

/**
 * @swagger
 * /api/stats/online-users-list:
 *   get:
 *     summary: Get online users list
 *     tags: [Statistics]
 *     responses:
 *       200:
 *         description: Online users list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     onlineUsers:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"]
 *                     count:
 *                       type: integer
 *                       example: 2
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-01-01T12:00:00.000Z
 */
app.get("/api/stats/online-users-list", async (req, res) => {
    try {
        const onlineUsersList = await getOnlineUsers();
        res.json({
            success: true,
            data: {
                onlineUsers: onlineUsersList,
                count: onlineUsersList.length,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Get online users list error:', error);
        res.json({
            success: true,
            data: {
                onlineUsers: Array.from(onlineUsers),
                count: onlineUsers.size,
                timestamp: new Date().toISOString()
            }
        });
    }
});

/**
 * @swagger
 * /api/stats/user-online/{userId}:
 *   get:
 *     summary: Check if specific user is online
 *     tags: [Statistics]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to check
 *     responses:
 *       200:
 *         description: User online status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     isOnline:
 *                       type: boolean
 *                       example: true
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-01-01T12:00:00.000Z
 */
app.get("/api/stats/user-online/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const isOnline = await isUserOnline(userId);
        res.json({
            success: true,
            data: {
                userId,
                isOnline,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Check user online status error:', error);
        res.json({
            success: true,
            data: {
                userId: req.params.userId,
                isOnline: onlineUsers.has(req.params.userId),
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
            await addOnlineUser(userId);
            socket.broadcast.emit('user_online', { userId });
            // Sync Redis with actual count
            await syncOnlineUsersCount();
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
            await removeOnlineUser(userId);
            socket.broadcast.emit('user_offline', { userId });
            // Sync Redis with actual count
            await syncOnlineUsersCount();
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

// Serve frontend for all non-API routes
app.get('*', (req, res) => {
    // Don't serve frontend for API routes
    if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
        return res.status(404).json({
            success: false,
            message: 'Route not found'
        });
    }
    // Serve the frontend for all other routes
    res.sendFile('index.html', { root: 'frontend/www' });
});

// RabbitMQ Consumer'ı başlat
const { startConsumer, setSocketIO } = require('./jobs/consumeAutoMessages');
require('./jobs/scheduleAutoMessages');
require('./jobs/queueAutoMessages');
setSocketIO(io);
startConsumer();

// Graceful shutdown handler
const gracefulShutdown = async (signal) => {
    console.log(`\nReceived ${signal}. Starting graceful shutdown...`);
    
    try {
        // Reset online users count to 0
        await resetOnlineUsersCount();
        console.log('Online users count reset to 0');
        
        // Close server
        server.close(() => {
            console.log('HTTP server closed');
            process.exit(0);
        });
        
        // Force exit after 10 seconds if graceful shutdown fails
        setTimeout(() => {
            console.error('Could not close connections in time, forcefully shutting down');
            process.exit(1);
        }, 10000);
        
    } catch (error) {
        console.error('Error during graceful shutdown:', error);
        process.exit(1);
    }
};

// Listen for shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Listen   
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`API Base URL: http://localhost:${PORT}/api`);
});
