import React from 'react';
import './Room.scss';
import clsx from 'clsx';
import { FaUsers } from 'react-icons/fa';
import debounce from 'lodash/debounce';
import { Link, useNavigate } from 'react-router-dom';
import {
    useLanguageSelector,
    useAuthSelector,
} from '~/component/redux/selector';
import { getRooms, getSuggestRooms, patchRoom } from '~/services/roomService';
import socket from '~/tools/socket.io';
import { createRoom } from '~/services/roomService';

const Room = ({ closeBox }) => {
    const navigate = useNavigate();
    const inputRef = React.useRef();
    const currentLanguage = useLanguageSelector().currentLanguage;
    const profile = useAuthSelector().profile;
    const [tabName, setTabName] = React.useState('findRoom');
    const [error, setError] = React.useState('');
    const [string, setString] = React.useState('');
    const [rooms, setRooms] = React.useState([]);

    const getSuggestion = async () => {
        try {
            const res = await getSuggestRooms();
            // console.log(res);
            if (res.rooms.length) {
                setRooms(res.rooms);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const switchTabName = (e) => {
        if (e.target.classList.contains('active')) {
            return;
        }
        if (e.target.classList.contains('find-room')) {
            setTabName('findRoom');
            e.target.classList.toggle('active', tabName === 'findRoom');
            setError('');
        }
        if (e.target.classList.contains('create-room')) {
            setTabName('createRoom');
            setString('');
            setRooms([]);
            e.target.classList.toggle('active', tabName === 'createRoom');
        }
    };

    const handleButtonClick = async (e) => {
        e.preventDefault();
        if (tabName === 'createRoom') {
            try {
                const data = await createRoom(string);
                if (data.status === 'success') {
                    setString('');
                    navigate(`/rooms/room/${data.room._id}`);
                    closeBox();
                    socket.emit('create-room', data.room._id);
                }
            } catch (error) {
                // console.log(error);
                if (currentLanguage.languageCode === 'en') {
                    setError(error.response.data.message);
                }
                if (currentLanguage.languageCode === 'vn') {
                    setError(error.response.data.messagevn);
                }
            }
        }
    };
    const findResults = async (value) => {
        try {
            const data = await getRooms(value);
            if (data.status === 'success') {
                setRooms(data.rooms);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handleSummit = (value) => {
        if (tabName === 'findRoom' && value) {
            findResults(value);
        }
    };
    //eslint-disable-next-line
    const debounceSubmit = React.useCallback(
        debounce((value) => handleSummit(value), 500),
        []
    );
    const handleInputChange = (e) => {
        setString(e.target.value);
        debounceSubmit(e.target.value);
    };
    //request => join room
    const handleRequest = async (e) => {
        if (e.target.classList.contains('send-request')) {
            const data = await patchRoom(
                profile._id,
                e.target.dataset.roomid,
                '$push',
                'request'
            );
            if (data.status === 'success') {
                const oldRoom = rooms.find(
                    (room) => room._id === e.target.dataset.roomid
                );
                rooms.splice(rooms.indexOf(oldRoom), 1);
                setRooms([...rooms, data.room]);
            } else {
                console.log(data.message);
            }
        }
        if (e.target.classList.contains('requested')) {
            const data = await patchRoom(
                profile._id,
                e.target.dataset.roomid,
                '$pull',
                'request'
            );
            if (data.status === 'success') {
                const oldRoom = rooms.find(
                    (room) => room._id === e.target.dataset.roomid
                );
                rooms.splice(rooms.indexOf(oldRoom), 1);
                setRooms([...rooms, data.room]);
            } else {
                console.log(data.message);
            }
        }
        socket.emit('request', e.target.dataset.roomid);
    };

    React.useEffect(() => {
        if (!rooms.length || !string) {
            getSuggestion();
        }
    }, [string, rooms.length]);

    React.useEffect(() => {
        const input = document.querySelector('.room-item__input');
        if (input) {
            input.value = '';
            input.focus();
        }
    }, [tabName]);
    //Socket.io
    React.useEffect(() => {
        socket.on('notification-join-room-success', (profileid) => {
            if (profile._id === profileid) {
                if (inputRef.current) {
                    handleSummit(inputRef.current.value);
                    getSuggestion();
                }
            }
        });
        socket.on('notification-decline-request', (roomName, profileId) => {
            if (profile._id === profileId) {
                if (inputRef.current) {
                    handleSummit(inputRef.current.value);
                    getSuggestion();
                }
            }
        });
    }, [profile._id]);
    return (
        <div className="room-container" onClick={closeBox}>
            <div className="room-wrapper" onClick={(e) => e.stopPropagation()}>
                <div className="room-item-header">
                    <div
                        className={clsx('room-item-header-item', 'find-room', {
                            active: tabName === 'findRoom',
                        })}
                        onClick={switchTabName}
                    >
                        {currentLanguage.findRoom}
                    </div>
                    <div
                        className={clsx(
                            'room-item-header-item',
                            'create-room',
                            {
                                active: tabName === 'createRoom',
                            }
                        )}
                        onClick={switchTabName}
                    >
                        {currentLanguage.createRoom}
                    </div>
                </div>
                <div className="room-item-body">
                    <input
                        type="text"
                        className={clsx('room-item__input', {
                            'create-room': tabName === 'createRoom',
                        })}
                        name="name"
                        spellCheck="false"
                        placeholder={
                            tabName === 'findRoom'
                                ? currentLanguage.typeofRoomIDPlaceholder
                                : currentLanguage.typeofNameOfRoomlaceholder
                        }
                        onChange={handleInputChange}
                        autoComplete="off"
                        onFocus={() => setError('')}
                        ref={inputRef}
                    />
                    {tabName === 'findRoom' && (
                        <ul className="results-room-list">
                            {rooms.length > 0 &&
                                rooms.map((room) => (
                                    <li className="room-item" key={room._id}>
                                        <Link
                                            to={`/rooms/room/${room._id}`}
                                            onClick={() => closeBox()}
                                        >
                                            <div className="room-item-avatar">
                                                <img
                                                    src={room.avatar}
                                                    alt="room-avatar"
                                                    width="100%"
                                                    height="100%"
                                                />
                                            </div>
                                            <div className="room-item-name">
                                                {room.name}
                                            </div>
                                            {room.LastMessage && (
                                                <div className="lastest-message">
                                                    {room.LastMessage}
                                                </div>
                                            )}
                                            &nbsp;
                                            <div className="member-count">
                                                <FaUsers />
                                                &nbsp;{room.member.length}
                                            </div>
                                        </Link>
                                        {room.member.indexOf(profile._id) ===
                                            -1 &&
                                            room.request.indexOf(
                                                profile._id
                                            ) === -1 && (
                                                <div
                                                    className="send-request"
                                                    onClick={handleRequest}
                                                    data-roomid={room._id}
                                                >
                                                    {currentLanguage.request}
                                                </div>
                                            )}
                                        {room.member.indexOf(profile._id) ===
                                            -1 &&
                                            room.request.indexOf(
                                                profile._id
                                            ) !== -1 && (
                                                <div
                                                    className="requested"
                                                    onClick={handleRequest}
                                                    data-roomid={room._id}
                                                >
                                                    {currentLanguage.requested}
                                                </div>
                                            )}
                                    </li>
                                ))}
                        </ul>
                    )}
                    {tabName === 'createRoom' && (
                        <>
                            <button
                                className="create-room__button"
                                onClick={handleButtonClick}
                            >
                                {currentLanguage.createRoom}
                            </button>
                            {error && (
                                <div className="error-message">{error}</div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Room;
