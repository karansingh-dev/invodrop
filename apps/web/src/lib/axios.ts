import axios from "axios";

export const axiosInstance = (
  baseURL: string,
  contentType = "application/json",
  token?: string
) => {
  // Create a new Axios instance with baseURL and default configurations
  const instance = axios.create({
    baseURL,
    timeout: 60000, // Set timeout to 60 seconds
    headers: {
      "Content-Type": contentType,
      "Access-Control-Allow-Origin": "*", // Allow CORS
    },
  });

  // Add a request interceptor to include the token in requests
  instance.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Add a response interceptor to handle errors
  instance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
  );

  // Return the custom Axios instance
  return instance;
};
