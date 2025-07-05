// Node Modules
const http = require("http");
const express = require("express");
const cors = require("cors");

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

// Middleware Files
const authRoutes = require("./routes/auth.route");

// Middlewares
app.use(express.json());
app.use(cors());

// Auth Routes
app.use("/auth", authRoutes);


// Socket.IO connection handling
io.on("connection", (socket) => {
    console.log("A user connected");
    socket.join("generalRoom");
    socket.emit("message", "Welcome to the server");

    socket.on("message", (data) => {
        console.log(data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});


// Listen   
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
