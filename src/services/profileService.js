import { withTokenInstance } from '~/tools/instances/withTokenInstance';

const getProfileByProfileid = async (profileid) => {
  try {
    const res = await withTokenInstance.get(
      `${import.meta.env.VITE_AUTH_SERVER_URL}/api/profile/${profileid}`
    );
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateProfile = async (formData) => {
  try {
    const res = await withTokenInstance.patch(
      `${import.meta.env.VITE_AUTH_SERVER_URL}/api/profile`,
      formData
    );
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { getProfileByProfileid, updateProfile };
