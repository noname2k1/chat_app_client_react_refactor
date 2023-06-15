import React from 'react';
import { useDispatch } from 'react-redux';
import { useLanguageSelector } from '~/component/redux/selector';
import { componentSlice } from '~/component/redux/slices';
import SearchBar from '~/component/searchbar/SearchBar';
import './MobileSearchBar.scss';
const MobileSearchBar = () => {
    const dispatch = useDispatch();
    const { currentLanguage } = useLanguageSelector();
    const handleCloseMobileSearchBar = (e) => {
        if (
            Array.from(e.target.classList).indexOf(
                'mobile-searchbar-container'
            ) !== -1 ||
            e.target.closest('.search-result-item')
        ) {
            dispatch(componentSlice.actions.setMobileSearchBar(false));
        }
    };
    return (
        <div
            className='mobile-searchbar-container'
            onClick={handleCloseMobileSearchBar}
        >
            <SearchBar
                target={'profile'}
                placeholder={currentLanguage.typeofRoomIDPlaceholder}
                autoFocus={true}
            />
        </div>
    );
};

export default MobileSearchBar;
