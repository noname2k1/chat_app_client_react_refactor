import { withTokenInstance } from '~/tools/instances/withTokenInstance';

const searchOthers = async (search_string) => {
  try {
    const results = await withTokenInstance.get(
      `${
        import.meta.env.VITE_AUTH_SERVER_URL
      }/api/profile/search?string=${search_string}`
    );
    return results.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const searchMessageByMessageid = async (roomid, messageid) => {
  try {
    const results = await withTokenInstance.get(
      `${
        import.meta.env.VITE_CHAT_SERVER_URL
      }/api/chat/message/search/${roomid}/${messageid}`
    );
    return results.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const searchMessagesByWord = async (roomid, word) => {
  try {
    const results = await withTokenInstance.get(
      `${
        import.meta.env.VITE_CHAT_SERVER_URL
      }/api/chat/message/search?id=${roomid}&word=${word}`
    );
    return results.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { searchOthers, searchMessageByMessageid, searchMessagesByWord };
