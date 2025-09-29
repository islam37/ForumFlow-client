import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../authComponents/AuthContext";
import { FiHome, FiBell, FiSettings, FiLogOut } from "react-icons/fi";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo + Website Name */}
        <Link to="/" className="flex items-center gap-3 font-extrabold text-white text-2xl hover:scale-105 transition-transform">
          <img src="/src/assets/images/Logo.png" alt="Logo" className="h-10 w-10 rounded-full border-2 border-white" />
          ForumFlow
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6 text-white font-medium">
          <Link
            to="/"
            className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-white/20 transition-all"
          >
            <FiHome /> Home
          </Link>
          <Link
            to="/membership"
            className="px-3 py-2 rounded-lg hover:bg-white/20 transition-all"
          >
            Membership
          </Link>
          <Link
            to="/notifications"
            className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-white/20 transition-all"
          >
            <FiBell /> Notifications
          </Link>

          {/* User Section */}
          {user ? (
            <div className="relative">
              <img
                src={user.photoURL || "/default-avatar.png"}
                alt="Profile"
                className="h-10 w-10 rounded-full cursor-pointer border-2 border-white hover:scale-110 transition-transform"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white shadow-2xl rounded-xl py-2 overflow-hidden animate-slideDown">
                  <p className="px-4 py-2 text-gray-800 font-semibold">{user.displayName || user.email}</p>
                  <hr className="my-1 border-gray-200" />
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-purple-100 transition-colors rounded-lg"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FiSettings /> Dashboard
                  </Link>
                  <button
                    className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-100 transition-colors rounded-lg"
                    onClick={handleLogout}
                  >
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="ml-4 bg-white text-purple-600 font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-purple-50 hover:scale-105 transition-transform"
            >
              Join Us
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
