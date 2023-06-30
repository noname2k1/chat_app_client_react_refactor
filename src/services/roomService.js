import { withTokenInstance } from '~/tools/instances/withTokenInstance';

const getSuggestRooms = async () => {
    try {
        const res = await withTokenInstance.get(
            `${import.meta.env.VITE_CHAT_SERVER_URL}/api/chat/room`
        );
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
// get my rooms
const getMyRooms = async () => {
    try {
        const res = await withTokenInstance.get(
            `${import.meta.env.VITE_CHAT_SERVER_URL}/api/chat/room/me`
        );
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

// get rooms by name
const getRooms = async (room_string) => {
    try {
        const res = await withTokenInstance.get(
            `${
                import.meta.env.VITE_CHAT_SERVER_URL
            }/api/chat/room/search?string=${room_string}`
        );
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const getRoomsByName = async (search_string) => {
    try {
        const res = await withTokenInstance.get(
            `${
                import.meta.env.VITE_CHAT_SERVER_URL
            }/api/chat/room/search-by-name?search_string=${search_string}`
        );
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

//get specific room
const getRoom = async (roomid) => {
    try {
        const res = await withTokenInstance.get(
            `${import.meta.env.VITE_CHAT_SERVER_URL}/api/chat/room/${roomid}`
        );
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const getRoomByProfileid = async (profileid) => {
    try {
        const res = await withTokenInstance.post(
            `${
                import.meta.env.VITE_CHAT_SERVER_URL
            }/api/chat/room?mode=private`,
            { otherprofileid: profileid }
        );
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

// create room
const createRoom = async (room_name) => {
    try {
        const res = await withTokenInstance.post(
            `${import.meta.env.VITE_CHAT_SERVER_URL}/api/chat/room?mode=room`,
            { name: room_name }
        );
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

// UPDATE a part of specific room
const patchRoom = async (profileid, roomid, action, field) => {
    try {
        const res = await withTokenInstance.patch(
            `${import.meta.env.VITE_CHAT_SERVER_URL}/api/chat/room`,
            {
                patch: {
                    id: profileid,
                    roomid,
                    action, //$push, $pull
                    field, //field of model that need modified
                },
            }
        );
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const changeRoomBackground = async (roomid, colorid) => {
    try {
        const res = await withTokenInstance.patch(
            `${
                import.meta.env.VITE_CHAT_SERVER_URL
            }/api/chat/room/change-background`,
            {
                roomid: roomid,
                backgroundColor: colorid,
            }
        );
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export {
    getSuggestRooms,
    getMyRooms,
    patchRoom,
    getRooms,
    getRoomsByName,
    getRoom,
    getRoomByProfileid,
    createRoom,
    changeRoomBackground,
};
