import React from 'react';
import { BsDoorClosed, BsDoorOpen } from 'react-icons/bs';
const Close = ({ onClick }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const styles = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
    };
    return (
        <div
            className='quit__button'
            onMouseOver={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            style={styles}
            onClick={onClick}
        >
            {isOpen ? <BsDoorOpen size={30} /> : <BsDoorClosed size={30} />}
        </div>
    );
};

export default Close;
