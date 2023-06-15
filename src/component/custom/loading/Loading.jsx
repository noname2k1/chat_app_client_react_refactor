import React from 'react';
import './Loading.scss';
import Typewriter from 'typewriter-effect';
import { useLanguageSelector } from '~/component/redux/selector';
const Loading = () => {
    const currentLanguage = useLanguageSelector().currentLanguage;
    return (
        <div className='loading-wrapper'>
            <Typewriter
                onInit={(typewriter) => {
                    typewriter
                        .typeString(currentLanguage.loadingText)
                        .pauseFor(400)
                        .deleteAll()
                        .pauseFor(500)
                        .start();
                }}
                options={{
                    autoStart: true,
                    loop: true,
                }}
            />
            <div className='lds-ring'>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
};

export default Loading;
