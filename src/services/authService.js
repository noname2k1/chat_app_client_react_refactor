import { withoutTokenInstance } from '~/tools/instances/withoutTokenInstance';
import { withTokenInstance } from '~/tools/instances/withTokenInstance';

const loadMyAccout = async () => {
    try {
        const res = await withTokenInstance.get(
            `${import.meta.env.VITE_AUTH_SERVER_URL}/api/auth/me`
        );
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

//Login
const login = async (formData) => {
    try {
        const res = await withoutTokenInstance.post(
            `${import.meta.env.VITE_AUTH_SERVER_URL}/api/auth/login`,
            formData
        );
        // console.log(res);
        return res.data;
    } catch (error) {
        throw error.response;
    }
};
//Register
const register = async (formData) => {
    try {
        const res = await withoutTokenInstance.post(
            `${import.meta.env.VITE_AUTH_SERVER_URL}/api/auth/register`,
            formData
        );
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export { loadMyAccout, login, register };
