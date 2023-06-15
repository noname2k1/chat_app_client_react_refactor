import { withTokenInstance } from '~/tools/instances/withTokenInstance';

const changePassword = async (currentPassword, newPassword) => {
  try {
    const res = await withTokenInstance.patch(
      `${import.meta.env.VITE_AUTH_SERVER_URL}/api/auth/change-password`,
      {
        currentPassword,
        newPassword,
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { changePassword };
