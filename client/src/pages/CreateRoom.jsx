import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import socket from '../Socket';
import Avatars from '../components/Avatars'
import '../style/Create.css';

export default function CreateRoom() {
    const navigate = useNavigate();
    const [selectedSign, setSelectedSign] = useState(null);
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [name, setName] = useState('')
    const [nameError, setNameError] = useState(false)
    const [error, setError] = useState(false);

    const avatarHandler = (avatar) => {
        setSelectedAvatar(avatar)
    }
    const nameHandler = (e) => {
        setNameError(false)
        setName(e.target.value)
    }
    const selectSignHandler = (sign) => {
        setSelectedSign(sign)
        setError(false)
    }

    const goClickHandler = () => {
        if (!selectedSign || !selectedAvatar) {
            console.log(selectedSign, selectedAvatar);
            setError(true)
        } else if (!name) {
            setNameError(true);
        }
        else {
            socket.emit('createRoom', selectedAvatar, selectedSign, name);
        }
    }
    useEffect(() => {
        socket.on('roomCreated', roomNumber => {
            navigate('/waiting', { state: { roomNumber } })
        })
        return () => {
        };
    }, []);


    return (
        <div className='create-room'>
            <input type="text" placeholder='YOUR NAME' value={name} onChange={nameHandler} style={{ border: `${nameError ? '2px solid red' : ''}` }}></input>

            <h2 className={`${error && 'pulse'}`} style={{ color: `${error ? 'red' : 'white'}`, fontSize: `${error && '24px'}` }}>CHOOSE AVATAR & SYMBOL</h2>
            <div className="avatars-wrapper" onClick={() => setError(false)}>
                <Avatars avatarHandler={avatarHandler} />
            </div>
            <div className='symbols'>
                <div className={`symbol x-symbol ${selectedSign == 'x' && 'active-symbol'}`}><span onClick={() => selectSignHandler('x')}>x</span></div>
                <div className={`symbol o-symbol ${selectedSign == 'o' && 'active-symbol'}`}><span onClick={() => selectSignHandler('o')}>o</span></div>
            </div>
            <button className='go-btn' onClick={goClickHandler}>GO</button>
            <button className='red-btn' style={{ width: '70px' }} onClick={() => navigate('/')}>BACK</button>

        </div>
    )
}
