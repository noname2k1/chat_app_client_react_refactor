import React from 'react';
import {
    useComponentSelector,
    useLanguageSelector,
    useAuthSelector,
} from '~/component/redux/selector';
import './ListOfMembers.scss';
import { HiMenuAlt3 } from 'react-icons/hi';
import { AiOutlineUsergroupAdd, AiOutlineCheck } from 'react-icons/ai';
import Tooltip from '~/component/custom/tooltip/Tooltip';
import { searchProfile } from '~/services/profileService';
import { patchRoom } from '~/services/roomService';
import { useDispatch } from 'react-redux';
import { componentSlice } from '~/component/redux/slices';
import socket from '~/tools/socket.io';

const ListOfMembers = () => {
    const currentLanguage = useLanguageSelector().currentLanguage;
    const { currentRoom } = useComponentSelector();
    const { profile } = useAuthSelector();
    const searchInputRef = React.useRef(null);

    const [profileDetail, setProfileDetail] = React.useState('');
    const [listMember, setListMember] = React.useState([]);
    const dispatch = useDispatch();

    const handleClear = () => {
        setProfileDetail('');
        searchInputRef.current.focus();
    };

    const handleAddMember = async (member) => {
        try {
            // console.log(member);
            const res = await patchRoom(
                member._id,
                currentRoom._id,
                '$push',
                'member'
            );
            // console.log(res);
            dispatch(componentSlice.actions.setCurrentRoom(res.room));
            socket.emit('add-new-member', {
                senderid: profile._id,
                receiverid: member._id,
                roomid: currentRoom._id,
            });
        } catch (error) {
            console.log(error);
        }
    };

    React.useEffect(() => {
        if (profileDetail !== '') {
            searchProfile(profileDetail)
                .then((res) => {
                    // console.log(res);
                    res.profiles = res.profiles.filter(
                        (prof) => prof._id !== profile._id
                    );
                    setListMember(res.profiles);
                })
                .catch((err) => console.log(err));
        } else {
            setListMember([]);
        }
    }, [profileDetail]);

    return (
        <ul className="list-members">
            <div className="add-member-wrapper">
                <div className="add-member__input-wrapper">
                    <input
                        type="text"
                        placeholder={currentLanguage.addMemberPlaceholder}
                        value={profileDetail}
                        className="add-member__input"
                        onInput={(e) => setProfileDetail(e.target.value)}
                        ref={searchInputRef}
                    />
                    <button className="clear__btn" onClick={handleClear}>
                        x
                    </button>
                </div>
                {listMember.length > 0 && (
                    <ul className="results">
                        {listMember.map((member) => {
                            if (member._id === profile._id) return null;
                            return (
                                <li className="result" key={member._id}>
                                    <div className="user-infor">
                                        <img
                                            src={member.avatarlink}
                                            alt={member.name}
                                        />
                                        <span className="name">
                                            {member.name}
                                        </span>
                                    </div>
                                    {currentRoom.member?.find(
                                        (mem) => mem._id === member._id
                                    ) ? (
                                        <span className="check">
                                            <AiOutlineCheck size={20} />
                                        </span>
                                    ) : (
                                        <Tooltip
                                            title={
                                                currentLanguage.tooltipAddMember
                                            }
                                            position={'left'}
                                        >
                                            <button
                                                className="add-member__btn"
                                                onClick={() =>
                                                    handleAddMember(member)
                                                }
                                            >
                                                {<AiOutlineUsergroupAdd />}
                                            </button>
                                        </Tooltip>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
            {currentRoom.member?.length > 0 &&
                currentRoom.member.map((member) => (
                    <li key={member._id} className="list-members-item">
                        <div className="avatar">
                            <img
                                src={member.avatarlink}
                                alt={member.name}
                                width="100%"
                                height="100%"
                            />
                        </div>
                        <span className="name">{member.name}</span>
                        {member._id === currentRoom.host && (
                            <span className="host">
                                {currentLanguage.roomHost}
                            </span>
                        )}
                        {member._id !== currentRoom.host &&
                            currentRoom.host === profile._id && (
                                <div className="options-wrapper">
                                    <HiMenuAlt3 />
                                    <div className="options-table">
                                        <div className="promote option-item">
                                            {currentLanguage.promote}
                                        </div>
                                        <div className="demote option-item">
                                            {currentLanguage.demote}
                                        </div>
                                        <div className="kich option-item">
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
