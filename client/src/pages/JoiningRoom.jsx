import React, { useState } from 'react'
import socket from '../Socket';
import { useNavigate } from 'react-router-dom';
import '../style/Joining.css';


export default function JoinRoom() {
    const [roomNumber, setRoomNumber] = useState();
    const navigate = useNavigate();

    const inputHandler = (e) => {
        setRoomNumber(e.target.value)
    }

    const submitHandler = () => {
        if (roomNumber) {
            socket.emit('joinRoom', roomNumber);
            navigate('/waiting', { state: { roomNumber, isHost: false } });
        }
    }
    return (
        <div className='joining-room'>
            <input type="text" placeholder='Room number' value={roomNumber} onChange={inputHandler}></input>
            <button className='joinRoom-btn' onClick={submitHandler}>PLAY !!!</button>        </div>
    )
}
