import clsx from 'clsx';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    useComponentSelector,
    useLanguageSelector,
    useUsersOnlineSelector,
} from '~/component/redux/selector';
import { componentSlice } from '~/component/redux/slices';
import './MobileAccountsOnline.scss';
const MobileAccountsOnline = () => {
    const dispatch = useDispatch();
    const { usersOnline } = useUsersOnlineSelector();
    const handleCloseMobileAccountsOnline = () => {
        dispatch(componentSlice.actions.setMobileAccountsOnline(false));
    };
    const { currentLanguage } = useLanguageSelector();
    const { mobileAccountsOnline } = useComponentSelector();
    const handleCloseAccountsOnlineTable = (e) => {
        dispatch(componentSlice.actions.setMobileAccountsOnline(false));
    };
    return (
        <div className='wrapper-mbao'>
            <div
                className={clsx('mobile-accounts-online-wrapper', {
                    active: mobileAccountsOnline,
                })}
            >
                <header>
                    <h3 className='title'>
                        {currentLanguage.usersonline} ({+usersOnline.length + 1}
                        )
                    </h3>
                </header>
                <ul className='accounts-online-list'>
                    {usersOnline.map((user) => (
                        <li
                            className='account-online-item'
                            key={user.socketid}
                            onClick={handleCloseAccountsOnlineTable}
                        >
                            <Link to={`rooms/profile/${user.profileid}`}>
                                <div className='account-online-item__avatar'>
                                    <img
                                        src={user.avatar}
                                        width='100%'
                                        height='100%'
                                    />
                                </div>
                                <h4 className='account-online-item--name'>
                                    {user.name}
                                </h4>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            {mobileAccountsOnline && (
                <div
                    className='mobile-accounts-online-overlay'
                    onClick={handleCloseMobileAccountsOnline}
                ></div>
            )}
        </div>
    );
};

export default MobileAccountsOnline;
