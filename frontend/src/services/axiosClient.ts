import axios, { AxiosInstance } from "axios";

// Create a new instance of Axios
const axiosClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // Replace with your API base URL
  timeout: 300000, // Set a timeout value in milliseconds
  headers: {
    "Content-Type": "application/json", // Set the content type for requests
  },
});

export default axiosClient;
