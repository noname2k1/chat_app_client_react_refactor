import React from 'react';
import SearchBar from '../searchbar/SearchBar';
import './Daskboard.scss';
import { IoCreateOutline, IoSnowSharp } from 'react-icons/io5';
import {
    MdGroups,
    MdOutlineContentCopy,
    MdOutlineCheckCircleOutline,
    MdOutlinePersonSearch,
} from 'react-icons/md';
import { BsFillPersonLinesFill } from 'react-icons/bs';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AccountDropDown from '~/component/dropdown/AccountDropDown/AccountDropDown';
import {
    useAuthSelector,
    useLanguageSelector,
    useUsersOnlineSelector,
    useComponentSelector,
    // useThemeSelector,
} from '../redux/selector';
import socket from '~/tools/socket.io';
import clsx from 'clsx';
import Loading from '../custom/loading/Loading';
import { useDispatch } from 'react-redux';
import { componentSlice } from '../redux/slices';
import Tooltip from '../custom/tooltip/Tooltip';
import { getMyRooms, patchRoom } from '~/services/roomService';
import QuitModal from '../custom/modal/QuitModal/QuitModal';
const Daskboard = () => {
    const { profileid, roomid } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const profile = useAuthSelector().profile;
    const currentLanguage = useLanguageSelector().currentLanguage;
    const usersOnline = useUsersOnlineSelector().usersOnline;
    const {
        selectedRoomid,
        currentRoom,
        currentMessages,
        searchInConversation,
        mobileAccountsOnline,
    } = useComponentSelector();
    const [rooms, setRooms] = React.useState([]);
    const [modal, setModal] = React.useState(false);
    const [contextMenuID, setContextMenuID] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const loadRooms = async (loading = false, loadFirstRoom = false) => {
        if (loading) {
            setIsLoading(true);
        }
        try {
            const data = await getMyRooms();
            if (data.rooms?.length > 0) {
                data.rooms.forEach((room) => {
                    if (room.mode === 'private') {
                        const otherProfile = room.member.find(
                            (mem) => mem._id !== profile._id
                        );
                        room['roomavatar'] = otherProfile.avatarlink;
                        room['name'] = otherProfile.name;
                    }
                });
                const rooomidArray = data.rooms.map((room) => room._id);
                if (rooomidArray.length > 0) {
                    socket.emit('join', rooomidArray);
                }
                if (loadFirstRoom) {
                    navigate(`/rooms/room/${data.rooms[0]._id}`, {
                        replace: true,
                    });
                }
                setRooms(data.rooms);
                setIsLoading(false);
            } else {
                setRooms([]);
                navigate('/rooms/no-room', { replace: true });
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    const handleClickOthers = (profileid) => {
        if (
            currentRoom.mode === 'private' &&
            currentRoom.member.findIndex((mem) => mem._id === profileid) !== -1
        ) {
            return;
        }
        navigate(`rooms/profile/${profileid}`);
    };

    const handleClickRoomLink = (e, roomid) => {
        if (!e.target.classList.contains('active')) {
            e.target.classList.add('active');
        }
        if (currentRoom.viewer.indexOf(profile._id) === -1) {
            socket.emit('view', roomid, profile._id);
        }
        dispatch(componentSlice.actions.setRoomid(roomid));
        dispatch(componentSlice.actions.setSearchInConversation(false));
        dispatch(
            componentSlice.actions.setReplying({ enabled: false, message: {} })
        );
    };
    const handleCopyProfileid = () => {
        const copyProfileid = navigator.clipboard.writeText(`@${profile._id}`);
        if (copyProfileid) {
            alert(currentLanguage.copyID);
        }
    };
    const handleOpenRoomBox = () => {
        dispatch(componentSlice.actions.setPropertie({ roomBox: true }));
    };

    const handleOpenAccountDropdown = () => {
        dispatch(componentSlice.actions.setDropdown({ accountDropDown: true }));
    };

    const handleOpenMobileSearch = () => {
        dispatch(componentSlice.actions.setMobileSearchBar(true));
    };

    const handleOpenMobileAccountsOnline = () => {
        dispatch(componentSlice.actions.setMobileAccountsOnline(true));
    };

    const handleContextMenu = (e, roomid) => {
        e.preventDefault();
        setContextMenuID(roomid);
    };

    const handleClickOutsideContextMenu = (e) => {
        if (e.target.closest('.room-context-menu')) {
            // console.log('click inside context menu');
            return;
        } else {
            setContextMenuID('');
        }
    };

    const handleDeleteConversation = async () => {
        // console.log('delete conversation');
        try {
            const room = await patchRoom(
                profile._id,
                contextMenuID,
                '$push',
                'deleted'
            );
            dispatch(componentSlice.actions.setCurrentRoom(room));
            loadRooms();
        } catch (error) {
            console.log(error);
        }
    };

    React.useEffect(() => {
        loadRooms(true);
        window.addEventListener('click', handleClickOutsideContextMenu);
        return () => {
            window.removeEventListener('click', handleClickOutsideContextMenu);
        };
    }, []);

    React.useEffect(() => {
        // console.log('rooms', rooms);
        // console.log('currentRoom', currentRoom);
        const addNewRoom = async () => {
            if (
                rooms.findIndex((room) => room._id === currentRoom._id) ===
                    -1 &&
                rooms.length > 0 &&
                currentRoom.mode === 'private'
            ) {
                if (currentRoom.deleted.indexOf(profile._id) !== -1) {
                    try {
                        await patchRoom(
                            profile._id,
                            currentRoom._id,
                            '$pull',
                            'deleted'
                        );
                    } catch (error) {
                        console.log(error);
                    }
                }
                setRooms((prev) => [...prev, currentRoom]);
            }
        };
        addNewRoom();
    }, [currentRoom]);

    React.useEffect(() => {
        if (
            (((!roomid && !profileid) ||
                !currentRoom.member?.find((mem) => mem._id === profile._id)) &&
                rooms.length > 0 &&
                rooms[0]._id) ||
            currentRoom.deleted?.find((mem) => mem._id === profile._id)
        ) {
            navigate(`/rooms/room/${rooms[0]._id}`);
        }
    }, [roomid, rooms, profileid, currentRoom]);

    //socket.io
    React.useEffect(() => {
        socket.on('connect', () => {
            socket.emit('join', rooms);
        });
        socket.on('create-room', () => {
            loadRooms();
        });
        socket.on('add-new-member', ({ receiverid, room_id, message }) => {
            if (profile._id === receiverid) {
                loadRooms();
            }
        });
        socket.on('update-my-rooms', (profileid) => {
            if (profile._id === profileid) {
                loadRooms();
            }
        });
        socket.on('load-list-of-rooms', () => {
            loadRooms();
        });
        socket.on('leave-room', (profileid) => {
            if (profile._id === profileid) {
                loadRooms(false, true);
            }
        });
    }, []);

    return (
        <aside
            className={clsx('daskboard', {
                'z-index-unset': searchInConversation || mobileAccountsOnline,
            })}
        >
            {isLoading && <Loading />}
            {/* Daskboard header */}
            <div className="daskboard-header">
                <div className="my-user-container">
                    <Tooltip
                        title={currentLanguage.tooltipAcountOptions}
                        position="right"
                    >
                        <div
                            className="account-avatar"
                            onClick={handleOpenAccountDropdown}
                        >
                            <img
                                src={profile.avatarlink}
                                alt="acc-avatar"
                                className="account-avatar__img"
                                width="100%"
                                height="100%"
                                onError={() => setIsLoading(false)}
                            />
                        </div>
                    </Tooltip>
                    <div
                        className="my-user-text"
                        onClick={handleOpenAccountDropdown}
                    >
                        <Tooltip
                            title={currentLanguage.tooltipAcountOptions}
                            position="bottom"
                        >
                            <div className="my-user-name">{profile.name}</div>
                        </Tooltip>
                        <div
                            className="my-user-profileid"
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            @{profile._id}
                        </div>
                    </div>
                    <AccountDropDown />
                </div>

                <div className="my-user-feature">
                    <div className="top">
                        <Tooltip
                            title={currentLanguage.newMessage}
                            position="bottom"
                        >
                            <button>
                                <Link to="new">
                                    <IoCreateOutline size={25} />
                                </Link>
                            </button>
                        </Tooltip>
                        <Tooltip
                            title={currentLanguage.tooltipRoom}
                            position="bottom"
                        >
                            <button
                                className="room-feature"
                                onClick={handleOpenRoomBox}
                            >
                                <MdGroups size={25} />
                            </button>
                        </Tooltip>
                    </div>

                    <div className="bottom">
                        <Tooltip
                            title={currentLanguage.tooltipCopyID}
                            position="bottom"
                        >
                            <button onClick={handleCopyProfileid}>
                                <MdOutlineContentCopy size={20} />
                            </button>
                        </Tooltip>
                    </div>
                </div>
            </div>
            <Tooltip title={currentLanguage.tooltipFindFriend} position="right">
                <div
                    className="mobile-search__button"
                    onClick={handleOpenMobileSearch}
                >
                    <MdOutlinePersonSearch size={25} />
                </div>
            </Tooltip>
            {/* search bar */}
            <div className="search-bar-wrapper">
                <SearchBar
                    target="profile"
                    placeholder={`Enter profileid or name...`}
                />
            </div>
            {/* Online accounts - LIST */}
            <Tooltip
                title={currentLanguage.tooltipOnlineUsers}
                position="right"
            >
                <div
                    className="mobile-accounts-online"
                    onClick={handleOpenMobileAccountsOnline}
                >
                    <BsFillPersonLinesFill size={25} />
                </div>
            </Tooltip>
            <div
                className="users-online-count"
                style={{ textAlign: 'center', marginTop: '10px' }}
            >
                {currentLanguage.usersonline} ({Number(usersOnline.length)})
            </div>
            <div className="online-accounts">
                {usersOnline.length > 0 &&
                    usersOnline.map((user) => {
                        if (user.profileid !== profile._id) {
                            return (
                                <div
                                    key={user.socketid}
                                    onClick={() =>
                                        handleClickOthers(user.profileid)
                                    }
                                    style={{
                                        cursor: 'pointer',
                                        color: 'var(--blue-color)',
                                    }}
                                >
                                    <span className="online-account">
                                        <div className="account-avatar">
                                            <img
                                                src={user.avatar}
                                                alt="acc-avatar"
                                                className="account-avatar__img"
                                                width="100%"
                                                height="100%"
                                            />
                                        </div>
                                        <div className="account-name">
                                            {user.name}
                                        </div>
                                    </span>
                                </div>
                            );
                        }
                    })}
            </div>
            {/* Room - LIST */}
            <ul
                className="room-list"
                style={{ overflowY: rooms.length === 0 ? 'hidden' : 'visible' }}
            >
                {rooms.length > 0 &&
                    rooms.map((room) => (
                        <li
                            className="room-item"
                            key={room._id}
                            onContextMenu={(e) =>
                                handleContextMenu(e, room._id)
                            }
                        >
                            <Link
                                to={`rooms/room/${room._id}`}
                                className={clsx('room-link', {
                                    active: room._id === selectedRoomid,
                                    'not-seen':
                                        room.viewer.indexOf(profile._id) === -1,
                                })}
                                onClick={(e) =>
                                    handleClickRoomLink(e, room._id)
                                }
                            >
                                <div
                                    className={clsx('account-avatar', {
                                        viewed:
                                            room.viewer.indexOf(profile._id) !==
                                            -1,
                                    })}
                                >
                                    <img
                                        src={room.roomavatar || room.avatar}
                                        alt="avatar"
                                        className={clsx('account-avatar__img')}
                                        width="100%"
                                        height="100%"
                                    />
                                </div>
                                <div className="room-text">
                                    <div className="room-name">{room.name}</div>
                                    {room.lastMessage && (
                                        <div className="lastest-message">
                                            {room.lastMessageSenderName}
                                            :&nbsp;
                                            {room.lastMessage}
                                        </div>
                                    )}
                                </div>
                                <div className="is-view">
                                    {room.viewer.indexOf(profile._id) !== -1 ? (
                                        <MdOutlineCheckCircleOutline />
                                    ) : (
                                        <IoSnowSharp />
                                    )}
                                </div>
                            </Link>
                            {room.mode === 'private' && (
                                <ul
                                    className={clsx('room-context-menu', {
                                        show: contextMenuID === room._id,
                                    })}
                                >
                                    <li onClick={() => setModal(true)}>
                                        {currentLanguage.deleteConversation}
                                    </li>
                                </ul>
                            )}
                        </li>
                    ))}
                {rooms.length === 0 && (
                    <span className="no-room">{currentLanguage.noRoom}</span>
                )}
            </ul>
            {modal && (
                <QuitModal
                    visible={{ modal, setModal }}
                    title={currentLanguage.deleteConversation}
                    purpose="delete-conversation"
                    callback={handleDeleteConversation}
                />
            )}
        </aside>
    );
};

export default Daskboard;
