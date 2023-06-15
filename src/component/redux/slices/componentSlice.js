import { createSlice } from '@reduxjs/toolkit';
const componentSlice = createSlice({
    name: 'components',
    initialState: {
        comingSoon: false,
        contribute: false,
        roomBox: false,
        dropdown: {
            accountDropDown: false,
            roomDropDown: false,
        },
        dropdownItem: {
            accountModal: false,
            roomOptions: {
                enabled: false,
                roomDetails: false,
                roomSettings: false,
                listOfMembers: false,
                activityReports: false,
            },
        },
        currentRoom: {},
        selectedRoomid: '',
        call: false,
        searchInConversation: false,
        currentMessages: [],
        messagesLastPage: 0,
        messageMediaFilesLinksPage: false,
        viewFileModal: {
            enabled: false,
            files: [],
            currentIndex: 0,
            zoomFile: false,
        },
        replying: {
            enabled: false,
            message: {},
        },
        mobileSearchBar: false,
        mobileAccountsOnline: false,
    },
    reducers: {
        setDropdown: (state, action) => {
            state.dropdown = {
                ...state.dropdown,
                ...action.payload,
            };
        },
        setRoomid: (state, action) => {
            state.selectedRoomid = action.payload;
        },
        setDropdownItem: (state, action) => {
            state.dropdownItem = { ...state.dropdownItem, ...action.payload };
        },
        setCall: (state, action) => {
            state.call = action.payload;
        },
        setCurrentRoom: (state, action) => {
            state.currentRoom = action.payload;
        },
        setSearchInConversation: (state, action) => {
            state.searchInConversation = action.payload;
        },
        setMessages: (state, action) => {
            state.currentMessages = action.payload;
        },
        setPage: (state, action) => {
            state.messagesLastPage = action.payload;
        },
        setMessageMediaFilesLinksPage: (state, action) => {
            state.messageMediaFilesLinksPage = action.payload;
        },
        setAllInMessage: (state, action) => {
            state.currentMessages = [];
            state.messagesLastPage = 0;
            state.messageMediaFilesLinksPage = false;
        },
        setViewFileModal: (state, action) => {
            state.viewFileModal = { ...state.viewFileModal, ...action.payload };
        },
        setReplying: (state, action) => {
            state.replying = { ...state.replying, ...action.payload };
        },
        setMobileSearchBar: (state, action) => {
            state.mobileSearchBar = action.payload;
        },
        setMobileAccountsOnline: (state, action) => {
            state.mobileAccountsOnline = action.payload;
        },
        setPropertie: (state, action) => {
            state[Object.keys(action.payload)[0]] = Object.values(
                action.payload
            )[0];
        },
    },
});

export default componentSlice;
