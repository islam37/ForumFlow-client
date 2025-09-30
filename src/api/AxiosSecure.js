import axios from "axios";
import { auth } from "../Firebase/Firebase.Config";

const AxiosSecure = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: { "Content-Type": "application/json" },
});

// Attach Firebase ID token to every request
AxiosSecure.interceptors.request.use(
  async (config) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const token = await currentUser.getIdToken(); // Firebase token
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default AxiosSecure;
