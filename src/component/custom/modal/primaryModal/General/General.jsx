import axios from 'axios';
import moment from 'moment';
import React from 'react';
import { useLanguageSelector } from '~/component/redux/selector';
import {
  MdOutlineAdminPanelSettings,
  MdOutlineVerifiedUser,
  MdOutlineEmail,
  MdOutlineMarkEmailRead,
  MdOutlineMarkEmailUnread,
  MdDateRange,
} from 'react-icons/md';
import { HiOutlineStatusOnline } from 'react-icons/hi';
import './General.scss';
import clsx from 'clsx';
import { loadMyAccout } from '~/services/authService';
const AccountModal = () => {
  const [myAccount, setMyAccount] = React.useState(undefined);
  const [isLoading, setIsLoading] = React.useState(true);
  const currentLanguage = useLanguageSelector().currentLanguage;
  React.useEffect(() => {
    const loadAccount = async () => {
      const data = await loadMyAccout();
      if (data.status !== 'success') return;
      setMyAccount(data.infoAccount);
      setIsLoading(false);
    };
    loadAccount();
  }, []);
  return (
    <div className="account-modal-body">
      {isLoading && <div className="loading">loading...</div>}
      {!isLoading && (
        <>
          <div className="account-modal-body-item">
            <MdOutlineAdminPanelSettings /> {currentLanguage.username} :{' '}
            {myAccount.username}
          </div>
          <div className="account-modal-body-item">
            <MdOutlineVerifiedUser /> {currentLanguage.role} : {myAccount.role}
          </div>
          <div className="account-modal-body-item">
            <MdOutlineEmail /> {currentLanguage.email} : {myAccount.email}
          </div>
          <div className="account-modal-body-item">
            <HiOutlineStatusOnline />
            {currentLanguage.status} :
            <span
              className={clsx('account-status', {
                'non-active': myAccount.status === 'non-active',
              })}
            >
              &nbsp;
              {myAccount.status === 'non-active'
                ? currentLanguage.nonActive
                : currentLanguage.ativated}
              &nbsp;
            </span>
            &nbsp;
            {myAccount.status === 'non-active' ? (
              <MdOutlineMarkEmailUnread />
            ) : (
              <MdOutlineMarkEmailRead />
            )}
            &nbsp;
            {myAccount.status === 'non-active' && (
              <div className="active-now">{currentLanguage.activeNow}</div>
            )}
          </div>
          <div className="account-modal-body-item">
            <MdDateRange /> {currentLanguage.createdAt} :{' '}
            {moment(myAccount.createdAt).format('DD-MM-YYYY')}
          </div>
        </>
      )}
    </div>
  );
};

export default AccountModal;
