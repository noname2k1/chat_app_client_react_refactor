import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
    authSlice,
    languageSlice,
    themeSlice,
    usersOnlineSlice,
    componentSlice,
} from './slices';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['components'],
};

const rootReducer = combineReducers({
    auth: authSlice.reducer,
    languages: languageSlice.reducer,
    themes: themeSlice.reducer,
    usersOnlines: usersOnlineSlice.reducer,
    components: componentSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    devTools: import.meta.env.VITE_NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);
export default store;
