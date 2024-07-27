import React, { useState } from 'react'
import socket from '../Socket';
import { useNavigate } from 'react-router-dom';
import '../style/Joining.css';
import Avatars from '../components/Avatars';


export default function JoinRoom() {
    const [roomNumber, setRoomNumber] = useState();
    const [chosenAvatar, setChosenAvatar] = useState(null);
    const [avatarError, setAvatarError] = useState(false)
    const navigate = useNavigate();

    const inputHandler = (e) => {
        setRoomNumber(e.target.value)
    }

    const avatarHandler = (avatar) => {
        setAvatarError(false)
        setChosenAvatar(avatar)
    }

    const submitHandler = () => {
        if (chosenAvatar == null) {
            setAvatarError(true)
        }
        else if (roomNumber) {
            socket.emit('joinRoom', roomNumber);
            navigate('/waiting', { state: { roomNumber, isHost: false } });
        }
        else {

        }
    }
    return (
        <div className='joining-room'>
            <input type="text" placeholder='ROOM NUMBER' value={roomNumber} onChange={inputHandler}></input>
            <div className='avatar-list'>
                <h2 style={{ color: `${avatarError ? 'red' : '#fff'}` }}>CHOOSE AVATAR</h2>
                <Avatars avatarHandler={avatarHandler} />
            </div>
            <button className='joinRoom-btn' onClick={submitHandler}>PLAY</button>
        </div>
    )
}
