import React from 'react';
import {
    useComponentSelector,
    useLanguageSelector,
    useAuthSelector,
} from '~/component/redux/selector';
import './ListOfMembers.scss';
import { HiMenuAlt3 } from 'react-icons/hi';
const ListOfMembers = () => {
    const currentLanguage = useLanguageSelector().currentLanguage;
    const { currentRoom } = useComponentSelector();
    const host = currentRoom.member.find((host) => {
        return currentRoom.host === host._id;
    });
    const { profile } = useAuthSelector();
    return (
        <ul className='list-members'>
            {currentRoom.member.length > 0 &&
                currentRoom.member.map((member) => (
                    <li key={member._id} className='list-members-item'>
                        <div className='avatar'>
                            <img
                                src={member.avatarlink}
                                alt={member.name}
                                width='100%'
                                height='100%'
                            />
                        </div>
                        <span className='name'>{member.name}</span>
                        {member._id === host._id && (
                            <span className='host'>
                                {currentLanguage.roomHost}
                            </span>
                        )}
                        {member._id !== host._id && host._id === profile._id && (
                            <div className='options-wrapper'>
                                <HiMenuAlt3 />
                                <div className='options-table'>
                                    <div className='promote option-item'>
                                        {currentLanguage.promote}
                                    </div>
                                    <div className='demote option-item'>
                                        {currentLanguage.demote}
                                    </div>
                                    <div className='kich option-item'>
                                        {currentLanguage.kick}
                                    </div>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
        </ul>
    );
};

export default ListOfMembers;
