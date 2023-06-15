import { withTokenInstance } from '~/tools/instances/withTokenInstance';

const getMessages = async (roomid, page = 0, limit = 30) => {
  try {
    const res = await withTokenInstance.get(
      `${
        import.meta.env.VITE_CHAT_SERVER_URL
      }/api/chat/message?id=${roomid}&page=${page}&limit=${limit}`
    );
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getAttachments = async (roomid) => {
  try {
    const res = await withTokenInstance.get(
      `${
        import.meta.env.VITE_CHAT_SERVER_URL
      }/api/chat/message/attachment/${roomid}`
    );
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { getMessages, getAttachments };
