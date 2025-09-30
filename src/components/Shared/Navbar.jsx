import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../authComponents/AuthContext";
import { FiHome, FiBell, FiSettings, FiLogOut } from "react-icons/fi";

const Navbar = () => {
  const { user, role, logOut } = useContext(AuthContext); 
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <Link
          to="/"
          className="flex items-center gap-3 font-extrabold text-white text-2xl hover:scale-105 transition-transform duration-200"
        >
          <img
            src="https://i.ibb.co.com/1JbLzMmB/Logo.png"
            alt="ForumFlow Logo"
            className="h-10 w-10 rounded-full border-2 border-white object-cover"
            onError={(e) => (e.target.src = "/default-avatar.png")}
          />
          ForumFlow
        </Link>

        <div className="flex items-center gap-6 text-white font-medium">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-200"
          >
            <FiHome className="text-lg" /> Home
          </Link>

          <Link to="/announcementsforuser" className="px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-200">
            Announcements
          </Link>

          <Link
            to="/membership"
            className="px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-200"
          >
            Membership
          </Link>

          <Link
            to="/notifications"
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-200"
          >
            <FiBell className="text-lg" /> Notifications
          </Link>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <div className="relative cursor-pointer group" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <img
                  src={user.photoURL || "/default-avatar.png"}
                  alt="Profile"
                  className="h-10 w-10 rounded-full border-2 border-white hover:scale-110 transition-transform duration-200 object-cover"
                />
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white shadow-2xl rounded-xl py-3 overflow-hidden border border-gray-100 animate-slideDown">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <img
                        src={user.photoURL || "/default-avatar.png"}
                        alt="Profile"
                        className="h-10 w-10 rounded-full border border-gray-200 object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-800 font-semibold truncate">
                          {user.displayName || "User"}
                        </p>
                        <p className="text-gray-500 text-sm truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    {/* Conditional Dashboard */}
                    {role === "admin" ? (
                      <Link to="/admin-dashboard">
                        <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                          <FiSettings className="text-gray-500" />
                          Admin Dashboard
                        </button>
                      </Link>
                    ) : (
                      <Link to="/dashboard">
                        <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                          <FiSettings className="text-gray-500" />
                          Dashboard
                        </button>
                      </Link>
                    )}

                    {/* Logout button */}
                    <button
                      className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200"
                      onClick={handleLogout}
                    >
                      <FiLogOut />
                      Logout
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
