import React from "react";
import { Link, Outlet } from "react-router-dom";
import { FiUser, FiPlusCircle, FiFileText, FiLogOut } from "react-icons/fi";

const UserDashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-purple-700 to-purple-900 text-white flex flex-col p-6">
        {/* Logo / Title */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-purple-700 font-bold text-lg">
            U
          </div>
          <h2 className="text-2xl font-bold tracking-wide">User Dashboard</h2>
        </div>

        {/* Profile Preview */}
        <div className="flex items-center gap-3 mb-8 p-3 bg-purple-800 rounded-lg shadow-md">
          <img
            src="https://i.pravatar.cc/40"
            alt="User Avatar"
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <div>
            <p className="font-semibold">John Doe</p>
            <p className="text-sm text-purple-300">Premium User</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-3">
          <Link
            to="profile"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-500 transition-all duration-300 shadow-sm"
          >
            <FiUser className="text-lg" /> My Profile
          </Link>
          <Link
            to="add-post"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-500 transition-all duration-300 shadow-sm"
          >
            <FiPlusCircle className="text-lg" /> Add Post
          </Link>
          <Link
            to="my-posts"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-500 transition-all duration-300 shadow-sm"
          >
            <FiFileText className="text-lg" /> My Posts
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="mt-auto">
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-red-500 transition-all duration-300 shadow-sm bg-red-600 text-white">
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 min-h-[80vh]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserDashboardLayout;
