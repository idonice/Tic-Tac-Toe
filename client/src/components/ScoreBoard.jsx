import React from 'react'
import '../style/game.css';

export default function ScoreBoard({ players }) {
    const [host, guest] = players;

    return (
        <div className='score-board'>
            <div>
                <div className="player-score__avatar" style={{ backgroundImage: `url(${host.avatar})` }} />
                <span>{host.name}</span>
            </div>
            <div className="player-score__points">
                {host.points}
            </div>
            <div className='dash' />
            <div className="player-score__points">
                {guest.points}
            </div>
            <div>
                <div className="player-score__avatar" style={{ backgroundImage: `url(${guest.avatar})` }} />
                <span>{guest.name}</span>
            </div>
        </div>
    )
}
