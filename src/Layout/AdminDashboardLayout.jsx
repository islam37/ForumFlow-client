import { Outlet, NavLink } from "react-router-dom";

const AdminDashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 min-h-screen bg-purple-700 text-white flex flex-col p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-8 text-center">Admin Panel</h2>
        <nav className="flex flex-col gap-3">
          <NavLink
            to="/admin-dashboard/admin-profile"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg transition-colors ${
                isActive ? "bg-purple-500 font-semibold" : "hover:bg-purple-600"
              }`
            }
          >
            My Profile
          </NavLink>
          <NavLink
            to="/admin-dashboard/manageUser"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg transition-colors ${
                isActive ? "bg-purple-500 font-semibold" : "hover:bg-purple-600"
              }`
            }
          >
            Manage Users
          </NavLink>
          <NavLink
            to="/admin-dashboard/announcement"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg transition-colors ${
                isActive ? "bg-purple-500 font-semibold" : "hover:bg-purple-600"
              }`
            }
          >
            Make Announcement
          </NavLink>
          <NavLink
            to="/admin-dashboard/reported-activities"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg transition-colors ${
                isActive ? "bg-purple-500 font-semibold" : "hover:bg-purple-600"
              }`
            }
          >
            Reported Activities
          </NavLink>
        </nav>

       
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboardLayout;
