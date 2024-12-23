const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

export const fetchFooterData = async () => {
  const response = [];

  if (!response.ok) throw new Error("Failed to fetch contact data");
  return await response.json();
};
