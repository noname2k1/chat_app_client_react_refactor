import React from 'react';
import clsx from 'clsx';
import { useLanguageSelector } from '../redux/selector';
import { useDispatch } from 'react-redux';
import { componentSlice } from '../redux/slices';
import { useSearchParams } from 'react-router-dom';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { validateFormInput, removeValidateError } from './validateFormInput';
import { register } from '~/services/authService';
import socket from '~/tools/socket.io';
import SmallLoading from '../custom/loading/SmallLoading';

const Register = ({ setToast }) => {
    const [isPending, setIsPending] = React.useState(false);
    const [searchParams, setSearchParams] = useSearchParams({});

    const [isErrorPattern, setIsErrorPattern] = React.useState({
        username: false,
        password: false,
        cfpassword: false,
        email: false,
    });
    const [isErrorRequired, setIsErrorRequired] = React.useState({
        username: false,
        password: false,
        cfpassword: false,
        email: false,
    });
    const [disabled, setDisabled] = React.useState(true);
    const [error, setError] = React.useState('');
    const dispatch = useDispatch();

    const [typeInputPassWord, setTypeInputPassWord] =
        React.useState('password');
    const [data, setData] = React.useState({
        username: '',
        password: '',
        cfpassword: '',
        email: '',
    });
    const handleDataChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };
    const handleRegister = async (e) => {
        e.preventDefault();
        setIsPending(true);
        try {
            await register(data);
            socket.emit('register', data);
            setToast({
                show: true,
                message: 'Register successfully! Please login to continue!',
            });
            setSearchParams({ target: 'login' });
        } catch (error) {
            // console.log(error);
            const res = error.response.data;
            if (currentLanguage.languageCode === 'en') {
                return setError(res.message);
            } else if (currentLanguage.languageCode === 'vn') {
                return setError(res.messagevn);
            }
        } finally {
            setIsPending(false);
        }
    };
    const currentLanguage = useLanguageSelector().currentLanguage;
    React.useEffect(() => {
        const { username, password, cfpassword, email } = isErrorPattern;
        if (
            !username &&
            !password &&
            !cfpassword &&
            !email &&
            !isErrorRequired.username &&
            !isErrorRequired.password &&
            !isErrorRequired.cfpassword &&
            !isErrorRequired.email &&
            data.username !== '' &&
            data.password !== '' &&
            data.cfpassword !== '' &&
            data.email !== ''
        ) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [
        data,
        isErrorPattern,
        isErrorRequired.username,
        isErrorRequired.password,
        isErrorRequired.cfpassword,
        isErrorRequired.email,
    ]);
    const registerForm = [
        {
            index: 0,
            type: 'text',
            name: 'username',
            id: 'username',
            placeholder: currentLanguage?.username,
            requireFailMessage: currentLanguage?.usernameRequired,
            errorMessage: currentLanguage?.invalidUserName,
        },
        {
            index: 1,
            type: typeInputPassWord,
            name: 'password',
            id: 'password',
            placeholder: currentLanguage?.password,
            requireFailMessage: currentLanguage?.passwordRequired,
            errorMessage: currentLanguage?.invalidPassword,
        },
        {
            index: 2,
            type: typeInputPassWord,
            name: 'cfpassword',
            id: 'cfpassword',
            placeholder: currentLanguage?.confirmPassword,
            requireFailMessage: currentLanguage?.passwordConfirmRequired,
            errorMessage: currentLanguage?.passwordConfirmNotMatch,
        },
        {
            index: 3,
            type: 'email',
            name: 'email',
            id: 'email',
            placeholder: currentLanguage?.email,
            requireFailMessage: currentLanguage?.emailRequired,
            errorMessage: currentLanguage?.invalidEmail,
        },
    ];
    return (
        <form className="auth-body-item register">
            {registerForm.map((formItem, index) => {
                return (
                    <div
                        className={`form-group ${formItem.name}`}
                        key={formItem.index}
                    >
                        <label htmlFor={formItem.id} className="form-label">
                            {formItem.placeholder}
                        </label>
                        <div className="input-wrapper">
                            <input
                                type={formItem.type}
                                name={formItem.name}
                                id={formItem.id}
                                placeholder={formItem.placeholder}
                                autoComplete="false"
                                spellCheck="false"
                                required={true}
                                onChange={handleDataChange}
                                onBlur={(e) => {
                                    validateFormInput(
                                        e,
                                        isErrorRequired,
                                        setIsErrorRequired,
                                        isErrorPattern,
                                        setIsErrorPattern
                                    );
                                }}
                                onFocus={(e) => {
                                    setError('');
                                }}
                                onInput={(e) => {
                                    removeValidateError(
                                        e,
                                        isErrorRequired,
                                        setIsErrorRequired,
                                        isErrorPattern,
                                        setIsErrorPattern
                                    );
                                }}
                            />
                            <div
                                className="change-type-input"
                                onClick={() => {
                                    if (typeInputPassWord === 'password') {
                                        setTypeInputPassWord('text');
                                    } else {
                                        setTypeInputPassWord('password');
                                    }
                                }}
                            >
                                {typeInputPassWord === 'password' ? (
                                    <BsEyeSlash />
                                ) : (
                                    <BsEye />
                                )}
                            </div>
                        </div>
                        {isErrorRequired[formItem.name] && (
                            <div className="error-message-required">
                                {formItem.requireFailMessage}
                            </div>
                        )}
                        {isErrorPattern[formItem.name] && (
                            <div className="error-message">
                                {formItem.errorMessage}
                            </div>
                        )}
                    </div>
                );
            })}
            <button
                className={clsx('auth-button', {
                    disabled: disabled,
                })}
                onClick={handleRegister}
                disabled={disabled}
            >
                <span>
                    {isPending ? (
                        <SmallLoading />
                    ) : (
                        currentLanguage?.registerButton
                    )}
                </span>
            </button>
            {error && <div className="error-message-after-submit">{error}</div>}
        </form>
    );
};

export default Register;
