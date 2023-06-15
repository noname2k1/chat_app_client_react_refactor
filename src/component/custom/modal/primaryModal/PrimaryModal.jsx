import React, { memo } from 'react';
import { useDispatch } from 'react-redux';
import { componentSlice } from '~/component/redux/slices';
import Close from '../../close/Close';
import General from './General/General';
import ChangePassword from './ChangePassword/ChangePassword';
import './PrimaryModal.scss';
import clsx from 'clsx';
import { useLanguageSelector } from '~/component/redux/selector';
const PrimaryModal = (s) => {
    const dispatch = useDispatch();
    const [currentTab, setCurrentTab] = React.useState('general');
    const handleCloseModal = () => {
        dispatch(
            componentSlice.actions.setDropdownItem({ accountModal: false })
        );
    };
    const { currentLanguage } = useLanguageSelector();
    const handelSetCurrentTab = (tabName) => setCurrentTab(tabName);
    const tab1 = 'general';
    const tab2 = 'change password';
    return (
        <div className='modal-container'>
            <div className='modal-wrapper'>
                <header className='modal-header'>
                    <div className='modal-title'>{currentLanguage.account}</div>
                    <Close onClick={handleCloseModal} />
                </header>
                <div className='modal-body'>
                    {currentTab === tab1 && <General />}
                    {currentTab === tab2 && <ChangePassword />}
                </div>
                <footer className='modal-footer'>
                    <div
                        className={clsx('modal-footer-item', {
                            active: currentTab === tab1,
                        })}
                        onClick={() => handelSetCurrentTab(tab1)}
                    >
                        {currentLanguage.general}
                    </div>
                    <div
                        className={clsx('modal-footer-item', {
                            active: currentTab === tab2,
                        })}
                        onClick={() => handelSetCurrentTab(tab2)}
                    >
                        {currentLanguage.changePassword}
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default memo(PrimaryModal);
