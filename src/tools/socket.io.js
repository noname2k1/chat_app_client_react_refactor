import { io } from 'socket.io-client';
const CHAT_SERVER_URL = import.meta.env.VITE_CHAT_SERVER_URL;
const socket = io(CHAT_SERVER_URL);
export default socket;
