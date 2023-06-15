import React from 'react';
import { useDispatch } from 'react-redux';
import { useLanguageSelector } from '~/component/redux/selector';
import { componentSlice } from '~/component/redux/slices';
import './ComingSoon.scss';
const ComingSoon = () => {
    const { currentLanguage } = useLanguageSelector();
    const dispatch = useDispatch();
    const handleCloseComingSoonModal = () => {
        dispatch(componentSlice.actions.setPropertie({ comingSoon: false }));
    };
    return (
        <div className='coming-soon-container'>
            <div className='coming-soon-wrapper'>
                <h1>{currentLanguage.comingSoon} !!!</h1>
                <p>{currentLanguage.staytunedformoreupdates}</p>
            </div>
            <div
                className='coming-soon-overlay'
                onClick={handleCloseComingSoonModal}
            ></div>
        </div>
    );
};

export default ComingSoon;
