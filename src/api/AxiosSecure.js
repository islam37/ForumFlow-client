import axios from "axios";


const AxiosSecure = axios.create({
  baseURL: "http://localhost:3000/api", 
  headers: {
    "Content-Type": "application/json",
  },
});


AxiosSecure.interceptors.request.use(
  (config) => {
    // Example: add token if you have auth
    // const token = localStorage.getItem("token");
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default AxiosSecure;
