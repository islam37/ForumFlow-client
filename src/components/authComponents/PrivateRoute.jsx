import React, { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../authComponents/AuthContext";
import AxiosSecure from "../../api/AxiosSecure";

const PrivateRoute = ({ requiredRole }) => {
  const { user, loading } = useContext(AuthContext);
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  // Fetch role from backend
  useEffect(() => {
    if (user) {
      const fetchRole = async () => {
        try {
          const res = await AxiosSecure.get(`/users/${user.uid}`);
          setRole(res.data.role);
        } catch (err) {
          console.error("Failed to fetch user role:", err);
        } finally {
          setRoleLoading(false);
        }
      };
      fetchRole();
    } else {
      setRoleLoading(false);
    }
  }, [user]);

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Checking authentication...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">Access Denied: {requiredRole} only</p>
      </div>
    );
  }

  return <Outlet />;
};

export default PrivateRoute;
