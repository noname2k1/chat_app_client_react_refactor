import React from 'react';

const Overlay = ({ onClick }) => {
    const style = {
        position: 'fixed',
        inset: '0',
        background: 'transparent',
        zIndex: '9999',
    };
    return <div id='overlay' onClick={onClick} style={style}></div>;
};

export default Overlay;
