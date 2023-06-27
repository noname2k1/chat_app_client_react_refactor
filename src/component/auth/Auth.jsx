import React from 'react';
import clsx from 'clsx';
import './Auth.scss';
import { BsFacebook, BsGithub, BsGoogle, BsTwitter } from 'react-icons/bs';
import Login from './Login';
import Register from './Register';
import { useAuthSelector, useLanguageSelector } from '../redux/selector';
import { Navigate, useSearchParams } from 'react-router-dom';
import LanguageChange from '~/Languages/LanguageChange';
import ChangeMode from '../custom/checkbox/ChangeMode';
import Toast from '../custom/toast/Toast';
import socket from '~/tools/socket.io';
const Auth = () => {
    const [searchParams, setSearchParams] = useSearchParams({});
    const target = searchParams.get('target');
    // console.log(target);
    const isAuthenticated = useAuthSelector().isAuthenticated;
    const token = useAuthSelector().token;
    const currentLanguage = useLanguageSelector().currentLanguage;

    const [toast, setToast] = React.useState({
        show: false,
        message: '',
    });

    React.useEffect(() => {
        if (!target) {
            setSearchParams({ target: 'login' });
        }
    }, [target]);
    // socket.io

    if (isAuthenticated && token) {
        return <Navigate to="/" />;
    }
    return (
        <div className="auth-container">
            <div className="auth-form">
                <div className="auth-header">
                    <div
                        className={clsx('auth-header-item', 'login', {
                            active: target === 'login',
                        })}
                        onClick={() => setSearchParams({ target: 'login' })}
                    >
                        {currentLanguage?.loginTab}
                    </div>
                    <div
                        className={clsx('auth-header-item', 'register', {
                            active: target === 'register',
                        })}
                        onClick={() => setSearchParams({ target: 'register' })}
                    >
                        {currentLanguage.registerTab}
                    </div>
                </div>
                <div className="auth-body">
                    {target === 'login' && <Login />}
                    {target === 'register' && <Register setToast={setToast} />}
                    {target === 'login' && (
                        <div className="match-word">
                            <hr />
                            <span>{currentLanguage.or}</span>
                            <hr />
                        </div>
                    )}
                </div>
                <div className="auth-footer">
                    {target === 'login' && (
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
                    {target === 'register' && (
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
                    {toast.show && (
                        <Toast
                            content={toast.message}
                            setNotification={setToast}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Auth;
