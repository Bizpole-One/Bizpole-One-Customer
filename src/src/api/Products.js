// 📁 api/getProducts.js

import axiosInstance from "./axiosInstance";

// ✅ Function to get products
export const getProducts = async () => {
  try {
    const response = await axiosInstance.get("/getproducts");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
