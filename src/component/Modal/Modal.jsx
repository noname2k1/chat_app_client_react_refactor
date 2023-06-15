import React from 'react';
import PrimaryModal from '../custom/modal/primaryModal/PrimaryModal';
import { useComponentSelector } from '~/component/redux/selector';
import CallRequest from '../Call/CallRequest/CallRequest';
import Call from '~/component/Call/Call';
import { useCallContext } from '../Call/callContext';
import RoomItems from '../dropdown/RoomDropDown/RoomItems/RoomItems';
const Modal = () => {
    const { accountModal, roomOptions } = useComponentSelector().dropdownItem;
    const { callRequest, callAccepted, type } = useCallContext();
    const { call } = useComponentSelector();
    // const { usersOnline } = useUsersOnlineSelector();
    return (
        <>
            {/* modal-from-dropdown */}
            {accountModal && <PrimaryModal />}
            {/* call-modal */}
            {callRequest && !callAccepted && <CallRequest />}
            {call && !callRequest && (
                <Call
                    type={type}
                    // close={() => setCalling(false)}
                />
            )}
            {roomOptions.enabled && <RoomItems />}
        </>
    );
};

export default Modal;
