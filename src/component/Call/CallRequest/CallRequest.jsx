import React from 'react';
import { useLanguageSelector } from '~/component/redux/selector';
import { BsTelephonePlusFill, BsTelephoneXFill } from 'react-icons/bs';
import './CallRequest.scss';
import socket from '~/tools/socket.io';
import { useCallContext } from '../callContext';
const CallRequest = () => {
    const currentLanguage = useLanguageSelector().currentLanguage;
    const { caller, acceptCall } = useCallContext();
    return (
        <div className='call-request-container'>
            <div className='call-request-wrapper'>
                <div className='caller-name'>{caller.name}</div>
                <div className='caller-avatar-wrapper'>
                    <div className='call-effect-outside'></div>
                    <div className='call-effect-inside'></div>
                    <img src={caller.avatarlink} alt='caller-avatar' />
                </div>
                <div className='call-controls'>
                    <div
                        className='call-controls-item accept'
                        onClick={acceptCall}
                    >
                        <BsTelephonePlusFill />
                        {currentLanguage.callRequestAccept}
                    </div>
                    <div
                        className='call-controls-item decline'
                        onClick={() => {
                            socket.emit(
                                'decline-call-request',
                                caller.socketid
                            );
                        }}
                    >
                        <BsTelephoneXFill />
                        {currentLanguage.callRequestDecline}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CallRequest;
