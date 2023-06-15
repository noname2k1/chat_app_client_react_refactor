import React from 'react';
import clsx from 'clsx';
import './Auth.scss';
import { BsFacebook, BsGithub, BsGoogle, BsTwitter } from 'react-icons/bs';
import Login from './Login';
import Register from './Register';
import { useAuthSelector, useLanguageSelector } from '../redux/selector';
import { Navigate } from 'react-router-dom';
import LanguageChange from '~/Languages/LanguageChange';
import ChangeMode from '../custom/checkbox/ChangeMode';
const Auth = () => {
  const isAuthenticated = useAuthSelector().isAuthenticated;
  const token = useAuthSelector().token;
  const currentLanguage = useLanguageSelector().currentLanguage;
  const [currentForm, setCurrentForm] = React.useState('login');
  if (isAuthenticated && token) {
    return <Navigate to="/" />;
  }
  return (
    <div className="auth-container">
      <div className="auth-form">
        <div className="auth-header">
          <div
            className={clsx('auth-header-item', 'login', {
              active: currentForm === 'login',
            })}
            onClick={() => setCurrentForm('login')}
          >
            {currentLanguage?.loginTab}
          </div>
          <div
            className={clsx('auth-header-item', 'register', {
              active: currentForm === 'register',
            })}
            onClick={() => setCurrentForm('register')}
          >
            {currentLanguage.registerTab}
          </div>
        </div>
        <div className="auth-body">
          {currentForm === 'login' && <Login />}
          {currentForm === 'register' && <Register />}
          {currentForm === 'login' && (
            <div className="match-word">
              <hr />
              <span>{currentLanguage.or}</span>
              <hr />
            </div>
          )}
        </div>
        <div className="auth-footer">
          {currentForm === 'login' && (
            <>
              <button className="login-with-facebook">
                <BsFacebook size={30} />
              </button>
              <button className="login-with-github">
                <BsGithub size={30} />
              </button>
              <button className="login-with-twitter">
                <BsTwitter size={30} />
              </button>
              <button className="login-with-google">
                <BsGoogle size={30} />
              </button>
            </>
          )}
          {currentForm === 'register' && (
            <span
              style={{
                textTransform: 'uppercase',
              }}
            >
              {currentLanguage.registerFooterText}
            </span>
          )}
          <LanguageChange />
          <ChangeMode />
        </div>
      </div>
    </div>
  );
};

export default Auth;
