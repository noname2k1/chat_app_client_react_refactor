import moment from 'moment';
import React from 'react';
import {
    useComponentSelector,
    useLanguageSelector,
} from '~/component/redux/selector';
import './RoomDetails.scss';
const RoomDetails = () => {
    const currentLanguage = useLanguageSelector().currentLanguage;
    const { currentRoom } = useComponentSelector();
    const host = currentRoom.member.find((host) => {
        return currentRoom.host === host._id;
    });
    return (
        <div className='room-details-container'>
            <div className='avatar'>
                <img
                    src={currentRoom.avatar}
                    alt='room-avatar'
                    width='100%'
                    height='100%'
                />
            </div>
            <div className='room-infor'>
                <div className='room-name'>
                    {currentLanguage.roomName}:&nbsp;{currentRoom.name}
                </div>
                <div className='room-host'>
                    {currentLanguage.roomHost}:&nbsp;{host.name}
                </div>
                <div className='room-created-at'>
                    {currentLanguage.roomCreatedAt}:&nbsp;
                    {moment(currentRoom.createdAt).format(
                        'DD/MM/YYYY HH:mm:ss'
                    )}
                </div>
                <div className='room-member-total'>
                    {currentLanguage.memberTotal}:&nbsp;
                    {currentRoom.member.length}
                </div>
            </div>
        </div>
    );
};

export default RoomDetails;
