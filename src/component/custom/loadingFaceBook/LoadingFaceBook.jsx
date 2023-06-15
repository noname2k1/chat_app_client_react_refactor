import React from 'react';
import './LoadingFaceBook.scss';
const LoadingFaceBook = () => {
    return (
        <div className='loading-facebook-wrapper'>
            <div className='lds-facebook'>
                <div />
                <div />
                <div />
            </div>
        </div>
    );
};

export default LoadingFaceBook;
