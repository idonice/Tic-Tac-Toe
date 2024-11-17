import socket from '../Socket';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Board from '../components/Board';
import ScoreBoard from '../components/ScoreBoard';
import BounceLoader from "react-spinners/ClipLoader";


const Game = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [hostTurn, setHostTurn] = useState(true);
    const [winner, setWinner] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [playerLeft, setPlayerLeft] = useState(false);
    const [scores, setScores] = useState([0, 0]);
    const [waiting, setWaiting] = useState(false);
    const [status, setStatus] = useState('');

    const location = useLocation();
    const navigate = useNavigate();

    const roomNumber = location.state?.roomNumber;
    const isHost = location.state?.isHost;
    const room = location.state?.room;
    const onePlayerMode = location.state?.onePlayerMode;
    const hostSign = room.hostSign;
    const name = isHost ? room.names[0].toUpperCase() : room.names[1].toUpperCase();
    const opponentName = !isHost ? room.names[0].toUpperCase() : room.names[1].toUpperCase();

    useEffect(() => {
        if (!socket.connected) {
            navigate('/');
        }

        return () => {
            if (socket.connected) {
                console.log('exit');
                socket.emit('leftRoom', roomNumber);
                socket.disconnect();
            }
        };
    }, [navigate]);

    useEffect(() => {

        socket.on('move', (board) => {
            setBoard(board);
        });

        socket.on('updateBoard', (board, hostTurn) => {
            setHostTurn(hostTurn);
            setBoard(board);
        });

        socket.on('gameOver', (newScores, board, hostTurn, winner) => {
            setScores(newScores);
            setBoard(board);
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
        socket.on('stopGame', () => {
            console.log('stop');

            setGameOver(true);
            setPlayerLeft(true);
        })

        socket.on('restart', () => {
            setGameOver(false);
            setWaiting(false);
            setBoard(Array(9).fill(null))
            setWinner(null)
            if (onePlayerMode) {
                setHostTurn(true)
            }
        })

        return () => {
            socket.off('move');
            socket.off('updateBoard');
        };
    }, []);

    useEffect(() => {
        const winner = calculateWinner(board);
        if (winner) {
            if (winner == hostSign) {
                setScores(prevScores => {
                    return [prevScores[0] + 1, prevScores[1]];
                });
            } else if (winner != 'draw') {
                setScores(prevScores => {
                    return [prevScores[0], prevScores[1] + 1];
                });
            }
            setWinner(winner);
            setGameOver(true);
        }
    }, [board]);

    const restartHandler = (roomNumber) => {
        socket.emit('waitingToRestart', roomNumber, isHost);
        setWaiting(true)
    }

    const clickHandler = (index) => {
        if (!board[index] && !gameOver && (isHost === hostTurn)) {
            if (socket) {
                socket.emit('move', index, roomNumber);
            }
        }
    };


    useEffect(() => {
        const hostName = room.names[0].toUpperCase();
        const guestName = room.names[1].toUpperCase();
        let newStatus;

        if (winner === 'draw') {
            newStatus = 'DRAW!';
        } else if (winner) {
            newStatus = `${winner === hostSign ? hostName : guestName} WON!`;
        } else {
            newStatus = onePlayerMode
                ? (hostTurn ? 'YOUR TURN' : "JINJA'S TURN")
                : ((hostTurn && isHost) || (!hostTurn && !isHost))
                    ? 'YOUR TURN'
                    : (isHost && !hostTurn)
                        ? `${guestName}'S TURN`
                        : `${hostName}'S TURN`;
        }


        setStatus(newStatus);
    }, [winner, hostTurn, isHost, onePlayerMode, room.names, hostSign]);

    return (
        <div className="game">
            <ScoreBoard players={[{ points: scores[0], avatar: room.avatars[0], name: room.names[0] }, { points: scores[1], avatar: (room.avatars[1] || '/static/media/botAvatar.svg'), name: room.names[1] }]} />
            <div className="game-board">
                <Board board={board} onClick={clickHandler} />
            </div>
            <div className="game-info">
                {(!waiting && !playerLeft) && <div>{status}</div>}
                {(gameOver && waiting) && <div >{`${'WAITING FOR ' + opponentName}`} <div style={{ marginTop: '2px' }}><BounceLoader size={'20px'} color='#6d53f7' /></div>
                </div>}
                {playerLeft && <div style={{ color: 'red' }}>{opponentName} LEFT THE ROOM</div>}
            </div>
            {(gameOver && !waiting && !playerLeft) && <button className='green-btn' onClick={() => restartHandler(roomNumber)}>PLAY AGAIN</button>}
            {gameOver && <button className='red-btn' onClick={() => navigate('/')}>LEAVE ROOM</button>}
        </div>
    );
};

const calculateWinner = (board) => {
    const availableSpots = board
        .map((value, index) => (value === null ? index : null))
        .filter(index => index !== null);

    if (availableSpots.length === 0) {
        return 'draw';
    }
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
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
};

export default Game;
