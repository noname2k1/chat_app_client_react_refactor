import PropTypes from 'prop-types';
import React from 'react';
import clsx from 'clsx';
import './Message.scss';
import { FaReply, FaRegHeart, FaHeart } from 'react-icons/fa';
import { RiShareForwardFill } from 'react-icons/ri';
import { BsChevronDown } from 'react-icons/bs';
import {
    useAuthSelector,
    useComponentSelector,
    useLanguageSelector,
} from '~/component/redux/selector';
import socket from '~/tools/socket.io';
import LoadingFaceBook from '~/component/custom/loadingFaceBook/LoadingFaceBook';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import Overlay from '~/component/Overlay';
import { useDispatch } from 'react-redux';
import { componentSlice } from '~/component/redux/slices';
import DisplayFile from '~/component/custom/DisplayFile/DisplayFile';
import LockRoom from './LockRoom/LockRoom';
import { getMessages } from '~/services/messageService';

const Message = ({ loadingProp = false }) => {
    const dispatch = useDispatch();
    const { roomid } = useParams();
    const goToBottomRef = React.useRef();
    const scrollPosition = React.useRef();
    const messagesContainerRef = React.useRef(null);
    const currentLanguage = useLanguageSelector().currentLanguage;
    const profile = useAuthSelector().profile;
    const { selectedRoomid, currentMessages, messagesLastPage, currentRoom } =
        useComponentSelector();
    const [countMessage, setCountMessage] = React.useState(0);
    const [contextid, setContextid] = React.useState('');
    const [loadMoreEffect, setLoadMoreEffect] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [gotoBottomButton, setGoToBottomButton] = React.useState(false);

    const limit = 20;
    const loadMessages = async () => {
        setLoading(true);
        try {
            const res = await getMessages(
                window.location.pathname.split('/')[3],
                0,
                limit
            );
            // console.log(res);
            setCountMessage(res.countMessages);
            const messages = res.messages.reverse();
            dispatch(componentSlice.actions.setMessages(messages));
            // console.log('loadMessages');
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const loadMoreMessages = async (page = 0) => {
        if (page > 0 && currentMessages.length < countMessage) {
            setLoadMoreEffect(true);
            try {
                const res = await getMessages(
                    window.location.pathname.split('/')[3],
                    page,
                    limit
                );
                // console.log(res);
                const messages = res.messages.reverse();
                dispatch(
                    componentSlice.actions.setMessages([
                        ...new Set([...messages, ...currentMessages]),
                    ])
                );
                // console.log('loadmoreMessages');
            } catch (error) {
                console.log(error);
            } finally {
                setLoadMoreEffect(false);
            }
        }
    };

    // loadmore messages
    const handleLoadMore = (e) => {
        if (
            e.target.scrollTop >
            e.target.scrollHeight - e.target.clientHeight * 1.2
        ) {
            setGoToBottomButton(false);
        } else {
            setGoToBottomButton(true);
        }
        // console.log(e.target.scrollTop);
        // console.log(e.target.scrollHeight - e.target.clientHeight * 1.2);
        if (e.target.scrollTop < 3) {
            dispatch(componentSlice.actions.setPage(messagesLastPage + 1));
        }
    };

    const handleReply = (e) => {
        let id;
        e.target.closest('.option-reply')
            ? (id = e.target.closest('.option-reply').id)
            : (id = e.target.dataset.id);
        const repliedMessage = currentMessages.find(
            (message) => message._id === id
        );
        if (repliedMessage) {
            dispatch(
                componentSlice.actions.setReplying({
                    enabled: true,
                    message: repliedMessage,
                })
            );
        }
    };
    //like/dislike
    const handleLike = (e) => {
        socket.emit('like', {
            roomid: selectedRoomid,
            profileid: profile._id,
            messageid: e.target.closest('.option-react').id,
        });
    };
    const handleDisLike = (e) => {
        socket.emit('dislike', {
            roomid: selectedRoomid,
            profileid: profile._id,
            messageid: e.target.closest('.option-react').id,
        });
    };
    //show/hide my-message
    const handleShowMessage = (e) => {
        socket.emit('show-message', {
            roomid: selectedRoomid,
            profileid: profile._id,
            messageid: e.target.dataset.id,
        });
    };
    const handleHideMessage = (e) => {
        socket.emit('hide-message', {
            roomid: selectedRoomid,
            profileid: profile._id,
            messageid: e.target.dataset.id,
        });
    };

    const removeContext = () => {
        setContextid('');
    };

    const scrollToView = (e) => {
        const id = e.target.closest('.reply-message-wrapper').dataset.id;
        const messageScrollTo = document.getElementById(id);
        if (messageScrollTo) {
            messageScrollTo.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest',
            });
        }
    };

    const gotoBottom = () => {
        if (messagesContainerRef.current) {
            const scrollTop =
                messagesContainerRef.current.scrollHeight -
                messagesContainerRef.current.clientHeight;
            messagesContainerRef.current.scrollTop = scrollTop;
        }
    };
    const handleGoToBottom = () => {
        if (messagesContainerRef.current) {
            const scrollTop =
                messagesContainerRef.current.scrollHeight -
                messagesContainerRef.current.clientHeight;
            messagesContainerRef.current.scrollTo({
                top: scrollTop,
                behavior: 'smooth',
            });
        }
    };

    React.useEffect(() => {
        loadMessages();
        dispatch(componentSlice.actions.setPage(0));
    }, [selectedRoomid]);

    const hideContextMenu = (e) => {
        setContextid('');
    };

    React.useEffect(() => {
        const gotoBottomTimer = setTimeout(() => {
            gotoBottom();
        }, 1000);
        window.addEventListener('click', hideContextMenu);
        return () => {
            clearTimeout(gotoBottomTimer);
            window.removeEventListener('click', hideContextMenu);
        };
    }, [selectedRoomid, messagesContainerRef.current]);

    React.useEffect(() => {
        loadMoreMessages(messagesLastPage);
    }, [messagesLastPage]);

    React.useEffect(() => {
        const showGoToBottomButton = () => {
            if (
                messagesContainerRef.current &&
                messagesContainerRef.current.scrollTop <
                    messagesContainerRef.current.scrollHeight -
                        messagesContainerRef.current.clientHeight
            ) {
                setGoToBottomButton(true);
            } else {
                setGoToBottomButton(false);
            }
        };
        showGoToBottomButton();
    }, [messagesContainerRef.current]);

    const updateMessageUI = (message) => {
        if (currentRoom._id === message.roomid) {
            const messageLikedIndex = currentMessages.findIndex(
                (messageItem) => messageItem._id === message._id
            );
            if (messageLikedIndex !== -1) {
                const newMessages = [...currentMessages];
                newMessages[messageLikedIndex] = message;
                dispatch(componentSlice.actions.setMessages(newMessages));
            }
        }
    };
    //socket.io
    React.useEffect(() => {
        socket.on('like', ({ message, profileid }) => {
            updateMessageUI(message);
        });
        socket.on('dislike', ({ message, profileid }) => {
            updateMessageUI(message);
        });
        socket.on('show-message', (message) => {
            updateMessageUI(message);
        });
        socket.on('hide-message', (message) => {
            updateMessageUI(message);
        });
        socket.on('new-message', (newMessage) => {
            // console.log('new-message', newMessage);
            if (window.location.pathname.split('/')[3] === newMessage.roomid) {
                socket.emit(
                    'view',
                    window.location.pathname.split('/')[3],
                    profile._id
                );
                dispatch(
                    componentSlice.actions.setMessages([
                        ...currentMessages,
                        newMessage,
                    ])
                );
                gotoBottom();
            }
        });
        socket.on('add-new-member', ({ receiverid, room_id, message }) => {
            if (window.location.pathname.split('/')[3] === room_id) {
                socket.emit(
                    'view',
                    window.location.pathname.split('/')[3],
                    profile._id
                );
                dispatch(
                    componentSlice.actions.setMessages([
                        ...currentMessages,
                        message,
                    ])
                );
                gotoBottom();
            }
        });
        socket.on('member-out-room', ({ roomid, message }) => {
            if (window.location.pathname.split('/')[3] === roomid) {
                socket.emit(
                    'view',
                    window.location.pathname.split('/')[3],
                    profile._id
                );
                dispatch(
                    componentSlice.actions.setMessages([
                        ...currentMessages,
                        message,
                    ])
                );
                gotoBottom();
            }
        });
    }, [currentMessages]);

    if (currentRoom.mode === 'private' && currentRoom.blocked) {
        return <LockRoom />;
    }
    return (
        <>
            {!loadingProp && !loading && (
                <div
                    className={clsx('content-body-text', {
                        flex: currentMessages.length === 0,
                    })}
                    ref={messagesContainerRef}
                    onScroll={handleLoadMore}
                >
                    {loadMoreEffect && <LoadingFaceBook />}
                    {currentMessages.length > 0 &&
                        currentMessages.map((message, index) => {
                            //notice message
                            if (
                                ['notice-add', 'notice-out'].indexOf(
                                    message.purpose
                                ) !== -1
                            ) {
                                return (
                                    <div
                                        className="notice-wrapper"
                                        key={message._id}
                                    >
                                        <span className="old-member">
                                            <img
                                                src={message.sender.avatarlink}
                                                alt={message.sender.name}
                                                className="avatar"
                                            />
                                            {message.sender.name}
                                        </span>
                                        &nbsp;
                                        {message.purpose === 'notice-add' &&
                                            currentLanguage.added}
                                        {message.purpose === 'notice-out' &&
                                            currentLanguage.outed}
                                        &nbsp;
                                        {message.purpose === 'notice-add' && (
                                            <span className="new-member">
                                                <img
                                                    src={
                                                        message.reacter[0]
                                                            .avatarlink
                                                    }
                                                    alt={
                                                        message.reacter[0].name
                                                    }
                                                    className="avatar"
                                                />
                                                {message.reacter[0].name}
                                            </span>
                                        )}
                                    </div>
                                );
                            }
                            //message of others
                            if (message.sender._id !== profile._id) {
                                return (
                                    <div
                                        className="message-wrapper"
                                        key={message._id}
                                        ref={
                                            index === limit - 1
                                                ? scrollPosition
                                                : null
                                        }
                                        id={message._id}
                                    >
                                        {message.reply && (
                                            <div
                                                className="reply-message-wrapper"
                                                data-id={
                                                    message.replymessageid._id
                                                }
                                                onClick={scrollToView}
                                            >
                                                <header>
                                                    <FaReply size={15} />
                                                    &nbsp;
                                                    {message.sender.name}
                                                    {currentLanguage.repliedTo}
                                                    <strong>
                                                        &nbsp;
                                                        {message.replymessageid
                                                            .sender._id !==
                                                        profile._id
                                                            ? message
                                                                  .replymessageid
                                                                  .sender.name
                                                            : currentLanguage.yourSelf}
                                                    </strong>
                                                </header>
                                                <div className="mesage">
                                                    {
                                                        message.replymessageid
                                                            .message
                                                    }
                                                    {message.replymessageid
                                                        .attachmentsLink
                                                        .length > 0 &&
                                                        currentLanguage.attachments}
                                                </div>
                                            </div>
                                        )}
                                        <div className="other-message message">
                                            <div className="other-avatar">
                                                <img
                                                    src={
                                                        message.sender
                                                            .avatarlink
                                                    }
                                                    alt="other-avatar"
                                                    className="other-avt-img"
                                                    width="100%"
                                                    height="100%"
                                                />
                                            </div>
                                            <div className="other-message-text">
                                                <div className="other-name">
                                                    {message.sender.name}
                                                </div>
                                                <div className="inside-wrap">
                                                    {message.hide ? (
                                                        <div className="hidden">
                                                            {
                                                                currentLanguage.displayMsgWhenHide
                                                            }
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className="message-attachments">
                                                                {message.attachmentsLink.map(
                                                                    (
                                                                        attachment,
                                                                        index
                                                                    ) => (
                                                                        <DisplayFile
                                                                            key={
                                                                                index
                                                                            }
                                                                            item={
                                                                                attachment
                                                                            }
                                                                            link={
                                                                                attachment.link
                                                                            }
                                                                        />
                                                                    )
                                                                )}
                                                            </div>
                                                            {message.message && (
                                                                <div>
                                                                    {
                                                                        message.message
                                                                    }
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                                {message.reacter.length > 0 && (
                                                    <span className="react-total">
                                                        <div>
                                                            <FaHeart
                                                                size={20}
                                                            />
                                                            {currentRoom.mode !==
                                                                'private' && (
                                                                <span>
                                                                    {message
                                                                        .reacter
                                                                        .length >
                                                                    9
                                                                        ? message
                                                                              .reacter
                                                                              .length +
                                                                          '+'
                                                                        : message
                                                                              .reacter
                                                                              .length}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </span>
                                                )}
                                            </div>
                                            <div className="other-message-options options">
                                                <div
                                                    className="options-item option-reply"
                                                    id={message._id}
                                                    onClick={handleReply}
                                                >
                                                    <FaReply size={20} />
                                                </div>
                                                <div className="options-item-separate"></div>
                                                {message.reacter.findIndex(
                                                    (reacterid) =>
                                                        reacterid ===
                                                            profile._id ||
                                                        reacterid._id ===
                                                            profile._id
                                                ) === -1 && (
                                                    <div
                                                        className="options-item option-react"
                                                        id={message._id}
                                                        onClick={handleLike}
                                                    >
                                                        <FaRegHeart size={20} />
                                                    </div>
                                                )}
                                                {message.reacter.length > 0 &&
                                                    message.reacter.find(
                                                        (reacterid) =>
                                                            reacterid ===
                                                                profile._id ||
                                                            reacterid._id ===
                                                                profile._id
                                                    ) && (
                                                        <div
                                                            className="options-item option-react liked"
                                                            id={message._id}
                                                            onClick={
                                                                handleDisLike
                                                            }
                                                        >
                                                            <FaHeart
                                                                size={20}
                                                            />
                                                        </div>
                                                    )}
                                                <div className="options-item-separate"></div>
                                                <div
                                                    className="options-item option-forward"
                                                    id={message._id}
                                                >
                                                    <RiShareForwardFill
                                                        size={20}
                                                    />
                                                </div>
                                            </div>
                                            <div className="message-createdAt">
                                                {moment(
                                                    message.createdAt
                                                ).format('DD/MM/YYYY hh:mm')}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                            //my message
                            return (
                                <div
                                    className="message-wrapper"
                                    key={message._id}
                                    ref={
                                        index === limit - 1
                                            ? scrollPosition
                                            : null
                                    }
                                    id={message._id}
                                >
                                    {message.reply && (
                                        <div
                                            className="reply-message-wrapper my-message"
                                            data-id={message.replymessageid._id}
                                            onClick={scrollToView}
                                        >
                                            <header>
                                                <FaReply size={15} />
                                                &nbsp;
                                                {currentLanguage.you}
                                                {currentLanguage.repliedTo}
                                                <strong>
                                                    &nbsp;
                                                    {message.replymessageid
                                                        .sender._id !==
                                                    profile._id
                                                        ? message.replymessageid
                                                              .sender.name
                                                        : currentLanguage.yourSelf}
                                                </strong>
                                            </header>
                                            <div className="mesage">
                                                {message.replymessageid.message}
                                                {message.replymessageid
                                                    .attachmentsLink.length >
                                                    0 &&
                                                    currentLanguage.attachments}
                                            </div>
                                        </div>
                                    )}
                                    <div
                                        className="my-message-text message"
                                        onContextMenu={(e) => {
                                            e.preventDefault();
                                            setContextid(message._id);
                                        }}
                                    >
                                        <div className="inside-wrap">
                                            {message.hide ? (
                                                <div className="hidden">
                                                    {
                                                        currentLanguage.displayMsgWhenHide
                                                    }
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="message-attachments">
                                                        {message.attachmentsLink.map(
                                                            (
                                                                attachment,
                                                                index
                                                            ) => (
                                                                <DisplayFile
                                                                    key={index}
                                                                    item={
                                                                        attachment
                                                                    }
                                                                    link={
                                                                        attachment.link
                                                                    }
                                                                />
                                                            )
                                                        )}
                                                    </div>
                                                    {message.message && (
                                                        <div>
                                                            {message.message}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                        {contextid === message._id && (
                                            <Overlay onClick={removeContext} />
                                        )}
                                        <div
                                            className={clsx(
                                                'message-context-menu',
                                                'my-context-menu',
                                                {
                                                    show:
                                                        contextid ===
                                                        message._id,
                                                }
                                            )}
                                        >
                                            {message.hide ? (
                                                <div
                                                    className="context-menu-item"
                                                    data-id={message._id}
                                                    onClick={(e) => {
                                                        removeContext();
                                                        handleShowMessage(e);
                                                    }}
                                                >
                                                    {currentLanguage.show}
                                                </div>
                                            ) : (
                                                <div
                                                    className="context-menu-item"
                                                    data-id={message._id}
                                                    onClick={(e) => {
                                                        removeContext();
                                                        handleHideMessage(e);
                                                    }}
                                                >
                                                    {currentLanguage.hide}
                                                </div>
                                            )}
                                            <div
                                                className="context-menu-item"
                                                data-id={message._id}
                                                onClick={(e) => {
                                                    removeContext();
                                                    handleReply(e);
                                                }}
                                            >
                                                {currentLanguage.reply}
                                            </div>
                                            <div
                                                className="context-menu-item"
                                                data-id={message._id}
                                                onClick={removeContext}
                                            >
                                                {currentLanguage.forward}
                                            </div>
                                        </div>
                                        <div className="message-createdAt">
                                            {moment(message.createdAt).format(
                                                'DD/MM/YYYY hh:mm'
                                            )}
                                        </div>
                                        {message.reacter.length > 0 && (
                                            <span className="react-total">
                                                <div>
                                                    <FaHeart size={20} />
                                                    {currentRoom.mode !==
                                                        'private' && (
                                                        <span>
                                                            {message.reacter
                                                                .length > 9
                                                                ? message
                                                                      .reacter
                                                                      .length +
                                                                  '+'
                                                                : message
                                                                      .reacter
                                                                      .length}
                                                        </span>
                                                    )}
                                                </div>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    {currentMessages.length === 0 && (
                        <div className="content-body-text-empty">
                            {currentLanguage.noMessage}
                        </div>
                    )}
                    {gotoBottomButton && (
                        <div className="to-bottom-wrapper" ref={goToBottomRef}>
                            <button
                                className="to-bottom-button"
                                onClick={handleGoToBottom}
                            >
                                <div className={clsx('down')}>
                                    <BsChevronDown />
                                </div>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default Message;

Message.propTypes = {
    loadingProp: PropTypes.bool,
};
