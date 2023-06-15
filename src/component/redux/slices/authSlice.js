import { createSlice } from '@reduxjs/toolkit';
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: false,
        profile: {},
        role: '',
        socketid: '',
    },
    reducers: {
        login: (state, action) => {
            state.isAuthenticated = true;
            state.profile = action.payload.profile;
            state.role = action.payload.role;
            window.localStorage.setItem('token', action.payload.token);
        },
        changeProfile: (state, action) => {
            state.profile = action.payload;
        },
        updateSocketid: (state, action) => {
            state.socketid = action.payload;
        },
        logout: (state, action) => {
            state.isAuthenticated = false;
            state.profile = {};
            state.role = '';
            state.socketid = '';
            window.localStorage.removeItem('token');
            window.localStorage.removeItem('error');
        },
    },
});

export default authSlice;
