const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const socket = require('socket.io');
const path = require('path');

const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("DB connection successful")
}).catch(err => {
    console.log(err.message)
})

const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messagesRoutes');

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);


// ======= Deployment ========
if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve()

    app.use(express.static(path.join(__dirname, "/client/build")))

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    })

} else {
    app.get('/', (req, res) => {
        res.send("API is running...")
    })
}

// ======= Deployment ========


const server = app.listen(process.env.PORT, () => {
    console.log(`Server Started on Port ${process.env.PORT}`)
});

const io = socket(server, {
    cors: {
        origin: process.env.ORIGIN,
        credentials: true
    }
})

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id)
    })

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-receive", data.message)
        }
    })
})


