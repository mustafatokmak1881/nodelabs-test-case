// Node Modules
const http = require("http");
const express = require("express");


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


// Routes
app.get("/", (req, res) => {
    res.send("Hello World");
});


// Socket.IO connection handling
io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});


// Listen   
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
