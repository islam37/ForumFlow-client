import { Outlet, NavLink } from "react-router-dom";

const AdminDashboardLayout = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 min-h-screen bg-gray-100 p-6 border-r">
        <h2 className="font-bold text-xl mb-6">Admin Dashboard</h2>
        <nav className="flex flex-col gap-3">
          <NavLink to="/dashboard/profile" className="hover:text-purple-600">My Profile</NavLink>
          <NavLink to="/dashboard/add-post" className="hover:text-purple-600">Add Post</NavLink>
          <NavLink to="/dashboard/my-posts" className="hover:text-purple-600">My Posts</NavLink>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboardLayout;
