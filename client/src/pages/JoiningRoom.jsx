import React, { useState, useEffect } from 'react'
import socket from '../Socket';
import { useNavigate } from 'react-router-dom';
import '../style/Joining.css';
import Avatars from '../components/Avatars';


export default function JoinRoom() {
    const [roomNumber, setRoomNumber] = useState();
    const [selectedAvatar, setSelectedAvater] = useState(null);
    const [name, setName] = useState('')
    const [avatarError, setAvatarError] = useState(false)
    const [nameError, setNameError] = useState(false)

    const navigate = useNavigate();

    const roomHandler = (e) => {
        setRoomNumber(e.target.value)
    }

    const nameHandler = (e) => {
        setName(e.target.value);
        setNameError(false);
    }


    const avatarHandler = (avatar) => {
        setAvatarError(false)
        setSelectedAvater(avatar)
    }

    const submitHandler = () => {
        if (!selectedAvatar) {
            setAvatarError(true)
        } else if (!name) {
            setNameError(true)
        }
        else if (roomNumber) {
            socket.emit('joinRoom', roomNumber, selectedAvatar, name);
        }
    }

    useEffect(() => {
        socket.on('startGame', (roomNumber, room) => {
            console.log('test');
            navigate('/game', { state: { roomNumber, room, isHost: false } });
        });
        return () => {
        };
    }, []);

    return (
        <div className='joining-room'>
            <input type="text" placeholder='YOUR NAME' value={name} onChange={nameHandler} style={{ border: `${nameError ? '2px solid red' : ''}` }}></input>
            <input type="text" placeholder='ROOM NUMBER' value={roomNumber} onChange={roomHandler} ></input>
            <div className='avatar-list'>
                <h2 style={{ color: `${avatarError ? 'red' : '#fff'}` }}>CHOOSE AVATAR</h2>
                <Avatars avatarHandler={avatarHandler} />
            </div>
            <button className='joinRoom-btn' onClick={submitHandler}>PLAY</button>
        </div>
    )
}
