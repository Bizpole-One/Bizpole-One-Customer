export const getPackagesByServiceType = async (serviceTypeId) => {
  try {
    const response = await axiosInstance.post("/getPackagesByServiceType", { serviceTypeId });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching packages by service type:", error);
    throw error;
  }
};

import axiosInstance from "./axiosInstance";

export const getAllServiceTypes = async () => {
  try {
    const response = await axiosInstance.get("/listServiceTypes");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching service types:", error);
    throw error;
  }
};
