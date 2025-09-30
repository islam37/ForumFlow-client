import React, { useState, useEffect } from "react";
import { auth } from "../../Firebase/Firebase.Config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import AxiosSecure from "../../api/AxiosSecure"; 
import { AuthContext } from "./AuthContext";



const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);

  const googleProvider = new GoogleAuthProvider();

  // Fetch user role from backend
  const fetchUserRole = async (uid) => {
    try {
      console.log("Fetching role for user:", uid);
      const res = await AxiosSecure.get("/me");
      console.log("User data:", res.data);
      setRole(res.data.role || "user");
      return res.data.role;
    } catch (err) {
      console.error("Failed to fetch role:", err);
      console.error("Error details:", err.response?.data);
      setRole("user"); // Default to user role
      return "user";
    }
  };

  // Update profile
  const updateUserProfile = async (profileData) => {
    setOperationLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("No user is currently logged in");

      await updateProfile(currentUser, {
        displayName: profileData.displayName,
        photoURL: profileData.photoURL,
      });

      setUser({
        ...currentUser,
        displayName: profileData.displayName,
        photoURL: profileData.photoURL,
      });

      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    } finally {
      setOperationLoading(false);
    }
  };

  // Signup with email/password
  const signUp = async (email, password, displayName = "Anonymous") => {
    setOperationLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: displayName
      });

      console.log("User created in Firebase:", userCredential.user.uid);

      // Create user in MongoDB via your API
      try {
        await AxiosSecure.post('/users', {
          uid: userCredential.user.uid,
          email: email,
          name: displayName,
          role: "user"
        });
        console.log("User created in MongoDB");
      } catch (err) {
        console.error("Failed to create user in MongoDB:", err);
        // Continue even if MongoDB creation fails
      }

      return userCredential;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setOperationLoading(false);
    }
  };

  // Login with email/password
  const login = async (email, password) => {
    setOperationLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in:", userCredential.user.uid);
      return userCredential;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setOperationLoading(false);
    }
  };

  // Google login
  const loginWithGoogle = async () => {
    setOperationLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google login successful:", result.user.uid);
      return result;
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    } finally {
      setOperationLoading(false);
    }
  };

  // Logout
  const logOut = async () => {
    setOperationLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setRole(null);
      console.log("User logged out");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      setOperationLoading(false);
    }
  };

  // Track Firebase auth state and fetch role
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("Auth state changed:", currentUser ? "User logged in" : "No user");
      setUser(currentUser);
      
      if (currentUser) {
        console.log("Current user UID:", currentUser.uid);
        try {
          await fetchUserRole(currentUser.uid);
        } catch (err) {
          console.error("Error in auth state change:", err);
        }
      } else {
        setRole(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    role,                     
    loading,
    operationLoading,
    signUp,
    login,
    loginWithGoogle,
    logOut,
    updateUserProfile,
    fetchUserRole,            
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;