import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'usersOnlines',
    initialState: {
        usersOnline: [],
    },
    reducers: {
        update: (state, action) => {
            state.usersOnline = action.payload;
        },
    },
});

export default authSlice;
