import axiosInstance from "./axiosInstance";


// Use this for both sign-in and sign-up (request OTP)
export const loginWithPhone = async (phone) => {
  try {
    const response = await axiosInstance.post("/websitelogin", { phone });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const verifyOtp = async (phone, otp) => {
  try {
    const response = await axiosInstance.post("/verify-website-otp", { phone, otp });
    console.log(response, "otp  response");
    // Log all levels for debugging
    console.log(response.data, "otp response.data");
    console.log(response.data?.data, "otp response.data.data");
    // Return the correct data structure
    if (response.data && response.data.data) {
      return response.data.data;
    } else if (response.data) {
      return response.data;
    } else {
      return response;
    }
  } catch (error) {
    throw error.response?.data || error;
  }
};


