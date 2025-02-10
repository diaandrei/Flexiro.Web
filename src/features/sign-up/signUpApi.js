import { postRequest } from "../../api/api";

export const signUpAPI = async (userData) => {
  try {
    const response = await postRequest("/Account/register", userData);
    return response.data;
  }
  catch (error) {

    throw new Error(
      error.response?.data?.content?.title || error.message
    );
  }
};
