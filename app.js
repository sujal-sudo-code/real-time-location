const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const users = {};

io.on('connection', (socket) => {
    users[socket.id] = socket;

    socket.on('send-location', (data) => {
        io.emit('recieve-location', { id: socket.id, ...data });
    });

    socket.on('disconnect', () => {
        io.emit('user-disconnected', { id: socket.id });
        delete users[socket.id];
    });
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});