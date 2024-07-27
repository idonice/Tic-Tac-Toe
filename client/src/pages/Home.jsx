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
            <button className='join-btn' onClick={joinHandler}>Join</button>
            <button className='create-btn' onClick={createGameHandler}>Create a game</button>
        </div>
    )
}
