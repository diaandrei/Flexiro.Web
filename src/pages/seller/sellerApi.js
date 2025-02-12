import axios from "axios";
import toast from 'react-hot-toast';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

export const fetchSellerDashboardData = async (shopId) => {
  try {
    const response = await axios.get(
      `https://flexiroapi-d7akfuaug8d7esdg.uksouth-01.azurewebsites.net/api/Seller/dashboard/${shopId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchSellerProducts = async (shopId) => {
  try {
    const response = await axios.get(
      `https://flexiroapi-d7akfuaug8d7esdg.uksouth-01.azurewebsites.net/api/Seller/getallproducts/${shopId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changeProductStatus = async (productId, newStatus) => {
  try {
    const statusData = {
      productId: productId,
      newStatus: newStatus,
    };
    const response = await axios.put(
      `https://flexiroapi-d7akfuaug8d7esdg.uksouth-01.azurewebsites.net/api/Seller/product/status`,
      statusData
    );
    if (response.data.success === true) {
      toast.success('Product status updated successfully!');
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchShopDetails = async (ownerId) => {
  try {
    const response = await axios.get(
      `https://flexiroapi-d7akfuaug8d7esdg.uksouth-01.azurewebsites.net/api/Seller/GetShopByOwner/${ownerId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSellerContactInfo = async (sellerId, email, phoneNumber) => {
  try {
    const sellerData = {
      sellerId: String(sellerId),
      email: email,
      phoneNumber: phoneNumber,
    };

    const response = await axios.put(
      `https://flexiroapi-d7akfuaug8d7esdg.uksouth-01.azurewebsites.net/api/Account/UpdateSellerContactInfo`,
      sellerData
    );

    if (response.data.success === true) {
      toast.success(response.data.title);
    } else if (response.data.success === false) {
      toast.error(response.data.title);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changeShopStatus = async (
  shopId,
  newStatus,
  editedOpeningDay,
  editedClosingDay,
  editedOpeningTime,
  editedClosingTime
) => {
  try {
    const statusData = {
      shopId: shopId,
      newStatus: newStatus,
      OpeningTime: String(editedOpeningTime),
      ClosingTime: String(editedClosingTime),
      OpeningDay: editedOpeningDay,
      ClosingDay: editedClosingDay,
    };
    const response = await axios.put(
      `https://flexiroapi-d7akfuaug8d7esdg.uksouth-01.azurewebsites.net/api/Seller/ChangeShopStatus`,
      statusData
    );
    if (response.data.success === true) {
      toast.success(response.data.title);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateShopInfo = async (
  shopId,
  editedStoreName,
  editedSlogan,
  editedDescription,
  editedShopLogo
) => {
  try {
    const formData = new FormData();
    formData.append("shopId", shopId);
    formData.append("ShopName", editedStoreName);
    formData.append("Slogan", editedSlogan);
    formData.append("ShopDescription", editedDescription);
    if (editedShopLogo) {
      formData.append("ShopLogo", editedShopLogo);
    }

    const response = await axios.put(
      `https://flexiroapi-d7akfuaug8d7esdg.uksouth-01.azurewebsites.net/api/Seller/updateshop`,
      formData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSellerProfile = async (sellerId) => {
  try {
    const response = await axios.get(
      `https://flexiroapi-d7akfuaug8d7esdg.uksouth-01.azurewebsites.net/api/seller/profile/${sellerId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`https://flexiroapi-d7akfuaug8d7esdg.uksouth-01.azurewebsites.net/api/Seller/GetAllCategories`);

    // Handle different response formats
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && typeof response.data === "object") {
      const possibleArrays = ["data", "content", "categories", "items"];
      for (const prop of possibleArrays) {
        if (Array.isArray(response.data[prop])) {
          return response.data[prop];
        }
      }
      const arrayProperty = Object.values(response.data).find((value) =>
        Array.isArray(value)
      );
      if (arrayProperty) {
        return arrayProperty;
      }
    }

    return [];
  } catch (error) {
    return [];
  }
};

// Add Product Api
export const addProduct = async (productData) => {
  try {
    const status = productData.get("status");
    const price = productData.get("price");

    if (price) {
      productData.set("price", parseInt(price, 10));
    }
    const response = await axios.post(
      `https://flexiroapi-d7akfuaug8d7esdg.uksouth-01.azurewebsites.net/api/Seller/product/add`,
      productData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        `Server responded with ${error.response.status}: ${JSON.stringify(
          error.response.data
        )}`
      );
    } else if (error.request) {
      throw new Error("No response received from server");
    } else {
      throw error;
    }
  }
};

export const fetchOrdersByShop = async (shopId) => {
  try {
    const response = await axios.get(`https://flexiroapi-d7akfuaug8d7esdg.uksouth-01.azurewebsites.net/api/Seller/orders`, {
      params: { shopId },
    });
    return response.data;
  } catch (error) {
    return {};
  }
};

export const changeOrderStatus = async (orderId, newStatus) => {
  try {
    const request = {
      OrderId: orderId,
      NewStatus: parseInt(newStatus, 10),
    };

    const response = await axios.put(
      `https://flexiroapi-d7akfuaug8d7esdg.uksouth-01.azurewebsites.net/api/Seller/order/update-status`,
      request
    );
    if (response.data.success === true) {
      toast.success(response.data.message);
    }
    if (response.data.success === false) {
      toast.error(response.data.message);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchWishlistProducts = async (shopId) => {
  try {
    const response = await axios.get(
      `https://flexiroapi-d7akfuaug8d7esdg.uksouth-01.azurewebsites.net/api/Seller/wishlist-products/${shopId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProductDiscount = async (productId, discountPercentage) => {
  try {
    const response = await axios.put(`https://flexiroapi-d7akfuaug8d7esdg.uksouth-01.azurewebsites.net/api/Seller/product/update-discount/${productId}`, {
      discountPercentage
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
