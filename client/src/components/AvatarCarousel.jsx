import React, { useState } from 'react';
import '../style/Avatars.css';
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

const AvatarCarousel = ({ avatars, avatarSubmitHandler }) => {
    const [currentIndex, setCurrentIndex] = useState(null);
    const [chosenAvatar, setChosenAvatar] = useState(null);

    const avatarHandler = (avatar) => {
        setChosenAvatar(avatar)
        avatarSubmitHandler(avatar)
    }
    const nextAvatar = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % avatars.length);
    };

    const prevAvatar = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + avatars.length) % avatars.length);
    };

    return (
        <div className="carousel-container">
            <button className="carousel-button" onClick={prevAvatar}><IoIosArrowBack color='white' size={20} /></button>
            <div className="avatar-carousel">
                {avatars.slice(currentIndex, currentIndex + 3).map((avatar, index) => (
                    <div key={index} className="avatar-slide">
                        <div className="avatar-image" onClick={() => { avatarHandler(avatar) }} style={{ backgroundImage: `url(${avatar})`, border: `${avatar == chosenAvatar ? '2px solid #fff' : ''}` }}></div>
                    </div>
                ))}
            </div>
            <button className="carousel-button" onClick={nextAvatar}><IoIosArrowForward color='white' size={20} />
            </button>
        </div>
    );
};

export default AvatarCarousel;
