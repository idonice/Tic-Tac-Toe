import React from 'react'
import { useNavigate } from 'react-router-dom';
import '../style/Home.css';

export default function Home() {
    const navigate = useNavigate();

    const joinHandler = () => {
        navigate('/join');
    }

    const createGameHandler = () => {
        navigate('/create');
    };
    return (
        <div className='home-page'>
            <div className='tic-tac-toe'>
                <h1 className='pulse' style={{ color: '#fc8aff' }}>TIC</h1>
                <h1 className='pulse' style={{ color: '#ffdd17' }}>TAC</h1>
                <h1 className='pulse' style={{ color: 'blue' }}>TOE</h1>
            </div>
            <button className='join-btn' onClick={joinHandler}>JOIN ROOM</button>
            <button className='create-btn' onClick={createGameHandler}>CREATE GAME</button>
        </div>
    )
}
