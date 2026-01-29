import axiosInstance from "./axiosInstance";

// Get all states (like kerala etc)
export const getAllStates = async () => {
  try {
    const res = await axiosInstance.get("/states");
    return res.data.data;
  } catch (err) {
    console.error("Error fetching states:", err);
    throw err;
  }
};
