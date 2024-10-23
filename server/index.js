// server/index.js

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors({
    origin: 'https://tic-tac-toe-tan-psi.vercel.app/',
    methods: ['GET', 'POST'],
    credentials: true,
}));
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: "*" } });

const rooms = {};

io.on('connection', socket => {
    let roomNumber;

    socket.on('createRoom', (selectedAvatar, selectedSign, name) => {
        console.log(selectedAvatar);
        roomNumber = generateRoomNumber()
        rooms[roomNumber] = {
            // players: [socket],
            board: Array(9).fill(null),
            names: [name, null],
            scores: [0, 0],
            avatars: [selectedAvatar, null],
            hostTurn: true,
            hostSign: selectedSign,
            onePlayerMode: true
        };
        roomNumber = String(roomNumber);
        socket.join(roomNumber);
        sockets = Array.from(io.sockets.adapter.rooms.get(roomNumber));
        io.to(roomNumber).emit('roomCreated', roomNumber);
    });

    socket.on('playAlone', roomNumber => {
        // roomNumber = String(roomNumber);
        rooms[roomNumber].names[1] = 'ninja';
        rooms[roomNumber].avatars[1] = '/static/media/botAvatar.bf70853f8bb7d3fadef272164dbd7e99.svg'
        const onePlayerMode = true;
        io.to(roomNumber).emit('startGame', roomNumber, rooms[roomNumber], onePlayerMode);
    })

    socket.on('joinRoom', (roomNumber, selectedAvatar, name) => {
        roomNumber = String(roomNumber);
        if (!rooms[roomNumber]) {
            socket.emit('roomError', 'Room does not exist');
            return;
        } else if (io.sockets.adapter.rooms.get(roomNumber).size == 2) {
            socket.emit('roomError', 'Room is full');
            return;
        }
        else {
            socket.join(roomNumber);
            rooms[roomNumber].avatars[1] = selectedAvatar;
            rooms[roomNumber].names[1] = name;
            rooms[roomNumber].onePlayerMode = false;
            sockets = Array.from(io.sockets.adapter.rooms.get(roomNumber));
            if (io.sockets.adapter.rooms.get(roomNumber).size == 2) {
                const onePlayerMode = false;
                io.to(roomNumber).emit('startGame', roomNumber, rooms[roomNumber], onePlayerMode);
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
        if (rooms[roomNumber].onePlayerMode && !calculateWinner(rooms[roomNumber].board)) {
            rooms[roomNumber].hostTurn = !rooms[roomNumber].hostTurn;
            rooms[roomNumber].board = getNextBoardState(rooms[roomNumber].board, rooms[roomNumber].hostSign);
            const delayTime = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000;
            setTimeout(() => {
                io.to(roomNumber).emit('updateBoard', rooms[roomNumber].board, rooms[roomNumber].hostTurn)
            }, delayTime);
        }

    })

    socket.on('gameOver', (calculatedWinner, roomNumber) => {
        const hostSign = rooms[roomNumber].hostSign;
        let winnerIndex = 0;
        if (calculatedWinner != hostSign) {
            console.log('guest won');
            winnerIndex = 1;
        }
        io.to(roomNumber).emit('updateScoreBoard', winnerIndex)

    })

    socket.on('gameRestart', (roomNumber) => {
        rooms[roomNumber].board = Array(9).fill(null);
        if (rooms[roomNumber].onePlayerMode) {
            rooms[roomNumber].hostTurn = true
        }
        roomNumber = String(roomNumber);
        io.to(roomNumber).emit('restart')

    })
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(process.env.PORT, () => {
    console.log(`Server running on port 5000`);
});

const generateRoomNumber = () => {
    return Math.floor(10000 + Math.random() * 90000);
};

const getNextBoardState = (board, playerSign) => {
    const sign = playerSign == 'x' ? 'o' : 'x';
    const availableSpots = board
        .map((value, index) => (value === null ? index : null))
        .filter(index => index !== null);

    if (availableSpots.length === 0) {
        return board;
    }

    const randomIndex = Math.floor(Math.random() * availableSpots.length);
    const chosenSpot = availableSpots[randomIndex];

    const newBoard = board.slice();
    newBoard[chosenSpot] = sign;
    console.log(newBoard);
    return newBoard;
};

const calculateWinner = (squares) => {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
};

const getBestMove = (board, playerSign) => {
    const opponentSign = playerSign === 'x' ? 'o' : 'x';

    const minimax = (newBoard, depth, isMaximizing) => {
        const winner = calculateWinner(newBoard);
        if (winner === playerSign) {
            return 10 - depth;
        } else if (winner === opponentSign) {
            return depth - 10;
        } else if (!newBoard.includes(null)) {
            return 0;
        }

        const availableSpots = newBoard
            .map((value, index) => (value === null ? index : null))
            .filter(index => index !== null);

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (const spot of availableSpots) {
                newBoard[spot] = playerSign;
                const score = minimax(newBoard, depth + 1, false);
                newBoard[spot] = null;
                bestScore = Math.max(bestScore, score);
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (const spot of availableSpots) {
                newBoard[spot] = opponentSign;
                const score = minimax(newBoard, depth + 1, true);
                newBoard[spot] = null;
                bestScore = Math.min(bestScore, score);
            }
            return bestScore;
        }
    };

    let bestScore = -Infinity;
    let bestMove;
    const availableSpots = board
        .map((value, index) => (value === null ? index : null))
        .filter(index => index !== null);

    for (const spot of availableSpots) {
        board[spot] = playerSign;
        const score = minimax(board, 0, false);
        board[spot] = null;
        if (score > bestScore) {
            bestScore = score;
            bestMove = spot;
        }
    }

    // Prioritize winning moves
    for (const spot of availableSpots) {
        board[spot] = playerSign;
        if (calculateWinner(board) === playerSign) {
            return spot;
        }
        board[spot] = null;
    }

    // Prioritize blocking opponent's winning moves
    for (const spot of availableSpots) {
        board[spot] = opponentSign;
        if (calculateWinner(board) === opponentSign) {
            return spot;
        }
        board[spot] = null;
    }

    return bestMove;
};
