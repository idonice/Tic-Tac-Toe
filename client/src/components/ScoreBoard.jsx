import React from 'react'
import avatar1 from '../assets/images/avatar1.svg';
import avatar2 from '../assets/images/avatar2.svg';
import avatar3 from '../assets/images/avatar3.svg';
import avatar4 from '../assets/images/avatar4.svg';
import avatar5 from '../assets/images/avatar5.svg';
import avatar6 from '../assets/images/avatar6.svg';
import avatar7 from '../assets/images/avatar7.svg';
import avatar8 from '../assets/images/avatar8.svg';
import '../style/game.css';

export default function ScoreBoard({ players }) {
    const [host, guest] = players;
    // const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8];

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
