import React, { useState } from 'react'
import socket from '../Socket';
import { useNavigate } from 'react-router-dom';
import '../style/Home.css';

export default function Home() {
    const [roomNumber, setRoomNumber] = useState();
    const navigate = useNavigate();

    const joinHandler = () => {
        navigate('/join');
    }

    // const submitHandler = () => {
    //     socket.emit('joinRoom', roomNumber);
    //     navigate('/waiting', { state: { roomNumber, isHost: false } });
    // }


    const createGameHandler = () => {
        socket.emit('createRoom');
        console.log('test');
        socket.on('roomCreated', roomNumber => {
            console.log(`room created : ${roomNumber}`);
            navigate('/waiting', { state: { roomNumber, isHost: true } });
        });
    };
    return (
        <div className='home-page'>
            <div className='tic-tac-toe'>
                <h1 className='pulse'>TIC</h1>
                <h1 className='pulse'>TAC</h1>
                <h1 className='pulse'>TOE</h1>
            </div>
            <button className='join-btn' onClick={joinHandler}>JOIN ROOM</button>
            <button className='create-btn' onClick={createGameHandler}>CREATE GAME</button>
        </div>
    )
}
