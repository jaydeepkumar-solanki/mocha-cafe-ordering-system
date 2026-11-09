import api from "../api/axios";

// Fetch all categories
export const getCategories = async () => {
  try {
    const response = await api.get("/categories");

    return response.data;
  } catch (error) {
    console.error(
      "Failed to fetch categories:",
      error.response?.data || error.message,
    );

    throw error;
  }
};
