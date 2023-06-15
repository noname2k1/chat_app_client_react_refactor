import React from 'react';
import { Link } from 'react-router-dom';
import './NoRoom.scss';
import { useLanguageSelector } from '~/component/redux/selector';
const NoRoom = () => {
    const currentLanguage = useLanguageSelector().currentLanguage;
    return (
        <div className='no-room-container'>
            {currentLanguage.noRoom}.
            <Link to='/new'>&nbsp;{currentLanguage.newMessage}</Link>
        </div>
    );
};

export default NoRoom;
