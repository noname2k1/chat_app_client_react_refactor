import React, { useState } from 'react';
import clsx from 'clsx';
import './Content.scss';
import { BsCaretDownFill, BsCaretUpFill } from 'react-icons/bs';
import { FaPhoneAlt, FaVideo, FaSearch } from 'react-icons/fa';
import { MdOutlineContentCopy } from 'react-icons/md';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import socket from '~/tools/socket.io';
import MessageDropDown from '../dropdown/RoomDropDown/RoomDropDown';
import {
    useLanguageSelector,
    useUsersOnlineSelector,
    useAuthSelector,
    useComponentSelector,
    // useThemeSelector,
} from '../redux/selector';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { componentSlice } from '../redux/slices';
import Loading from '../custom/loading/Loading';
import Toast from '../custom/toast/Toast';
import { patchRoom } from '~/services/roomService';
import Message from './Message/Message';
// import { useCallContext } from '../Call/callContext';
import MessageForm from './MessageForm/MessageForm';
import SearchInConversation from './SearchInConversation/SearchInConversation';
import ZoomFile from '../custom/ZoomFile/ZoomFile';
import ReactLightBox from '../custom/ZoomFile/ReactLightBox/ReactLightBox';
import Tooltip from '~/component/custom/tooltip/Tooltip';
import { getRoomByProfileid } from '~/services/roomService';
import { getRoom } from '~/services/roomService';

const Content = () => {
    // const callContext = useCallContext();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    //redux-toolkit - selectors
    const usersOnline = useUsersOnlineSelector().usersOnline;
    const currentLanguage = useLanguageSelector().currentLanguage;
    const { selectedRoomid, searchInConversation, currentRoom, viewFileModal } =
        useComponentSelector();
    const profile = useAuthSelector().profile;
    //hooks
    const { profileid, roomid } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [requestsTableExpand, setRequestsTableExpand] = useState(false);
    const [notification, setNotification] = useState({
        enabled: false,
        content: '',
    });
    React.useEffect(() => {
        if (profileid) {
            setIsLoading(true);
            const getOtherProfileByProfileID = async () => {
                const data = await getRoomByProfileid(profileid);
                if (data) {
                    setIsLoading(false);
                    navigate('/rooms/room/' + data.room._id, { replace: true });
                } else {
                    setIsLoading(false);
                    navigate('/not-found', { replace: true });
                }
            };
            getOtherProfileByProfileID();
        }
        // eslint-disable-next-line
    }, [profileid]);
    React.useEffect(() => {
        if (roomid) {
            setIsLoading(true);
            const getOtherProfileByRoomID = async () => {
                const data = await getRoom(roomid);
                if (data) {
                    const room = data.room;
                    if (room.mode === 'private') {
                        const otherProfile = room.member.find(
                            (mem) => mem._id !== profile._id
                        );
                        room['roomavatar'] = otherProfile.avatarlink;
                        room['name'] = otherProfile.name;
                        room['profileid'] = otherProfile._id;
                    }
                    socket.emit('load-room', profile._id);
                    dispatch(componentSlice.actions.setCurrentRoom(room));
                    setIsLoading(false);
                } else {
                    navigate('/not-found', { replace: true });
                    setIsLoading(false);
                }
            };
            getOtherProfileByRoomID();
        } else {
        }
        //eslint-disable-next-line
    }, [roomid]);

    document.addEventListener('click', (e) => {
        const otherMessageText = e.target.closest('.other-message-text');
        const myMessageText = e.target.closest('.my-message-text');
        if (!otherMessageText && !myMessageText) {
            document.querySelectorAll('.options').forEach((each) => {
                each.classList.remove('active');
            });
        }
    });
    const handleShowProfile = (e) => {
        if (
            JSON.stringify(currentRoom) !== '{}' &&
            currentRoom.mode !== 'private'
        ) {
            e.preventDefault();
            e.target.style.cursor = 'auto';
        } else {
            e.target.style.cursor = 'pointer';
        }
    };
    // accept/deny requests
    const handleRequest = async (e) => {
        e.preventDefault();
        const data = await patchRoom(
            e.target.dataset.profileid,
            selectedRoomid,
            '$pull',
            'request'
        );
        if (data.status === 'success') {
            dispatch(componentSlice.actions.setCurrentRoom(data.room));
        } else {
            console.log(data.message);
        }
        if (e.target.classList.contains('deny')) {
            socket.emit(
                'decline-request',
                selectedRoomid,
                e.target.dataset.profileid
            );
        }
        if (e.target.classList.contains('accept')) {
            const data = await patchRoom(
                e.target.dataset.profileid,
                selectedRoomid,
                '$push',
                'member'
            );
            if (data.status === 'success') {
                dispatch(componentSlice.actions.setCurrentRoom(data.room));
                socket.emit(
                    'accept-request',
                    selectedRoomid,
                    e.target.dataset.profileid
                );
            } else {
                console.log(data.message);
            }
        }
    };
    React.useEffect(() => {
        if (!selectedRoomid || roomid) {
            dispatch(componentSlice.actions.setRoomid(roomid));
        }
        // eslint-disable-next-line
    }, [currentRoom._id, roomid]);
    React.useEffect(() => {
        socket.on('request-success', (room) => {
            dispatch(componentSlice.actions.setCurrentRoom(room));
            dispatch(componentSlice.actions.setRoomid(room._id));
        });
        socket.on('notification-new-member', (roomid, profileName) => {
            if (roomid === selectedRoomid) {
                setNotification({
                    enabled: true,
                    content: `< ${profileName} > ${currentLanguage.joinRoom}`,
                });
            }
        });
        socket.on('notification-join-room-success', (profileid, roomName) => {
            if (profile._id === profileid) {
                setNotification({
                    enabled: true,
                    content: `[ ${roomName} ] ${currentLanguage.acceptRequest}`,
                });
            }
        });
        socket.on('notification-decline-request', (roomName, profileid) => {
            if (profile._id === profileid) {
                setNotification({
                    enabled: true,
                    content: `[ ${roomName} ] ${currentLanguage.declineRequest}`,
                });
            }
        });
        socket.on('notification-leave-room', (room, profileName) => {
            setNotification({
                enabled: true,
                content: `[ ${profileName} ] ${currentLanguage.leaveRoom} [ ${room.name} ]`,
            });
            if (room._id === currentRoom._id) {
                console.log('leave-room');
                dispatch(componentSlice.actions.setCurrentRoom(room));
            }
        });
    }, [profile._id, currentRoom]);

    //call
    const handleCallAudio = (e) => {
        // e.preventDefault();
        // dispatch(componentSlice.actions.setCall(true));
        // if (currentRoom.mode === 'private') {
        //     const userToCall = usersOnline.find(
        //         (user) => user.profileid === currentRoom.profileid
        //     );
        //     if (userToCall) {
        //         callContext.callUser(profile, userToCall, 'audio');
        //     }
        // }
        // if (currentRoom.mode === 'room') {
        //     socket.emit('call-room-audio-request', selectedRoomid);
        // }
        dispatch(componentSlice.actions.setPropertie({ comingSoon: true }));
    };
    const handleCallVideo = (e) => {
        // e.preventDefault();
        // dispatch(componentSlice.actions.setCall(true));
        // if (currentRoom.mode === 'private') {
        //     console.log('call-user');
        //     const userToCall = usersOnline.find(
        //         (user) => user.profileid === currentRoom.profileid
        //     );
        //     if (userToCall) {
        //         callContext.callUser(profile, userToCall, 'video');
        //     }
        // }
        // if (currentRoom.mode === 'room') {
        //     socket.emit('call-room-video-request', selectedRoomid, socket.id);
        // }
        dispatch(componentSlice.actions.setPropertie({ comingSoon: true }));
    };

    const handleOpenRoomDropdown = (e) => {
        dispatch(
            componentSlice.actions.setDropdown({
                roomDropDown: true,
            })
        );
    };
    return (
        <div
            className={clsx('content-container', {
                [currentRoom.backgroundColor]:
                    currentRoom.backgroundColor &&
                    window.location.pathname.indexOf('/rooms/room/') !== -1,
            })}
        >
            <ReactLightBox />
            {viewFileModal.enable && <ZoomFile />}
            {searchInConversation && <SearchInConversation />}
            {isLoading && <Loading />}
            {notification.enabled && (
                <Toast
                    content={notification.content}
                    setNotification={setNotification}
                />
            )}
            {/* Header */}
            <div className="content-header">
                <div className="message-container">
                    <Link
                        to={`/profile/${
                            currentRoom.profileid || currentRoom._id
                        }`}
                        onClick={handleShowProfile}
                        onMouseOver={handleShowProfile}
                    >
                        <Tooltip
                            title={`${currentRoom.name}${currentLanguage.tooltipFriendProfile}`}
                            position="right"
                            disabled={currentRoom.mode === 'room'}
                        >
                            <div className="account-avatar">
                                <img
                                    src={
                                        currentRoom.roomavatar ||
                                        currentRoom.avatar
                                    }
                                    alt="acc-avatar"
                                    className="account-avatar__img"
                                    width="100%"
                                    height="100%"
                                    onLoad={() => setIsLoading(false)}
                                    onError={() => setIsLoading(false)}
                                />
                                {currentRoom.mode !== 'room' && (
                                    <div
                                        className={clsx('active-status', {
                                            online: usersOnline?.find(
                                                (user) =>
                                                    user.profileid ===
                                                        profileid ||
                                                    user.profileid ===
                                                        currentRoom.profileid
                                            ),
                                        })}
                                    ></div>
                                )}
                            </div>
                        </Tooltip>
                    </Link>
                    <div className="other-user-text">
                        <div className="message-name">
                            {currentRoom.roomname || currentRoom.name}
                            &nbsp;
                            <span>
                                {currentRoom.mode === 'private'
                                    ? '<' + currentLanguage.personal + '>'
                                    : '<' + currentLanguage.room + '>'}
                            </span>
                        </div>
                        <div className="room-id">
                            @{currentRoom.profileid || currentRoom._id}
                            <button
                                className="copy-id"
                                onClick={() => {
                                    const copyID =
                                        navigator.clipboard.writeText(
                                            document.querySelector('.room-id')
                                                .innerText
                                        );
                                    if (copyID) {
                                        alert(currentLanguage.copyID);
                                    }
                                }}
                            >
                                <MdOutlineContentCopy />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="message-feature">
                    <Tooltip title={currentLanguage.tooltipCall}>
                        <button onClick={handleCallAudio}>
                            <FaPhoneAlt size={20} />
                        </button>
                    </Tooltip>
                    <div className="separator"></div>
                    <Tooltip title={currentLanguage.tooltipVideoCall}>
                        <button onClick={handleCallVideo}>
                            <FaVideo size={20} />
                        </button>
                    </Tooltip>
                    <div className="separator"></div>
                    <Tooltip title={currentLanguage.tooltipSearchInCoversation}>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                dispatch(
                                    componentSlice.actions.setSearchInConversation(
                                        true
                                    )
                                );
                            }}
                        >
                            <FaSearch size={20} />
                        </button>
                    </Tooltip>
                    <div className="separator"></div>
                    <button
                        className={clsx('message-options', {
                            active: useComponentSelector().dropdown
                                .roomDropDown,
                        })}
                        onClick={handleOpenRoomDropdown}
                    >
                        <HiOutlineDotsHorizontal size={20} />
                    </button>
                    <MessageDropDown />
                </div>
                {JSON.stringify(currentRoom) !== '{}' &&
                    currentRoom?.request?.length > 0 && (
                        <div
                            className={clsx('requests-table', {
                                shrink: !requestsTableExpand,
                            })}
                        >
                            <div className="request-list">
                                {currentRoom.request.map((request) => {
                                    return (
                                        <div
                                            className="request-item"
                                            key={request._id}
                                        >
                                            <Link
                                                to={`/rooms/profile/${request._id}`}
                                            >
                                                <div className="request-item-avatar">
                                                    <img
                                                        src={request.avatarlink}
                                                        alt="avt"
                                                        width="100%"
                                                        height="100%"
                                                    />
                                                </div>
                                                <div className="request-item-name">
                                                    {request.name}
                                                </div>
                                            </Link>
                                            <div className="request-item-options">
                                                <div
                                                    className="request-option accept"
                                                    data-profileid={request._id}
                                                    onClick={handleRequest}
                                                >
                                                    {currentLanguage.accept}
                                                </div>
                                                <div
                                                    className="request-option deny"
                                                    data-profileid={request._id}
                                                    onClick={handleRequest}
                                                >
                                                    {currentLanguage.decline}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div
                                className="expand"
                                onClick={() =>
                                    setRequestsTableExpand(!requestsTableExpand)
                                }
                            >
                                {!requestsTableExpand && <BsCaretDownFill />}
                                {requestsTableExpand && <BsCaretUpFill />}
                                <div className="requests-count">
                                    {currentRoom.request.length}
                                </div>
                            </div>
                        </div>
                    )}
            </div>
            {/* Messages */}
            <div className="content-body">
                <Message loadingProp={isLoading} />
                {/* table-chat */}
                <MessageForm />
            </div>
        </div>
    );
};

export default Content;
