import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Square from './Square';
import socket from '../Socket';
import '../style/game.css';

const Board = ({ squares, onClick }) => {
    const location = useLocation();
    const roomNumber = location.state?.roomNumber;
    useEffect(() => {
        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div className="board-layout">
            <div className='board'>
                {squares.map((value, index) => (
                    <Square key={index} value={value} onClick={() => onClick(index)} />
                ))}
            </div>
        </div >
    );
}

export default Board;
