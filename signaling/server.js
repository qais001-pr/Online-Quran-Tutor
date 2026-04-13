const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
        transports: ['websocket', 'polling'],
    },
});
io.on('connection', socket => {
    console.log('User connected:', socket.id);
    socket.on('join-room', roomId => {

        socket.join(roomId);

        // console.log(`User ${socket.id} joined room ${roomId}`);

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
        console.log('CAll Accepted')
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
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });

    socket.on('end-call', data => {
        const { message, room } = data;
        console.log('Message:  ', message)
        console.log('Room id: ', room)
        socket.to(room).emit('success-end-call', 'User has Left the Class Successfully')
    })
});
const PORT = 4000;

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});