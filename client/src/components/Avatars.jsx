import React from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../style/Avatars.css';
import AvatarCarousel from './AvatarCarousel';
import avatar1 from '../assets/images/avatar1.svg';
import avatar2 from '../assets/images/avatar2.svg';
import avatar3 from '../assets/images/avatar3.svg';
import avatar4 from '../assets/images/avatar4.svg';
import avatar5 from '../assets/images/avatar5.svg';
import avatar6 from '../assets/images/avatar6.svg';
import avatar7 from '../assets/images/avatar7.svg';
import avatar8 from '../assets/images/avatar8.svg';
import avatar9 from '../assets/images/avatar9.svg';
import avatar10 from '../assets/images/botAvatar.svg';

const avatars = [
    avatar1,
    avatar2,
    avatar3,
    avatar4,
    avatar5,
    avatar6,
    avatar7,
    avatar8,
    avatar9,
    avatar10
];

const Avatars = ({ avatarHandler }) => {
    return (
        <div>
            <AvatarCarousel avatars={avatars} avatarSubmitHandler={avatarHandler} />
        </div>
    );
};

export default Avatars;
