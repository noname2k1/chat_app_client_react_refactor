import React from 'react';
import './Toast.scss';
import { IoCloseSharp } from 'react-icons/io5';
import { BsBellFill } from 'react-icons/bs';
import { useLanguageSelector } from '~/component/redux/selector';
const Toast = ({ content, setNotification }) => {
    const currentLanguage = useLanguageSelector().currentLanguage;
    const toastRef = React.useRef();
    const closeRef = React.useRef();
    const progressRef = React.useRef();
    React.useEffect(() => {
        const timeline1 = 8000,
            timeline2 = 8300,
            timeClose = 500;
        const toast = toastRef.current;
        const closeIcon = closeRef.current;
        const progress = progressRef.current;
        let timer1, timer2;
        toast.classList.add('active');
        progress.classList.add('active');
        timer1 = setTimeout(() => {
            toast.classList.remove('active');
        }, timeline1); //1s = 1000 milliseconds
        timer2 = setTimeout(() => {
            progress.classList.remove('active');
            setNotification({
                enabled: false,
                content: '',
            });
        }, timeline2);
        closeIcon.addEventListener('click', () => {
            toast.classList.remove('active');
            setTimeout(() => {
                progress.classList.remove('active');
                setNotification({
                    enabled: false,
                    content: '',
                });
            }, timeClose);
            clearTimeout(timer1);
            clearTimeout(timer2);
        });
        //eslint-disable-next-line
    }, []);
    return (
        <div id='toast-container'>
            <div className='toast active' ref={toastRef}>
                <div className='toast-content'>
                    <div className='icon'>
                        <BsBellFill />
                    </div>
                    <div className='message'>
                        <span className='text title'>
                            {currentLanguage.notification}
                        </span>
                        <span className='text content'>{content}</span>
                    </div>
                    <div className='close' ref={closeRef}>
                        <IoCloseSharp size={30} />
                    </div>
                </div>
                {/* Remove 'active' class, this is just to show in Codepen thumbnail */}
                <div className='progress active' ref={progressRef} />
            </div>
        </div>
    );
};

export default Toast;
