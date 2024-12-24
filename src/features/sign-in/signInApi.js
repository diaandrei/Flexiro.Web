import { postRequest } from '../../api/api';
import toast from 'react-hot-toast';

export const signInApi = async ({ email, password }) => {
    const response = await postRequest('/login', { email, password });

    debugger;
    if (response.data.success) {
        toast.success('Logged in successfully. Welcome back!');
        return {
            userId: response.data.content.id,
            token: response.data.content.token,
            role: response.data.content.role,
            name: response.data.content.name,
            email: response.data.content.email,
            name: response.data.content.name,
            sellerId: response.data.content.id || null,
            shopId: response.data.content.additionalInfo?.shopId || null,
            shopName: response.data.content.additionalInfo?.shopName || null,
            ownerName: response.data.content.additionalInfo?.OwnerName || null,
        };
    }
    else {

        throw new Error(response.data.title);
    }

};
