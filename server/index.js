// server/index.js

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: "*" } });

const rooms = {};

io.on('connection', socket => {
    let roomNumber;

    socket.on('createRoom', (selectedAvatar, selectedSign, name) => {
        roomNumber = generateRoomNumber()
        rooms[roomNumber] = {
            // players: [socket],
            board: Array(9).fill(null),
            names: [name, null],
            scores: [0, 0],
            avatars: [selectedAvatar, null],
            hostTurn: true,
            hostSign: selectedSign
        };
        roomNumber = String(roomNumber);
        socket.join(roomNumber);
        sockets = Array.from(io.sockets.adapter.rooms.get(roomNumber));
        io.to(roomNumber).emit('roomCreated', roomNumber);
    });

    socket.on('joinRoom', (roomNumber, selectedAvatar, name) => {
        roomNumber = String(roomNumber);
        if (!rooms[roomNumber]) {
            socket.emit('error', 'Room does not exist');
            return;
        } else if (io.sockets.adapter.rooms.get(roomNumber).size == 2) {
            socket.emit('error', 'Room is full');
            return;
        }
        else {
            socket.join(roomNumber);
            rooms[roomNumber].avatars[1] = selectedAvatar;
            rooms[roomNumber].names[1] = name;
            sockets = Array.from(io.sockets.adapter.rooms.get(roomNumber));
            if (io.sockets.adapter.rooms.get(roomNumber).size == 2) {
                io.to(roomNumber).emit('startGame', roomNumber, rooms[roomNumber]);
            }
        }
    });

    socket.on('selectSign', (selectedSign, roomNumber) => {
        rooms[roomNumber].hostSign = selectedSign;
        if (io.sockets.adapter.rooms.get(roomNumber)?.size === 2) {
            io.to(roomNumber).emit('startGame', roomNumber, rooms[roomNumber].hostTurn);
        }
    })


    socket.on('move', (index, roomNumber) => {
        const playerSign = rooms[roomNumber].hostTurn ? rooms[roomNumber].hostSign : (rooms[roomNumber].hostSign === 'x' ? 'o' : 'x');
        rooms[roomNumber].board[index] = playerSign;
        rooms[roomNumber].hostTurn = !rooms[roomNumber].hostTurn;
        io.to(roomNumber).emit('updateBoard', rooms[roomNumber].board, rooms[roomNumber].hostTurn)

    })

    socket.on('gameOver', (calculatedWinner, roomNumber) => {
        const hostSign = rooms[roomNumber].hostSign;
        let winnerIndex = 0;
        console.log(calculatedWinner, hostSign);
        if (calculatedWinner != hostSign) {
            console.log('guest won');
            winnerIndex = 1;
        }
        io.to(roomNumber).emit('updateScoreBoard', winnerIndex)

    })

    socket.on('gameRestart', (roomNumber) => {
        rooms[roomNumber].board = Array(9).fill(null);
        roomNumber = String(roomNumber);
        io.to(roomNumber).emit('restart')

    })
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(5000, () => {
    console.log(`Server running on port 5000`);
});

const generateRoomNumber = () => {
    return Math.floor(10000 + Math.random() * 90000);
};