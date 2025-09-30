import axios from "axios";
import { auth } from "../Firebase/Firebase.Config";

const AxiosSecure = axios.create({
  baseURL: "https://forum-flow-server.vercel.app/api",
  headers: { "Content-Type": "application/json" },
});

// Flag to prevent multiple token refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Attach Firebase ID token to every request
AxiosSecure.interceptors.request.use(
  async (config) => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        // Force token refresh to ensure it's valid
        const token = await currentUser.getIdToken(true);
        console.log("✅ Token attached to request");
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.log("❌ No current user found");
      }
      return config;
    } catch (error) {
      console.error("❌ Error in request interceptor:", error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token errors
AxiosSecure.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 403 and we haven't tried to refresh yet
    if (error.response?.status === 403 && !originalRequest._retry) {
      console.log("🔄 Received 403, attempting token refresh...");
      
      if (isRefreshing) {
        // If already refreshing, add to queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return AxiosSecure(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          // Force refresh the token
          const newToken = await currentUser.getIdToken(true);
          console.log("✅ Token refreshed successfully");
          
          // Update the authorization header
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          // Process queued requests
          processQueue(null, newToken);
          
          // Retry the original request
          return AxiosSecure(originalRequest);
        } else {
          console.log("❌ No user available for token refresh");
          processQueue(new Error("No user available"));
          return Promise.reject(error);
        }
      } catch (refreshError) {
        console.error("❌ Token refresh failed:", refreshError);
        processQueue(refreshError, null);
        
        // Redirect to login if token refresh fails
        if (refreshError.code === 'auth/user-token-expired' || 
            refreshError.code === 'auth/user-not-found') {
          // You can add redirect logic here if needed
          console.log("🔒 Token expired or user not found, redirect to login");
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    if (error.response) {
      console.error("🚨 API Error:", {
        status: error.response.status,
        data: error.response.data,
        url: error.config.url
      });
    } else if (error.request) {
      console.error("🚨 Network Error:", error.request);
    } else {
      console.error("🚨 Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default AxiosSecure;



//http://localhost:3000/api