import { postRequest } from '../../api/api';

export const registerSellerAPI = async (sellerData) => {
    const formData = new FormData();
    const fieldsMap = {
        'UserName': sellerData.userName,
        'OwnerName': sellerData.ownerName,
        'ShopLogo': sellerData.shopLogo,
        'StoreName': sellerData.storeName,
        'Slogan': sellerData.slogan,
        'ContactNo': sellerData.contactNo,
        'Country': sellerData.country,
        'City': sellerData.city,
        'ZipCode': sellerData.zipCode,
        'StoreDescription': sellerData.storeDescription,
        'Email': sellerData.email,
        'Password': sellerData.password,
        'OpeningDate': sellerData.openingDate,
        'OpeningTime': sellerData.openingTime,
        'ClosingTime': sellerData.closingTime,
        'OpeningDay': sellerData.openingDay,
        'ClosingDay': sellerData.closingDay,

    };
    debugger;
    Object.entries(fieldsMap).forEach(([key, value]) => {
        if (value === undefined || value === null) {
            throw new Error(`${key} is required`);
        }

        if (key === 'ShopLogo' && value instanceof File) {
            formData.append(key, value, value.name);
        } else if (key === 'OpeningDate' && value instanceof Date) {
            formData.append(key, value.toISOString());
        } else {
            formData.append(key, value);
        }
    });

    try {
        const response = await postRequest('/RegisterSeller', formData);
        if (response.status >= 400) {
            const errorMessage = response.data?.content?.title || 'Registration failed. Please ensure all fields are filled out correctly and try again.';
            throw new Error(errorMessage);
        }
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.content?.title || error.message || 'Failed to register seller account.');
    }
};
