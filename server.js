import express from 'express'
import cors from 'cors'
import { Server } from 'socket.io'
import http from 'http'
import { Socket } from 'dgram';

const app = express();

const FRONTEND_URL = "https://chatbot-socketio.vercel.app";

app.get('/', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Socket.IO Server is running. Use a client to connect via WebSocket.' 
    });
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: FRONTEND_URL,
        methods: ["GET", "PUT"]
    }
})

io.on("connection", (Socket) => {
    console.log(Socket.id)

    Socket.on("join_room", (data) => {
        Socket.join(data);
        console.log(`User ID :- ${Socket.id} joined room : ${data}`)
    })

    Socket.on("send_message", (data) => {console.log("send message data", data)
        Socket.to(data.room).emit("receive_message", data)


    })

    Socket.on("disconnect", () => {
        console.log("User Disconnected..", Socket.id)
    })

});

app.use(cors());

module.exports = server;