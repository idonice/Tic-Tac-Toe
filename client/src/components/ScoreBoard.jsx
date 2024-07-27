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
    const [player1, player2] = players;
    const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8];

    return (
        <div className='score-board'>
            <div className='player-score'>
                <div className="player-score__avatar" style={{ backgroundImage: `url(${avatars[player1.avatar]})` }} />
                <div className="player-score__points">
                    {player1.points}
                </div>
            </div>
            <div className='player-score'>
                <div className="player-score__avatar" style={{ backgroundImage: `url(${avatars[player2.avatar]})` }} />
                <div className="player-score__points">
                    {player2.points}
                </div>
            </div>
        </div>
    )
}
