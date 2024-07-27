
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import socket from '../Socket';

export default function WaitingRoom() {
    const navigate = useNavigate();
    const location = useLocation();
    const roomNumber = location.state?.roomNumber;
    const isHost = location.state?.isHost;
    const [selectedSign, setSelectedSign] = useState('X');
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    useEffect(() => {
        const startGameListener = (roomNumber, selectedSign) => {
            navigate('/game', { state: { roomNumber, isHost, selectedSign } });
        };

        socket.on('startGame', startGameListener);

        return () => {
            socket.off('startGame', startGameListener);
        };
    }, [navigate, isHost]);

    const handleSignChange = (event) => {
        setSelectedSign(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsFormSubmitted(true);
        socket.emit('selectSign', selectedSign, roomNumber);
    };

    return (
        <div>
            <h2>Waiting Room</h2>
            <p>Room Number: {roomNumber}</p>
            {isHost && !isFormSubmitted && ( // Show form only to the isHost
                <form onSubmit={handleSubmit}>
                    <label>
                        Choose your sign:
                        <select value={selectedSign} onChange={handleSignChange}>
                            <option value="X">X</option>
                            <option value="O">O</option>
                        </select>
                    </label>
                    <button type="submit">Submit</button>
                </form>
            )}
        </div>
    );
}
