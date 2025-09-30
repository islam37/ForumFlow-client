import React, { useState, useEffect, useContext } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FiUser,
  FiPlusCircle,
  FiFileText,
  FiMenu,
  FiX,
  FiLogOut,
} from "react-icons/fi";
import { AuthContext } from "../components/authComponents/AuthContext";
import Axios from "../api/Axios";

const UserDashboardLayout = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
  });

  const isActiveLink = (path) => location.pathname.includes(path);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.email) return;
      try {
        const res = await Axios.get(`/dashboard/stats?email=${user.email}`);
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      }
    };
    fetchStats();
  }, [user?.email]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-all duration-300"
      >
        {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-purple-600 to-purple-800 text-white transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 flex flex-col shadow-2xl`}
      >
        {/* Header */}
        <div className="p-6 border-b border-purple-500/30">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            User Dashboard
          </h2>
          <p className="text-purple-200 text-sm mt-1">Welcome back!</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 flex flex-col gap-2">
          <Link
            to="profile"
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group ${
              isActiveLink("profile")
                ? "bg-white text-purple-600 shadow-lg transform scale-105"
                : "hover:bg-purple-500/50 hover:translate-x-1"
            }`}
          >
            <FiUser
              size={20}
              className={`transition-transform duration-300 ${
                isActiveLink("profile") ? "scale-110" : "group-hover:scale-110"
              }`}
            />
            <span className="font-medium">My Profile</span>
          </Link>

          <Link
            to="add-post"
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group ${
              isActiveLink("add-post")
                ? "bg-white text-purple-600 shadow-lg transform scale-105"
                : "hover:bg-purple-500/50 hover:translate-x-1"
            }`}
          >
            <FiPlusCircle
              size={20}
              className={`transition-transform duration-300 ${
                isActiveLink("add-post") ? "scale-110" : "group-hover:scale-110"
              }`}
            />
            <span className="font-medium">Add Post</span>
          </Link>

          <Link
            to="my-posts"
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group ${
              isActiveLink("my-posts")
                ? "bg-white text-purple-600 shadow-lg transform scale-105"
                : "hover:bg-purple-500/50 hover:translate-x-1"
            }`}
          >
            <FiFileText
              size={20}
              className={`transition-transform duration-300 ${
                isActiveLink("my-posts") ? "scale-110" : "group-hover:scale-110"
              }`}
            />
            <span className="font-medium">My Posts</span>
          </Link>
        </nav>

        {/* Footer */}
       
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen p-6 lg:p-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome, {user?.name || "User"}
            </h1>
            <p className="text-gray-600">
              Manage your profile and content in one place
            </p>
          </div>

          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Total Posts</p>
                  <p className="text-2xl font-bold mt-1">{stats.totalPosts}</p>
                </div>
                <FiFileText size={24} className="text-purple-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm">Draft Posts</p>
                  <p className="text-2xl font-bold mt-1">{stats.draftPosts}</p>
                </div>
                <FiFileText size={24} className="text-blue-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 text-sm">Published</p>
                  <p className="text-2xl font-bold mt-1">
                    {stats.publishedPosts}
                  </p>
                </div>
                <FiFileText size={24} className="text-green-200" />
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden mt-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboardLayout;
