import { createSlice } from '@reduxjs/toolkit';

const themeSlice = createSlice({
    name: 'themes',
    initialState: {
        theme: window.localStorage.getItem('theme') || 'light',
    },
    reducers: {
        change: (state, action) => {
            state.theme = action.payload;
            window.localStorage.setItem('theme', action.payload);
        },
    },
});

export default themeSlice;
