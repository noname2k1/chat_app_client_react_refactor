import axios from 'axios';
import { withTokenInstance } from './instances/withTokenInstance';
import { withoutTokenInstance } from './instances/withoutTokenInstance';
//Get user when refresh page
const getUserThroughToken = async () => {
    try {
        const { data } = await withTokenInstance.get(
            `${import.meta.env.VITE_AUTH_SERVER_URL}/api/auth`
        );
        if (data.status === 'success') {
            return data;
        }
    } catch (error) {
        return error.response.data;
    }
};

// Upload image to cloundinary
const uploadToCloudinary = async (formData, type) => {
    const cloundinaryName = 'ninhnam';
    try {
        const res = await withoutTokenInstance.post(
            'https://api.cloudinary.com/v1_1/' +
                cloundinaryName +
                '/' +
                type +
                '/upload',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        if (res.status === 200) {
            return res.data;
        }
    } catch (error) {
        console.log(error);
    }
};

export { getUserThroughToken, uploadToCloudinary };
