import { postRequest } from "../../api/api";

export const signInSellerApi = async ({ email, password }) => {
  const response = await postRequest("/SellerLogin", { email, password });


  if (response.data.success) {

    return {
      sellerId: response.data.content.sellerId,
      token: response.data.content.token,
      name: response.data.content.name,
      email: response.data.content.email,
      shopId: response.data.content.shopId,
      shopName: response.data.content.shopName,
      ownerName: response.data.content.ownerName,
    };
  } else {
    throw new Error(response.data.title);
  }
};
