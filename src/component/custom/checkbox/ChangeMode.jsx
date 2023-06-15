import React from 'react';
import './ChangeMode.scss';
import { MdLightMode, MdNightlight } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { themeSlice } from '~/component/redux/slices';
const ChangeMode = () => {
    const [theme, setTheme] = React.useState(
        window.localStorage.getItem('theme') || 'light'
    );
    React.useEffect(() => {
        const root = document.querySelector(':root');
        if (root) {
            root.setAttribute('data-theme', theme);
        }
    }, [theme]);
    const dispatch = useDispatch();
    const handleSwitchMode = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
        dispatch(
            themeSlice.actions.change(theme === 'light' ? 'dark' : 'light')
        );

        const root = document.querySelector(':root');
        if (root) {
            const isLightMode =
                root.getAttribute('data-theme') === 'dark' ? false : true;
            // toggle theme mode
            if (isLightMode) {
                root.setAttribute('data-theme', 'dark');
            } else {
                root.setAttribute('data-theme', 'light');
            }
        }
    };
    return (
        <div className='change-mode-checkbox-wrapper'>
            <input
                type='checkbox'
                id='change-mode-checkbox'
                onChange={handleSwitchMode}
                checked={theme === 'light' ? false : true}
            />
            <label htmlFor='change-mode-checkbox'>
                {theme === 'dark' ? <MdNightlight /> : <MdLightMode />}
            </label>
        </div>
    );
};

export default ChangeMode;
