import { useSelector } from 'react-redux';

export const useAuthSelector = () => useSelector((state) => state.auth);
export const useLanguageSelector = () =>
    useSelector((state) => state.languages);
export const useThemeSelector = () => useSelector((state) => state.themes);
export const useUsersOnlineSelector = () =>
    useSelector((state) => state.usersOnlines);
export const useComponentSelector = () =>
    useSelector((state) => state.components);
