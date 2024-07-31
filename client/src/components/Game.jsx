// Game.js (client-side)
import socket from '../Socket';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Board from './Board';
import ScoreBoard from './ScoreBoard';

const Game = () => {
    const [squares, setSquares] = useState(Array(9).fill(null));
    const [hostTurn, setHostTurn] = useState(true);
    const [winner, setWinner] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [scores, setScores] = useState([0, 0]);
    const location = useLocation();
    const roomNumber = location.state?.roomNumber;
    const isHost = location.state?.isHost;
    const room = location.state?.room;
    const onePlayerMode = location.state?.onePlayerMode;
    // const room.avatars[0] = location.state?.room.avatars[0];
    // const room.avatars[1] = location.state?.room.avatars[1];
    const hostSign = room.hostSign;
    console.log(onePlayerMode);
    const guestSign = hostSign == 'x' ? 'o' : 'x';
    useEffect(() => {
        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {

        socket.on('move', (board) => {
            setSquares(board);
        });

        socket.on('updateBoard', (board, hostTurn) => {
            setHostTurn(hostTurn);
            setSquares(board);
        });

        socket.on('gameOver', (newScores, board, hostTurn, winner) => {
            setScores(newScores);
            setSquares(board);
            setHostTurn(hostTurn);
            setWinner(winner);
            setGameOver(true);
        });
        socket.on('updateScoreBoard', winnerIndex => {
            setScores(prevScores => {
                const newScores = [...prevScores];
                newScores[winnerIndex] += 1;
                return newScores;
            });
        })
        socket.on('restart', () => {
            setGameOver(false);
            setSquares(Array(9).fill(null))
            setWinner(null)
        })
        return () => {
            socket.off('move');
            socket.off('updateBoard');
        };
    }, []);

    useEffect(() => {
        const calculatedWinner = calculateWinner(squares);
        if (calculatedWinner) {
            // if (calculateWinner == hostSign) {
            //     setScores(prevScores => {
            //         return [prevScores[0] + 1, prevScores[1]];
            //     });
            // } else {
            //     setScores(prevScores => {
            //         return [prevScores[0], prevScores[1] + 1];
            //     });
            // }
            setWinner(calculatedWinner);
            setGameOver(true);
            socket.emit('gameOver', calculatedWinner, roomNumber)
        }
    }, [squares]);

    const gameRestart = (roomNumber) => {
        socket.emit('gameRestart', roomNumber);
    }

    const handleClick = (index) => {
        if (!squares[index] && !gameOver && (isHost === hostTurn)) {
            if (socket) {
                socket.emit('move', index, roomNumber);
            }
        }
    };

    // const status = winner ? `WINNER: ${winner == hostSign ? room.names[0] : room.names[1]}` : `${(hostTurn && isHost) || (!hostTurn && !isHost) ? 'YOUR TURN' : "OPPONENT'S TURN"}`;
    const status = winner
        ? `${winner == hostSign ? room.names[0] : room.names[1]} WON!`
        : (onePlayerMode
            ? (hostTurn ? 'YOUR TURN' : "JINJA'S TURN")
            : ((hostTurn && isHost) || (!hostTurn && !isHost)
                ? 'YOUR TURN'
                : "OPPONENT'S TURN")
        );

    return (
        <div className="game">
            <ScoreBoard players={[{ points: scores[0], avatar: room.avatars[0], name: room.names[0] }, { points: scores[1], avatar: (room.avatars[1] || '/static/media/botAvatar.svg'), name: room.names[1] }]} />
            <div className="game-board">
                <Board squares={squares} onClick={handleClick} />
            </div>
            <div className="game-info">
                <div>{status}</div>
            </div>
            {gameOver && <button className='green-btn' onClick={() => gameRestart(roomNumber)}>PLAY AGAIN</button>}
        </div>
    );
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

export default Game;
