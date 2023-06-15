import React from 'react';
import axios from 'axios';
import clsx from 'clsx';
import './RoomDropDown.scss';
import {
    AiFillInfoCircle,
    AiFillCaretDown,
    AiFillCaretUp,
} from 'react-icons/ai';
import { CgUserList } from 'react-icons/cg';
import {
    TbReport,
    TbLogout,
    TbPalette,
    TbLockOff,
    TbBellOff,
} from 'react-icons/tb';
import { MdOutlinePermMedia } from 'react-icons/md';
import { TiTick } from 'react-icons/ti';
import {
    useAuthSelector,
    useComponentSelector,
    useLanguageSelector,
} from '~/component/redux/selector';
import QuitModal from '~/component/custom/modal/QuitModal/QuitModal';
import { changeRoomBackground, patchRoom } from '~/services/roomService';
import socket from '~/tools/socket.io';
import { useDispatch } from 'react-redux';
import { componentSlice } from '~/component/redux/slices';

const RoomDropDown = () => {
    const currentLanguage = useLanguageSelector().currentLanguage;
    const profile = useAuthSelector().profile;
    const { selectedRoomid, currentRoom } = useComponentSelector();
    const [modal, setModal] = React.useState(false);
    const [background, setBackground] = React.useState('');
    const [backgroundColorTable, setBackgroundColorTable] =
        React.useState(false);
    const { roomDropDown } = useComponentSelector().dropdown;
    const dispatch = useDispatch();
    const handleLeaveRoom = async () => {
        // console.log('leave room');
        const data = await patchRoom(
            profile._id,
            selectedRoomid,
            '$pull',
            'member'
        );
        // console.log(data);
        if (data.status === 'success') {
            socket.emit('leave-room', selectedRoomid, profile);
        } else {
            console.log('leave room failed');
            console.log(data.message);
        }
    };
    React.useEffect(() => {
        setBackground(currentRoom.backgroundColor);
    }, [currentRoom]);

    const handleCloseDropDown = (e) => {
        dispatch(componentSlice.actions.setDropdown({ roomDropDown: false }));
        setBackgroundColorTable(false);
    };

    const openRoomDetailsModal = () => {
        dispatch(
            componentSlice.actions.setDropdownItem({
                roomOptions: {
                    enabled: true,
                    roomDetails: true,
                },
            })
        );
        handleCloseDropDown();
    };

    const openListOfMembersModal = () => {
        dispatch(
            componentSlice.actions.setDropdownItem({
                roomOptions: {
                    enabled: true,
                    listOfMembers: true,
                },
            })
        );
        handleCloseDropDown();
    };
    const openActivityReportsModal = () => {
        dispatch(
            componentSlice.actions.setDropdownItem({
                roomOptions: {
                    enabled: true,
                    activityReports: true,
                },
            })
        );
        handleCloseDropDown();
    };
    const handleSetBackgroundTable = (e) => {
        if (backgroundColorTable) {
            setBackgroundColorTable(false);
        } else {
            setBackgroundColorTable(true);
        }
    };

    const systemColors = [
        { id: 'default' },
        { id: 'yellow' },
        { id: 'red' },
        { id: 'green' },
        { id: 'blue' },
        { id: 'purple' },
        { id: 'pink' },
        { id: 'orange' },
        { id: 'gray' },
        { id: 'teal' },
        { id: 'deep-blue' },
        { id: 'middle-blue' },
    ];
    const handleSetBackground = async (e, colorid) => {
        setBackground(colorid);
        const res = await changeRoomBackground(selectedRoomid, colorid);
        if (res.status === 'success') {
            socket.emit('update-room', res.room);
        }
    };
    const openMessageMediaFilesLinks = () => {
        dispatch(componentSlice.actions.setMessageMediaFilesLinksPage(true));
        handleCloseDropDown();
    };

    const handleBlockOther = async () => {
        const otherid = currentRoom.member.find(
            (m) => m._id !== profile._id
        )._id;
        try {
            const data = await patchRoom(
                otherid,
                selectedRoomid,
                '$set',
                'blocked'
            );
            if (data.status === 'success') {
                socket.emit('update-room', data.room);
            }
        } catch (error) {
            console.error(error);
        }

        handleCloseDropDown();
    };

    //socket-io
    React.useEffect(() => {
        socket.on('update-room', (room) => {
            // console.log('update-room');
            const newRoom = room;
            if (newRoom.mode === 'private') {
                const otherProfile = newRoom.member.find(
                    (mem) => mem._id !== profile._id
                );
                newRoom['roomavatar'] = otherProfile.avatarlink;
                newRoom['name'] = otherProfile.name;
                newRoom['profileid'] = otherProfile._id;
            }
            dispatch(componentSlice.actions.setCurrentRoom({ ...newRoom }));
        });
    }, []);

    return (
        <>
            <div
                className={clsx('message dropdown-container', {
                    active: roomDropDown,
                })}
            >
                <div
                    className="dropdown-item"
                    onClick={() => {
                        handleSetBackgroundTable();
                    }}
                >
                    <TbPalette />
                    &nbsp;
                    {currentLanguage.backgroundColor}&nbsp;
                    {!backgroundColorTable ? (
                        <AiFillCaretUp />
                    ) : (
                        <AiFillCaretDown />
                    )}
                </div>
                <div
                    className={clsx('background-table', {
                        active: backgroundColorTable,
                    })}
                >
                    {systemColors.map((color) => (
                        <div
                            className="color-outside"
                            key={color.id}
                            onClick={(e) => handleSetBackground(e, color.id)}
                        >
                            <div className={`color-inside ${color.id}`}>
                                {color.id === background && (
                                    <TiTick size={20} />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                {/* <div className='dropdown-item'>
                    <TbBellOff />
                    &nbsp;{currentLanguage.muteNotification}
                </div> */}
                <div
                    className="dropdown-item"
                    onClick={openMessageMediaFilesLinks}
                >
                    <MdOutlinePermMedia />
                    &nbsp;{currentLanguage.viewMediaFilesLinks}
                </div>
                {currentRoom.mode === 'room' && (
                    <>
                        <div
                            className="dropdown-item"
                            onClick={openRoomDetailsModal}
                        >
                            <AiFillInfoCircle />
                            &nbsp;{currentLanguage.roomDetails}
                        </div>
                        <div
                            className="dropdown-item"
                            onClick={openListOfMembersModal}
                        >
                            <CgUserList />
                            &nbsp;{currentLanguage.listOfMembers}
                        </div>
                        <div
                            className="dropdown-item"
                            onClick={openActivityReportsModal}
                        >
                            <TbReport />
                            &nbsp;{currentLanguage.activityReports}
                        </div>
                        <div className="separate"></div>
                        <div
                            className="dropdown-item"
                            onClick={() => {
                                setModal(true);
                                handleCloseDropDown();
                            }}
                        >
                            <TbLogout />
                            &nbsp;{currentLanguage.quitRoom}
                        </div>
                        {modal && (
                            <QuitModal
                                visible={{ modal, setModal }}
                                title={currentLanguage.quitRoom}
                                purpose="leaveroom"
                                callback={handleLeaveRoom}
                            />
                        )}
                    </>
                )}
                {currentRoom.mode === 'private' && (
                    <>
                        <div className="separate"></div>
                        <div
                            className="dropdown-item"
                            onClick={handleBlockOther}
                        >
                            <TbLockOff />
                            &nbsp;
                            {currentLanguage.block} - {currentRoom.name}
                        </div>
                    </>
                )}
            </div>
            {roomDropDown && (
                <div className="overlay" onClick={handleCloseDropDown}></div>
            )}
        </>
    );
};

export default RoomDropDown;
