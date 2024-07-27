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

    socket.on('createRoom', () => {
        roomNumber = generateRoomNumber();
        //******************* */
        socket.join(roomNumber);
        console.log(socket.id);
        sockets = Array.from(io.sockets.adapter.rooms.get(roomNumber));
        console.log(`${sockets.length} in room: ${sockets[0]} `);
        //******************* */
        rooms[roomNumber] = {
            players: [socket],
            // players: [socket.id],
            board: Array(9).fill(null),
            scores: [0, 0],
            avatars: [],
            hostTurn: true,
            hostSign: null
        };
        socket.emit('roomCreated', roomNumber);
    });

    socket.on('joinRoom', (roomNumber) => {
        //******************* */
        socket.join(roomNumber);
        rooms[roomNumber].players.push(socket);
        playersInRoom = rooms[roomNumber]?.players.map((p) => p.id);
        sockets = Array.from(io.sockets.adapter.rooms.get(roomNumber));
        console.log(`${sockets.length} in room: ${sockets[0]}`);
        //******************* */
        if (rooms[roomNumber].players.length === 2) {
            console.log('test');
            if (rooms[roomNumber].hostSign) {
                console.log('host:', rooms[roomNumber].hostSign);
                io.to(playersInRoom).emit('startGame', roomNumber, rooms[roomNumber].hostTurn);
                // io.to(roomNumber).emit('startGame', roomNumber, rooms[roomNumber].hostTurn);
            }
        }
    });

    socket.on('selectSign', (selectedSign, roomNumber) => {
        playersInRoom = rooms[roomNumber]?.players.map((p) => p.id);
        rooms[roomNumber].hostSign = selectedSign;
        console.log(selectedSign);
        if (playersInRoom && playersInRoom.length === 2) {
            io.to(playersInRoom).emit('startGame', roomNumber, rooms[roomNumber].hostTurn);
            // io.to(roomNumber).emit('startGame', roomNumber, rooms[roomNumber].hostTurn);
        }
    })


    socket.on('move', (index, roomNumber) => {
        console.log(rooms[roomNumber]);
        playersInRoom = rooms[roomNumber]?.players.map((p) => p.id);
        const playerSign = rooms[roomNumber].hostTurn ? rooms[roomNumber].hostSign : (rooms[roomNumber].hostSign === 'X' ? 'O' : 'X');
        rooms[roomNumber].board[index] = playerSign;
        rooms[roomNumber].hostTurn = !rooms[roomNumber].hostTurn;
        io.to(playersInRoom).emit('updateBoard', rooms[roomNumber].board, rooms[roomNumber].hostTurn)
        io.to(roomNumber).emit('updateBoard', rooms[roomNumber].board, rooms[roomNumber].hostTurn)

    })

    socket.on('gameOver', (calculatedWinner, roomNumber) => {
        playersInRoom = rooms[roomNumber]?.players.map((p) => p.id);
        const hostSign = rooms[roomNumber]?.hostSign;
        // if (calculatedWinner == hostSign) {
        //     console.log(hostSign, calculatedWinner);
        //     rooms[roomNumber].scores[0] += 1;
        // } else {
        //     rooms[roomNumber].scores[1] += 1;
        // }
        // io.to(playersInRoom).emit('updateScoreBoard', rooms[roomNumber].scores)

    })

    socket.on('gameRestart', (roomNumber) => {
        playersInRoom = rooms[roomNumber]?.players.map((p) => p.id);
        rooms[roomNumber].board = Array(9).fill(null);
        io.to(playersInRoom).emit('restart')

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