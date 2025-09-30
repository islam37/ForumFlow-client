import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
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

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);

  const googleProvider = new GoogleAuthProvider();

  // Fetch user role from backend
  const fetchUserRole = async (uid) => {
    try {
      const res = await AxiosSecure.get(`/users/${uid}`);
      setRole(res.data.role);
    } catch (err) {
      console.error("Failed to fetch role:", err);
      setRole(null);
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
  const signUp = async (email, password) => {
    setOperationLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
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
      setRole(null);
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
      setUser(currentUser);
      if (currentUser?.uid) {
        await fetchUserRole(currentUser.uid); // Fetch role from backend
      } else {
        setRole(null);
      }
      setLoading(false);
      setOperationLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    role,                     // role provided
    loading,
    operationLoading,
    signUp,
    login,
    loginWithGoogle,
    logOut,
    updateUserProfile,
    fetchUserRole,            // function to manually refresh role
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
