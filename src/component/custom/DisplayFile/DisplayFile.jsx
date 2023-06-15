import React from 'react';
import './DisplayFile.scss';
import { BsPlayCircle } from 'react-icons/bs';
import { componentSlice } from '~/component/redux/slices';
import { useDispatch } from 'react-redux';
import { useComponentSelector } from '~/component/redux/selector';
const DisplayMedia = ({ item, link }) => {
    const [playing, setPlaying] = React.useState(false);
    const { viewFileModal } = useComponentSelector();
    const dispatch = useDispatch();
    const videoRef = React.useRef(null);
    const handleClickPlayButton = (e) => {
        if (
            !videoRef.current.paused &&
            !videoRef.current.ended &&
            videoRef.current.currentTime > 0
        ) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
    };
    const handleWhenVideoPlay = (e) => {
        setPlaying(true);
        e.target.setAttribute('controls', true);
    };
    const handleWhenVideoPause = (e) => {
        setPlaying(false);
        e.target.removeAttribute('controls');
    };

    const handleClickAttachment = (e) => {
        const myIndex = viewFileModal.files.indexOf(
            viewFileModal.files.find((item, index) => item.link === link)
        );
        if (viewFileModal.files[myIndex].type === 'image') {
            dispatch(
                componentSlice.actions.setViewFileModal({
                    enable: true,
                    currentIndex: myIndex,
                })
            );
        }
    };
    return (
        <div className='message-attachment' onClick={handleClickAttachment}>
            {item.type === 'image' && (
                <img
                    src={item.link}
                    alt='message-img'
                    width='100%'
                    height='100%'
                />
            )}{' '}
            {item.type === 'video' && (
                <video
                    src={item.link}
                    alt='message-video'
                    width='100%'
                    height='100%'
                    onPlay={handleWhenVideoPlay}
                    onPause={handleWhenVideoPause}
                    ref={videoRef}
                />
            )}
            {!playing && item.type == 'video' && (
                <div className='play-icon' onClick={handleClickPlayButton}>
                    <BsPlayCircle size={20} />
                </div>
            )}
        </div>
    );
};

export default DisplayMedia;
