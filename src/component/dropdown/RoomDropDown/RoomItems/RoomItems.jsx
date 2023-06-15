import React from 'react';
import './RoomItems.scss';
import {
    useComponentSelector,
    useLanguageSelector,
} from '~/component/redux/selector';
import { AiOutlineClose } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { componentSlice } from '~/component/redux/slices';
import RoomDetails from './RoomDetails/RoomDetails';
import ListOfMembers from './ListOfMembers/ListOfMembers';
const RoomItems = () => {
    const dispatch = useDispatch();
    const { roomDetails, listOfMembers, activityReports } =
        useComponentSelector().dropdownItem.roomOptions;
    const currentLanguage = useLanguageSelector().currentLanguage;
    return (
        <div className='room-item-container'>
            <div className='room-item-wrapper'>
                <header className='room-item-header'>
                    <div className='header-text'>
                        {roomDetails
                            ? currentLanguage.roomDetails
                            : listOfMembers
                            ? currentLanguage.listOfMembers
                            : currentLanguage.activityReports}
                    </div>
                    <div
                        className='close'
                        onClick={() => {
                            dispatch(
                                componentSlice.actions.setDropdownItem({
                                    roomOptions: {
                                        enabled: false,
                                        roomDetails: false,
                                        listOfMembers: false,
                                        activityReports: false,
                                    },
                                })
                            );
                        }}
                    >
                        <AiOutlineClose size={25} />
                    </div>
                </header>
                <div className='room-item-body'>
                    {roomDetails && <RoomDetails />}
                    {listOfMembers && <ListOfMembers />}
                </div>
            </div>
        </div>
    );
};

export default RoomItems;
