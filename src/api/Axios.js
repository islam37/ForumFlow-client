import axios from "axios";

const Axios = axios.create({
  baseURL: "http://localhost:3000/api", 
  headers: { "Content-Type": "application/json" },
});


Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default Axios;
