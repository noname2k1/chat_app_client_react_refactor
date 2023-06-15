import React from 'react';
import styled from 'styled-components';
import spinnerGif from '~/images/spinner.gif';
import checkGif from '~/images/check-mark.gif';
import crossImg from '~/images/cross-mark.png';

const LoadingModalContainer = styled.section`
    position: fixed;
    inset: 0;
    background-color: transparent;
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const Modal = styled.div`
    position: fixed;
    z-index: 1000;
    height: 300px;
    width: 400px;
    background-color: var(--text-color);
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    border-radius: 10px;
    p {
        margin-top: 20px;
        color: var(--bg-color);
        font-size: 2rem;
        font-weight: 600;
    }
    img {
        &.error {
            width: 50px;
            height: 50px;
        }
        &.success {
            width: 132px;
            height: 100px;
        }
    }
    @media (max-width: 768px) {
        max-width: 90%;
    }
`;
const LoadingModal = ({ message = 'Sending...', display = 'loading' }) => {
    const handleClose = (e) => {
        e.preventDefault();
        e.target.closest('.loading-modal-container').style = 'display:none';
    };
    return (
        <LoadingModalContainer
            onClick={handleClose}
            className='loading-modal-container'
        >
            <Modal className='modal'>
                {display === 'loading' && (
                    <img src={spinnerGif} alt='spinner' />
                )}
                {display === 'success' && (
                    <img src={checkGif} className='success' alt='check' />
                )}
                {display === 'error' && (
                    <img src={crossImg} className='error' alt='cross' />
                )}
                <p>{message}</p>
            </Modal>
        </LoadingModalContainer>
    );
};

export default LoadingModal;
