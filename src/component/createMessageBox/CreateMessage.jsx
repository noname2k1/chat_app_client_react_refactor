import React from 'react';
import './CreateMessage.scss';
import { IoSend, IoRemoveCircleSharp } from 'react-icons/io5';
import { useAuthSelector, useLanguageSelector } from '../redux/selector';
import { getMyRooms, getRoomsByName } from '~/services/roomService';
import socket from '~/tools/socket.io';
const CreateMessage = () => {
    const limit = 20;
    const currentLanguage = useLanguageSelector().currentLanguage;
    const { profile } = useAuthSelector();
    const refInput = React.useRef();
    const [tags, setTags] = React.useState([]);
    const [suggestions, setSuggestions] = React.useState([]);
    const [searchString, setSearchString] = React.useState('');
    const [message, setMessage] = React.useState('');

    const handleSelectUser = (user) => {
        if (tags.find((tag) => tag._id === user._id)) return;
        setTags([...tags, user]);
        refInput.current.value = '';
        refInput.current.focus();
    };

    const handleClearTag = (tagid) => {
        setTags(tags.filter((tag) => tag._id !== tagid));
    };

    const handleSendMessage = () => {
        if (message.trim()) {
            tags.forEach((tag) => {
                socket.emit('send-message', {
                    roomid: tag._id,
                    sender: profile._id,
                    message: message.trim(),
                    attachmentsLink: [],
                    reply: false,
                    replymessageid: '',
                });
                setMessage('');
            });
        }
    };

    React.useEffect(() => {
        if (refInput.current) {
            refInput.current.setAttribute(
                'size',
                refInput.current.getAttribute('placeholder').length
            );
            refInput.current.focus();
        }
        const roomLinks = document.querySelectorAll('.room-link');
        if (roomLinks.length > 0) {
            roomLinks.forEach((element) => element.classList.remove('active'));
        }
    }, []);

    React.useEffect(() => {
        const getSuggestions = async () => {
            try {
                let res;
                searchString
                    ? (res = await getRoomsByName(searchString))
                    : (res = await getMyRooms());
                // console.log(res.rooms);
                setSuggestions(
                    res.rooms
                        .slice(0, limit)
                        .filter(
                            (room) =>
                                tags.findIndex(
                                    (tag) => tag._id === room._id
                                ) === -1
                        )
                );
            } catch (error) {
                console.log(error);
            }
        };
        getSuggestions();
    }, [tags, searchString]);

    // console.log(profile);
    return (
        <div className="create-message-container">
            <div className="create-message-header">
                {currentLanguage.to}:&nbsp;&nbsp;&nbsp;
                <div className="send-to">
                    {tags.map((tag) => (
                        <div className="tag" key={tag._id}>
                            <div className="avatar">
                                <img
                                    src={
                                        tag.avatar ? tag.avatar : tag.avatarlink
                                    }
                                    alt="avt"
                                    width="100%"
                                    height="100%"
                                />
                            </div>
                            <div className="name">{tag.name}</div>
                            <span
                                className="remove-tag"
                                onClick={() => handleClearTag(tag._id)}
                            >
                                <IoRemoveCircleSharp />
                            </span>
                        </div>
                    ))}
                    <div className="search-receiver-wrapper">
                        <input
                            type="text"
                            placeholder={currentLanguage.toPlaceholder}
                            ref={refInput}
                            autoComplete="false"
                            spellCheck="false"
                            onChange={(e) => setSearchString(e.target.value)}
                            value={searchString}
                        />
                        <ul className="suggestions-list">
                            {suggestions.map((suggestion) => {
                                if (suggestion.mode === 'private') {
                                    const otherUser = suggestion.member.find(
                                        (member) => member._id !== profile._id
                                    );
                                    otherUser._id = suggestion._id;
                                    // console.log(otherUser);
                                    return (
                                        <li
                                            className="suggestions-item"
                                            key={otherUser._id}
                                            onClick={() =>
                                                handleSelectUser(otherUser)
                                            }
                                        >
                                            <div className="avatar">
                                                <img
                                                    src={otherUser.avatarlink}
                                                    alt="avt"
                                                    width="100%"
                                                    height="100%"
                                                />
                                            </div>
                                            <div className="name">
                                                {otherUser.name}
                                            </div>
                                        </li>
                                    );
                                }
                                return (
                                    <li
                                        className="suggestions-item"
                                        key={suggestion._id}
                                        onClick={() =>
                                            handleSelectUser(suggestion)
                                        }
                                    >
                                        <div className="avatar">
                                            <img
                                                src={suggestion.avatar}
                                                alt="avt"
                                                width="100%"
                                                height="100%"
                                            />
                                        </div>
                                        <div className="name">
                                            {suggestion.name}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="create-message-body">
                <div className="message-content">
                    <textarea
                        name=""
                        id=""
                        cols="30"
                        rows="10"
                        placeholder={currentLanguage.placeholder}
                        autoComplete="false"
                        spellCheck="false"
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                    ></textarea>
                </div>
                <button
                    className="create-message__button"
                    onClick={handleSendMessage}
                >
                    {currentLanguage.send}&nbsp;
                    <IoSend />
                </button>
            </div>
        </div>
    );
};

export default CreateMessage;
