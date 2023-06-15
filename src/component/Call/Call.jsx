import React from 'react';
import './Call.scss';
import { IoMdExpand } from 'react-icons/io';
import { BsCameraVideoFill, BsCameraVideoOffFill } from 'react-icons/bs';
import { BiMicrophoneOff, BiMicrophone } from 'react-icons/bi';
import { MdCallEnd } from 'react-icons/md';
import logic from './logic';
import clsx from 'clsx';
import socket from '~/tools/socket.io';
import { useCallContext } from './callContext';
const Call = ({ data, close }) => {
    const {
        stream,
        setStream,
        leaveCall,
        myVideoRef,
        othersRef,
        localStream,
        callAccepted,
    } = useCallContext();
    const [showControls, setShowControls] = React.useState(false);
    const [fullScreen, setFullScreen] = React.useState(true);
    React.useEffect(() => {
        logic();
    }, []);
    React.useEffect(() => {
        if (stream) {
            myVideoRef.current.srcObject = stream;
        }
    }, [stream]);

    const handleShowControls = () => {
        setShowControls(!showControls);
    };
    const handleLeaveCall = () => {};
    return (
        <div className='call-container'>
            {/* <!-- Draggable DIV --> */}
            <div id='mydiv' className={clsx({ 'full-screen': fullScreen })}>
                {/* <!-- Include a header DIV with the same name as the draggable DIV, followed by "header" --> */}
                <div id='mydivheader'>Click here to move</div>
                {callAccepted && (
                    <video
                        src=''
                        id='other-video'
                        className='video'
                        onClick={handleShowControls}
                        ref={othersRef}
                        playsInline
                        autoPlay
                        muted
                    />
                )}
                {stream && (
                    <video
                        playsInline
                        autoPlay
                        muted
                        id='my-video'
                        className='video'
                        onClick={handleShowControls}
                        ref={myVideoRef}
                        width='30%'
                    />
                )}
                <div className={clsx('video-controls', { show: showControls })}>
                    <div className='video-controls-item'>
                        <BiMicrophone />
                    </div>
                    <div className='video-controls-item'>
                        <BsCameraVideoFill />
                    </div>
                    <div
                        className='video-controls-item x-phone'
                        onClick={() => {
                            handleLeaveCall();
                        }}
                    >
                        <MdCallEnd />
                    </div>
                    <div
                        className='video-controls-item'
                        onClick={() => setFullScreen(!fullScreen)}
                    >
                        <IoMdExpand />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Call;
