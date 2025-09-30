import { createContext } from "react";

export const AuthContext = createContext({
  user: null,
  role: null,                    
  loading: true,
  operationLoading: false,
  signUp: () => Promise.reject(new Error("Not implemented")),
  login: () => Promise.reject(new Error("Not implemented")),
  loginWithGoogle: () => Promise.reject(new Error("Not implemented")),
  logOut: () => Promise.reject(new Error("Not implemented")),
  updateUserProfile: () => Promise.reject(new Error("Not implemented")),
  fetchUserRole: () => Promise.reject(new Error("Not implemented"))
});
