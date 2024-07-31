
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BounceLoader from "react-spinners/ClipLoader";

import socket from '../Socket';

export default function WaitingRoom() {
    const navigate = useNavigate();
    const location = useLocation();
    const roomNumber = location.state?.roomNumber;
    const hostAvatar = location.state?.hostAvatar;
    const [selectedSign, setSelectedSign] = useState('X');
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    useEffect(() => {
        socket.on('startGame', (roomNumber, room, onePlayerMode) => {
            navigate('/game', { state: { roomNumber, room, isHost: true, onePlayerMode } });
        });

        return () => {
            // socket.off('startGame', startGameListener);
        };
    }, [navigate]);

    const handleSignChange = (event) => {
        setSelectedSign(event.target.value);
    };

    const playAloneHandler = () => {
        socket.emit('playAlone', roomNumber);
    };

    return (
        <div>
            <h3>WAITING FOR OPPONENT</h3>
            <BounceLoader color='#55eeff' />
            <p style={{ marginBottom: '-20px' }}>ROOM NUMBER</p>
            <h1>{roomNumber}</h1>
            <button className='green-btn' onClick={playAloneHandler}>PLAY AGAINST </button>
        </div>
    );
}
