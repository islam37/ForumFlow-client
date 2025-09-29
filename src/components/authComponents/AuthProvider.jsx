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
} from "firebase/auth";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);

  const googleProvider = new GoogleAuthProvider();

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

  // Logout - Fixed implementation
  const logOut = async () => {
    try {
      setOperationLoading(true);
      await signOut(auth);
      console.log("Logout successful");
      // Note: onAuthStateChanged will automatically set user to null
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      setOperationLoading(false);
    }
  };

  // Track user authentication state - FIXED
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed:", currentUser);
      setUser(currentUser);
      setLoading(false);
      setOperationLoading(false);
    });

    // Cleanup subscription on unmount
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
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;