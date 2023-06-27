import React from 'react';
import { IoSend, IoAddCircle, IoRemoveCircle, IoClose } from 'react-icons/io5';
import { BsImages } from 'react-icons/bs';
import { FaRegFileVideo, FaReply } from 'react-icons/fa';
import {
    AiOutlineFileUnknown,
    AiOutlineAudio,
    AiOutlineClose,
} from 'react-icons/ai';
import './MessageForm.scss';
import socket from '~/tools/socket.io';
import {
    useAuthSelector,
    useComponentSelector,
    useLanguageSelector,
} from '~/component/redux/selector';
import debounce from 'lodash/debounce';
import { uploadToCloudinary } from '~/tools/callApi';
import axios from 'axios';
import { componentSlice } from '~/component/redux/slices';
import { useDispatch } from 'react-redux';
import Tooltip from '~/component/custom/tooltip/Tooltip';

const MessageForm = () => {
    const dispatch = useDispatch();
    const inputRef = React.useRef();
    const inputFileRef = React.useRef();
    const sendButtonRef = React.useRef();
    const [usertyping, setUsertyping] = React.useState({});
    const [msg, setMsg] = React.useState('');
    const [attachTable, setAttachTable] = React.useState(false);
    const [currentSelectedFiles, setCurrentSelectedFiles] = React.useState({
        filesSelected: [],
        filesPreview: [],
    });

    // react-redux-toolkit
    const profile = useAuthSelector().profile;
    const currentLanguage = useLanguageSelector().currentLanguage;
    const { replying, selectedRoomid } = useComponentSelector();

    //files select
    const handleOpenChooseFileDialog = (e) => {
        const formatType = {
            image: 'image/*',
            video: 'video/*',
            audio: 'audio/*',
            file: '.doc,.docx,.xls,.xlsx,.pdf,.ppt,.pptx',
        };
        if (
            e.target.closest('div').classList.contains('attach-selection-item')
        ) {
            inputFileRef.current.accept =
                formatType[e.target.closest('div').dataset.name];
            inputFileRef.current.click();
        }
    };

    const handleSelectFile = (e) => {
        let isValid = false;
        const files = Array.from(e.target.files);
        files.forEach((file) => {
            if (file.size > 10000000) {
                alert(currentLanguage.sizeFileTooBig);
                setAttachTable(false);
                return;
            }
            isValid = true;
        });
        if (isValid) {
            const filesPreview = files.map((file) => {
                return {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    preview: URL.createObjectURL(file),
                };
            });
            setCurrentSelectedFiles({
                filesPreview: [
                    ...currentSelectedFiles.filesPreview,
                    ...filesPreview,
                ],
                filesSelected: [
                    ...currentSelectedFiles.filesSelected,
                    ...files,
                ],
            });
            setAttachTable(false);
        }
    };
    const handleRemoveSelectedFile = (e) => {
        const removeIndex = e.target.closest('.remove-preview').dataset.index;
        const selectedFilesCopy = [...currentSelectedFiles.filesSelected];
        const previewListCopy = [...currentSelectedFiles.filesPreview];
        URL.revokeObjectURL(previewListCopy[removeIndex]);
        selectedFilesCopy.splice(removeIndex, 1);
        previewListCopy.splice(removeIndex, 1);
        setCurrentSelectedFiles({
            filesSelected: selectedFilesCopy,
            filesPreview: previewListCopy,
        });
    };

    //chat
    const autoHeight = (e) => {
        const maxHeight = 100;
        /* javascript */
        if (e.target.scrollHeight < maxHeight) {
            e.target.style.height = '1px';
            e.target.style.height = e.target.scrollHeight + 'px';
        } else {
            e.target.style.height = maxHeight + 'px';
        }
    };
    //handle textarea value change
    const handleInputChange = (e) => {
        setMsg(e.target.value);
        autoHeight(e);
    };
    //handle notices when other user typing
    const handleKeyDown = (e) => {
        if (e.keyCode !== 8) {
            socket.emit('typing', selectedRoomid, profile);
        }
    };
    const stopTyping = () => socket.emit('stop-typing', selectedRoomid);
    const handleKeyUp = (e) => {
        stopTyping();
    };
    //eslint-disable-next-line
    const debounceKeyUp = React.useCallback(debounce(handleKeyUp, 2000), [
        handleKeyUp,
    ]);
    const handleSendMessage = (e) => {
        e.preventDefault();
        dispatch(
            componentSlice.actions.setReplying({ enabled: false, message: {} })
        );
        setUsertyping({});
        let isReply = replying.enabled;
        if (currentSelectedFiles.filesSelected.length > 0) {
            const results = currentSelectedFiles.filesSelected.map(
                async (file) => {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('upload_preset', 'app_chat');
                    return await uploadToCloudinary(
                        formData,
                        file.type.split('/')[0]
                    );
                }
            );
            setCurrentSelectedFiles({
                filesSelected: [],
                filesPreview: [],
            });
            axios.all(results).then((results) => {
                const listItemUploadedLink = results.map((result) => {
                    // console.log(result);
                    let aspectRatio = '1/1';
                    if (result.resource_type === 'image') {
                        aspectRatio = `${result.width}/${result.height}`;
                    }
                    return {
                        link: result.secure_url,
                        type: result.resource_type,
                        aspectRatio,
                    };
                });
                if (listItemUploadedLink.length > 0) {
                    socket.emit('send-message', {
                        roomid: selectedRoomid,
                        sender: profile._id,
                        message: msg,
                        attachmentsLink: listItemUploadedLink,
                        reply: isReply,
                        replymessageid: replying.message._id,
                    });
                    setMsg('');
                    inputRef.current.focus();
                    inputRef.current.style.height = 'auto';
                }
            });
        }
        if (
            msg.trim() !== '' &&
            currentSelectedFiles.filesSelected.length === 0
        ) {
            socket.emit('send-message', {
                roomid: selectedRoomid,
                sender: profile._id,
                message: msg,
                attachmentsLink: [],
                reply: isReply,
                replymessageid: replying.message._id,
            });
            setMsg('');
            inputRef.current.focus();
            inputRef.current.style.height = 'auto';
        }
    };

    const handleCloseReply = () => {
        dispatch(
            componentSlice.actions.setReplying({ enabled: false, message: {} })
        );
        inputRef.current.value = '';
        setMsg('');
    };

    React.useEffect(() => {
        if (replying.enabled) {
            inputRef.current.focus();
        }
    }, [replying]);
    //socket io
    React.useEffect(() => {
        socket.on('typing', (userTyping, roomid) => {
            if (
                selectedRoomid === roomid &&
                JSON.stringify(usertyping) === '{}'
            ) {
                setUsertyping(userTyping);
            }
        });
        setMsg('');
    }, [selectedRoomid]);
    React.useEffect(() => {
        socket.on('stop-typing', () => {
            setUsertyping({});
        });
        // eslint-disable-next-line
    }, [msg]);

    return (
        <>
            {replying.enabled && (
                <div className="replying-wrapper">
                    <header className="replying-header">
                        <FaReply />
                        &nbsp;
                        {currentLanguage.replyingTo}
                        <strong>
                            &nbsp;
                            {replying.message.sender._id !== profile._id
                                ? replying.message.sender.name
                                : currentLanguage.yourSelf}
                        </strong>
                        <div className="close" onClick={handleCloseReply}>
                            <IoClose />
                        </div>
                    </header>
                    {replying.message.message && (
                        <div className="replied-message">
                            {replying.message.message}
                        </div>
                    )}
                    {replying.message.attachmentsLink.length > 0 && (
                        <div className="replied-message">
                            {currentLanguage.attachments}
                        </div>
                    )}
                </div>
            )}
            <div className="content-form">
                {currentSelectedFiles.filesSelected.length > 0 &&
                    currentSelectedFiles.filesPreview.length > 0 && (
                        <div className="file-list">
                            {currentSelectedFiles.filesPreview.map(
                                (preview, index) => (
                                    <div className="file-item" key={index}>
                                        {preview.type.includes('image') && (
                                            <img
                                                src={preview.preview}
                                                alt="file-preview"
                                                width="100%"
                                                height="100%"
                                            />
                                        )}
                                        {preview.type.includes('video') && (
                                            <video
                                                src={preview.preview}
                                                alt="file-preview"
                                                width="200px"
                                                height="100%"
                                                controls
                                            />
                                        )}
                                        {preview.type.includes('audio') && (
                                            <audio
                                                src={preview.preview}
                                                alt="file-preview"
                                                width="100%"
                                                height="100%"
                                                controls
                                            />
                                        )}
                                        <span
                                            className="remove-preview"
                                            data-index={index}
                                            onClick={handleRemoveSelectedFile}
                                        >
                                            <AiOutlineClose />
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                <Tooltip
                    title={currentLanguage.tooltipAddAttachment}
                    position="right"
                    disabled={attachTable}
                >
                    <button className="attach-btn">
                        <div className="central-btn">
                            {attachTable ? (
                                <IoRemoveCircle
                                    size={30}
                                    onClick={() => setAttachTable(false)}
                                />
                            ) : (
                                <IoAddCircle
                                    size={30}
                                    onClick={() => setAttachTable(true)}
                                />
                            )}
                        </div>
                        {attachTable && (
                            <>
                                <div
                                    className="attach-selection-item image"
                                    onClick={handleOpenChooseFileDialog}
                                    data-name="image"
                                >
                                    <Tooltip
                                        title={currentLanguage.tooltipAddImage}
                                        position="right"
                                    >
                                        <BsImages size={25} />
                                    </Tooltip>
                                </div>
                                <div
                                    className="attach-selection-item video"
                                    onClick={handleOpenChooseFileDialog}
                                    data-name="video"
                                >
                                    <Tooltip
                                        title={currentLanguage.tooltipAddVideo}
                                        position="right"
                                    >
                                        <FaRegFileVideo size={25} />
                                    </Tooltip>
                                </div>
                                <div
                                    className="attach-selection-item file"
                                    onClick={handleOpenChooseFileDialog}
                                    data-name="file"
                                >
                                    <Tooltip
                                        title={currentLanguage.tooltipAddFile}
                                        position="right"
                                    >
                                        <AiOutlineFileUnknown size={25} />
                                    </Tooltip>
                                </div>
                                <div className="attach-selection-item audio">
                                    <Tooltip
                                        title={currentLanguage.tooltipAddAudio}
                                        position="right"
                                    >
                                        <AiOutlineAudio size={25} />
                                    </Tooltip>
                                </div>
                            </>
                        )}
                    </button>
                </Tooltip>
                <input
                    type="file"
                    name="--file--"
                    ref={inputFileRef}
                    onClick={(e) => (e.target.value = null)}
                    onChange={handleSelectFile}
                    multiple
                />
                {/* chat textarea */}
                <textarea
                    ref={inputRef}
                    className="message-text"
                    value={msg}
                    onChange={handleInputChange}
                    rows="1"
                    autoComplete="false"
                    spellCheck={false}
                    onKeyUp={debounceKeyUp}
                    onKeyDown={handleKeyDown}
                />
                <Tooltip
                    title={currentLanguage.tooltipSendMessage}
                    position="left"
                >
                    <button
                        className="send-message__button"
                        onClick={handleSendMessage}
                        ref={sendButtonRef}
                    >
                        <IoSend size={30} />
                    </button>
                </Tooltip>
                {JSON.stringify(usertyping) !== '{}' && usertyping && (
                    <div className="other-user-typing">
                        <div className="other-user-typing-avatar">
                            <img
                                src={usertyping.avatarlink}
                                alt="user-typing"
                                width="100%"
                                height="100%"
                            />
                        </div>

                        <div className="other-user-typing-text">
                            {usertyping.name}&nbsp;
                            {currentLanguage.typingText}
                            <div className="dot-pulse" />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default MessageForm;
