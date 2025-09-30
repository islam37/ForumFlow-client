import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../authComponents/AuthContext";
import { FiHome, FiBell, FiSettings, FiLogOut, FiUser } from "react-icons/fi";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  const handleLogout = async () => {
    try {
      await logOut();
      setDropdownOpen(false);
      navigate("/login");
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleProfileClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo + Website Name */}
        <Link 
          to="/" 
          className="flex items-center gap-3 font-extrabold text-white text-2xl hover:scale-105 transition-transform duration-200"
        >
          <img 
            src="/src/assets/images/Logo.png" 
            alt="ForumFlow Logo" 
            className="h-10 w-10 rounded-full border-2 border-white object-cover"
            onError={(e) => {
              e.target.src = "/default-avatar.png";
            }}
          />
          ForumFlow
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6 text-white font-medium">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-200"
          >
            <FiHome className="text-lg" />
            <span>Home</span>
          </Link>
          <Link
            to="/membership"
            className="px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-200"
          >
            Membership
          </Link>
          <Link
            to="/notifications"
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-200 relative"
          >
            <FiBell className="text-lg" />
            <span>Notifications</span>
            {/* Optional: Notification badge */}
            {/* <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span> */}
          </Link>
          {/* User Section */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              {/* Profile Picture */}
              <div
                className="relative cursor-pointer group"
                onClick={handleProfileClick}
              >
                <img
                  src={user.photoURL || "/default-avatar.png"}
                  alt="Profile"
                  className="h-10 w-10 rounded-full border-2 border-white hover:scale-110 transition-transform duration-200 object-cover"
                  onError={(e) => {
                    e.target.src = "/default-avatar.png";
                  }}
                />
                {/* Hover effect ring */}
                <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-white/50 transition-all duration-200"></div>
              </div>
              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white shadow-2xl rounded-xl py-3 overflow-hidden border border-gray-100 animate-slideDown">
                  {/* User Info (non-clickable) */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <img
                        src={user.photoURL || "/default-avatar.png"}
                        alt="Profile"
                        className="h-10 w-10 rounded-full border border-gray-200 object-cover"
                        onError={(e) => {
                          e.target.src = "/default-avatar.png";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-800 font-semibold truncate">
                          {user.displayName || "User"}
                        </p>
                        <p className="text-gray-500 text-sm truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Dropdown Items */}
                  <div className="py-2">
                   
                    
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 transition-colors duration-200"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FiSettings className="text-gray-500" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200"
                      onClick={handleLogout}
                    >
                      <FiLogOut />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
                          )}
            </div>
          ) : (

            <Link
              to="/login"
              className="ml-4 bg-white text-purple-600 font-semibold px-6 py-2.5 rounded-lg shadow-md hover:bg-purple-50 hover:scale-105 transition-all duration-200 transform"
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