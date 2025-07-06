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

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "Server is running",
        timestamp: new Date().toISOString()
    });
});

// Socket.IO connection handling
io.on("connection", (socket) => {
    console.log("A user connected");
    socket.join("generalRoom");
    socket.emit("message", "Welcome to the server");

    socket.on("message", (data) => {
        console.log("Received message:", data);
        // Broadcast message to all users in the room
        io.to("generalRoom").emit("message", {
            message: data,
            timestamp: new Date().toISOString()
        });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

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
