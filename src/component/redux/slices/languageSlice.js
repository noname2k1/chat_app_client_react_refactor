import { createSlice } from '@reduxjs/toolkit';
import { EN } from '~/Languages';
const languageSlice = createSlice({
    name: 'languages',
    initialState: {
        currentLanguage:
            JSON.parse(window.localStorage.getItem('language')) || EN,
    },
    reducers: {
        changeLanguage: (state, action) => {
            state.currentLanguage = action.payload.currentLanguage;
        },
    },
});

export default languageSlice;
