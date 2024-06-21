import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// Create a new instance of Axios
const axiosClient: AxiosInstance = axios.create({
  baseURL: "http://localhost:8000", // Replace with your API base URL
  timeout: 300000, // Set a timeout value in milliseconds
  headers: {
    "Content-Type": "application/json", // Set the content type for requests
  },
});

// Define a request interceptor
axiosClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // You can modify the request config here (e.g. add authentication headers)
    return config;
  },
  (error) => {
    // Handle request errors here
    return Promise.reject(error);
  }
);

// Define a response interceptor
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // You can modify the response data here (e.g. parse JSON, handle errors)
    return response;
  },
  (error) => {
    // Handle response errors here
    return Promise.reject(error);
  }
);

export default axiosClient;
