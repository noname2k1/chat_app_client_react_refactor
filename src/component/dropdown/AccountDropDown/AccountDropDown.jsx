import React from 'react';
import '../DropDown.scss';
import {
    useComponentSelector,
    useLanguageSelector,
} from '~/component/redux/selector';
import { useDispatch } from 'react-redux';
import {
    authSlice,
    usersOnlineSlice,
    componentSlice,
} from '~/component/redux/slices';
import ChangeMode from '~/component/custom/checkbox/ChangeMode';
import LanguageChange from '~/Languages/LanguageChange';
import socket from '~/tools/socket.io';
import { Link } from 'react-router-dom';
import QuitModal from '~/component/custom/modal/QuitModal/QuitModal';
import clsx from 'clsx';
import { withTokenInstance } from '~/tools/instances/withTokenInstance';
const AccountDropDown = () => {
    const [modal, setModal] = React.useState(false);
    const dispatch = useDispatch();
    const currentLanguage = useLanguageSelector().currentLanguage;
    const { accountDropDown } = useComponentSelector().dropdown;

    const handleCloseDropDown = (e) => {
        dispatch(
            componentSlice.actions.setDropdown({ accountDropDown: false })
        );
    };
    const handleOpenContribute = () => {
        dispatch(componentSlice.actions.setPropertie({ contribute: true }));
        handleCloseDropDown();
    };
    const handleOpenRoomBox = () => {
        dispatch(componentSlice.actions.setPropertie({ roomBox: true }));
        handleCloseDropDown();
    };
    const handleLogout = () => {
        socket.disconnect();
        withTokenInstance.patch(
            `${import.meta.env.VITE_AUTH_SERVER_URL}/api/auth/logout`
        );
        dispatch(usersOnlineSlice.actions.update([]));
        dispatch(authSlice.actions.logout());
    };

    return (
        <>
            <div
                className={clsx('account dropdown-container', {
                    active: accountDropDown,
                })}
            >
                <div
                    className="dropdown-item"
                    onClick={() => {
                        dispatch(
                            componentSlice.actions.setDropdownItem({
                                accountModal: true,
                            })
                        );
                        handleCloseDropDown();
                    }}
                >
                    {currentLanguage.myAccount}
                </div>
                <Link to={'profile'}>
                    <div
                        className="dropdown-item"
                        onClick={handleCloseDropDown}
                    >
                        {currentLanguage.profile}
                    </div>
                </Link>
                <div className="dropdown-item">
                    {currentLanguage.darkmode} <ChangeMode />
                </div>
                <div className="dropdown-item" onClick={handleOpenContribute}>
                    {currentLanguage.contribute}
                </div>
                <Link to="new" onClick={handleCloseDropDown} className="mobile">
                    <div className="dropdown-item">
                        {currentLanguage.newMessage}
                    </div>
                </Link>
                <div
                    className="dropdown-item mobile"
                    onClick={handleOpenRoomBox}
                >
                    {currentLanguage.room}
                </div>
                <div className="dropdown-item">
                    {currentLanguage.language}
                    &nbsp;
                    <LanguageChange />
                </div>
                <div className="separate"></div>
                <div
                    className="dropdown-item"
                    onClick={() => {
                        setModal(true);
                        handleCloseDropDown();
                    }}
                >
                    {currentLanguage.logout}
                </div>
                {modal && (
                    <QuitModal
                        visible={{ modal, setModal }}
                        title={currentLanguage.logout}
                        purple="logout"
                        callback={handleLogout}
                    />
                )}
            </div>
            {accountDropDown && (
                <div className="overlay" onClick={handleCloseDropDown}></div>
            )}
        </>
    );
};

export default AccountDropDown;
