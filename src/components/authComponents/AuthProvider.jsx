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

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);

  const googleProvider = new GoogleAuthProvider();

  // ADD THIS FUNCTION - Profile Update
  const updateUserProfile = async (profileData) => {
    setOperationLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("No user is currently logged in");
      }

      console.log("Updating profile with:", profileData);
      
      // Update profile in Firebase Auth
      await updateProfile(currentUser, {
        displayName: profileData.displayName,
        photoURL: profileData.photoURL
      });

      // Update local state to reflect changes immediately
      setUser({
        ...currentUser,
        displayName: profileData.displayName,
        photoURL: profileData.photoURL
      });

      console.log("Profile updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    } finally {
      setOperationLoading(false);
    }
  };

  // Signup with email and password
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

  // Login with email and password
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
    try {
      setOperationLoading(true);
      await signOut(auth);
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      setOperationLoading(false);
    }
  };

  // Track user authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed:", currentUser);
      setUser(currentUser);
      setLoading(false);
      setOperationLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    operationLoading,
    signUp,
    login,
    loginWithGoogle,
    logOut,
    updateUserProfile, 
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;