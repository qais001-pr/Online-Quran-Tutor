const { Socket } = require('socket.io');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const activeuserList = []
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
        transports: ['websocket', 'polling'],
    },
});

io.on('connection', socket => {
    // console.log(socket);
    console.log('User connected:', socket.id);

    socket.on("user-connected", (data) => {

        const { user } = data;
        // Prevent undefined user
        if (!user || !user.userID) {
            console.log("Invalid User");
            return;
        }
        // Check existing user
        const checkUser = activeuserList.find(
            (u) => u.userID === user.userID
        );
        // Add user if not exists
        if (!checkUser) {
            activeuserList.push({
                userID: user.userID,
                socketID: socket.id,
            });

        } else {
            console.log(
                "User already connected:",
                user.userID
            );
        }
        console.log("Active Users:", activeuserList);
        io.emit("user-connected-list", activeuserList);

    });
    socket.on('join-room', roomId => {

        socket.join(roomId);

        // Broadcast to all other users in the room
        socket.to(roomId).emit('user-join-successfully', {
            socketid: socket.id,
            roomID: roomId
        });
        socket.emit('user-join-successfully', {
            socketid: socket.id,
            roomID: roomId
        });

    });
    socket.on('offer', data => {
        console.log('Offer' + data.offer);
        socket.to(data.room).emit('offer', {
            offer: data.offer,
            from: socket.id,
        });
        socket.to(data.room).emit('incoming-call', { from: data.room, offer: data.offer })
    });
    socket.on('answer', data => {
        console.log('Call Accepted')
        console.log('Answer' + data.answer);

        socket.to(data.room).emit('answer', {
            answer: data.answer,
            from: socket.id,
        });
    });
    socket.on('ice-candidate', data => {
        socket.to(data.room).emit('ice-candidate', {
            candidate: data.candidate,
            from: socket.id,
        });
    });
    socket.on('onClick-Ayats', data => {
        const { index, room } = data;
        console.log(index)
        console.log(room)
        socket.to(room).emit('onClick-Ayats', { index: index, room: room })
    })
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });

    socket.on('end-call', data => {
        const { room } = data;

        // 1. Room mein sabko batao ke call khatam ho gayi hai
        // socket.to(room).emit() sirf doosre user ko bhejta hai
        // io.in(room).emit() sabko (including sender) bhejta hai
        io.in(room).emit('success-end-call', {
            message: 'Call has been terminated',
        });

        // 2. Sabhi users ko room se disconnect/leave karwao
        const socketsInRoom = io.sockets.adapter.rooms.get(room);
        if (socketsInRoom) {
            for (const socketId of socketsInRoom) {
                const clientSocket = io.sockets.sockets.get(socketId);
                if (clientSocket) {
                    clientSocket.leave(room);
                }
            }
        }
    });
});
const PORT = 4000;

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});