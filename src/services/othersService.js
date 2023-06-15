import { withTokenInstance } from '~/tools/instances/withTokenInstance';

const contribute = async (formData) => {
  try {
    const res = await withTokenInstance.post(
      `${import.meta.env.VITE_UPLOAD_SERVER_URL}/api/contribute`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { contribute };
