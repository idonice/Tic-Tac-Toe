
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import socket from '../Socket';

export default function WaitingRoom() {
    const navigate = useNavigate();
    const location = useLocation();
    const roomNumber = location.state?.roomNumber;
    const hostAvatar = location.state?.hostAvatar;
    const [selectedSign, setSelectedSign] = useState('X');
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    useEffect(() => {
        socket.on('startGame', (roomNumber, room) => {
            navigate('/game', { state: { roomNumber, room, isHost: true } });
        });

        return () => {
            // socket.off('startGame', startGameListener);
        };
    }, [navigate]);

    const handleSignChange = (event) => {
        setSelectedSign(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsFormSubmitted(true);
        console.log(selectedSign);
        socket.emit('selectSign', selectedSign, roomNumber);
    };

    return (
        <div>
            <h2>Waiting Room</h2>
            <p>Room Number: {roomNumber}</p>
            {/* {isHost && !isFormSubmitted && ( // Show form only to the isHost
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
            )} */}
        </div>
    );
}
