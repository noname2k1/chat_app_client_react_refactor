import axios from 'axios';
import React from 'react';
import clsx from 'clsx';
import { useLanguageSelector } from '~/component/redux/selector';
import './ChangePassword.scss';
import { changePassword } from '~/services/userService';
const ChangePassword = () => {
  const { currentLanguage } = useLanguageSelector();
  const [password, setPassword] = React.useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [error, setError] = React.useState('');
  const [notify, setNotify] = React.useState('');
  const inputs = [
    {
      id: 0,
      type: 'text',
      name: 'currentPassword',
      value: password.currentPassword,
      placeHolder: currentLanguage.currentPassword,
    },
    {
      id: 1,
      type: 'text',
      name: 'newPassword',
      value: password.newPassword,
      placeHolder: currentLanguage.newPassword,
    },
    {
      id: 2,
      type: 'text',
      name: 'confirmNewPassword',
      value: password.confirmNewPassword,
      placeHolder: currentLanguage.confirmNewPassword,
    },
  ];
  const handleInputChange = (e) => {
    setPassword({
      ...password,
      [e.target.name]: e.target.value,
    });
  };
  const handleChangePassword = async (e) => {
    e.preventDefault();
    const check = checkError();
    if (check) {
      try {
        const data = await changePassword(
          password.currentPassword,
          password.newPassword
        );
        if (data.status === 'success') {
          setNotify(currentLanguage.changePasswordSuccessfully);
          setPassword({
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
          });
          localStorage.setItem('token', data.token);
          let reloadTime = 2;
          setInterval(() => {
            setNotify(
              currentLanguage.reloadPageAfter +
                reloadTime +
                currentLanguage.seconds
            );
            reloadTime -= 1;
            if (reloadTime < 0) {
              window.location.reload();
            }
          }, 1000);
        }
      } catch (error) {
        if (currentLanguage.languageCode === 'en') {
          setError(error.response.data.message);
        } else if (currentLanguage.languageCode === 'vn') {
          setError(error.response.data.messagevn);
        }
      }
    }
  };
  const checkError = () => {
    const currentPassword = document.querySelector(
      'input[name="currentPassword"]'
    );
    const newPassword = document.querySelector('input[name="newPassword"]');
    const confirmNewPassword = document.querySelector(
      'input[name="confirmNewPassword"]'
    );
    if (!currentPassword.value) {
      setError(currentLanguage.currentPasswordRequired);
      currentPassword.focus();
      return false;
    }
    if (!newPassword.value) {
      setError(currentLanguage.newPasswordRequired);
      newPassword.focus();
      return false;
    }
    if (currentPassword.value === newPassword.value) {
      setError(currentLanguage.currentPasswordDifferentNewPassword);
      newPassword.value = '';
      newPassword.focus();
      return false;
    }
    if (!confirmNewPassword.value) {
      setError(currentLanguage.confirmNewPasswordRequired);
      confirmNewPassword.focus();
      return false;
    }
    if (confirmNewPassword.value !== newPassword.value) {
      confirmNewPassword.value = '';
      setError(currentLanguage.confirmNewPasswordEqualNewPassword);
      confirmNewPassword.focus();
      return false;
    }
    return true;
  };
  React.useEffect(() => {
    document.querySelector('input[name="currentPassword"]').focus();
  }, []);
  // React.useEffect(() => {
  //     document.querySelector('input[name="currentPassword"]').focus();
  // }, []);
  return (
    <div className="change-password-wrapper">
      {inputs.map((input) => (
        <div className="input-wrapper" key={input.id}>
          <input
            type={input.type}
            name={input.name}
            value={input.value}
            placeholder={input.placeHolder}
            onChange={handleInputChange}
            onBlur={checkError}
            onInput={() => setError('')}
          />
        </div>
      ))}
      <div className="change-pwd-button" onClick={handleChangePassword}>
        {currentLanguage.changePassword}
      </div>
      {error && <div className={clsx('message', { error: true })}>{error}</div>}
      {notify && (
        <div className={clsx('message', { notify: true })}>{notify}</div>
      )}
    </div>
  );
};

export default ChangePassword;
