import React, { useEffect, useState } from "react";
import { FiUser, FiAward, FiTrash2, FiSearch } from "react-icons/fi";
import AxiosSecure from "../../api/AxiosSecure";
import { auth } from "../../Firebase/Firebase.Config";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Wait for Firebase auth
  const waitForUser = () =>
    new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          resolve(user);
          unsubscribe();
        }
      });
    });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      await waitForUser();
      const res = await AxiosSecure.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const makeAdmin = async (uid, currentRole) => {
    try {
      if (currentRole === "admin") {
        alert("Admin cannot demote themselves!");
        return;
      }
      await AxiosSecure.patch(`/users/make-admin/${uid}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleMembership = async (uid, current) => {
    try {
      const newStatus = current === "premium" ? "free" : "premium";
      await AxiosSecure.patch(`/users/membership/${uid}`, { membership: newStatus });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (uid) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await AxiosSecure.delete(`/users/${uid}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // Filter users by search
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="text-center mt-10 text-gray-700">Loading users...</p>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Manage Users</h2>

      {/* Search */}
      <div className="mb-4 flex items-center gap-2">
        <FiSearch className="text-gray-500" />
        <input
          type="text"
          placeholder="Search by name or email"
          className="border border-gray-300 rounded-md p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredUsers.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No users found.</p>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membership</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user, index) => (
                <tr key={user.uid} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.role || "user"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.membership || "free"}</td>
                  <td className="px-6 py-4 whitespace-nowrap flex justify-center gap-2">
                    {user.role !== "admin" && (
                      <button
                        onClick={() => makeAdmin(user.uid, user.role)}
                        className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md transition"
                      >
                        <FiUser /> Admin
                      </button>
                    )}
                    <button
                      onClick={() => toggleMembership(user.uid, user.membership)}
                      className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition"
                    >
                      <FiAward /> {user.membership === "premium" ? "Free" : "Premium"}
                    </button>
                    <button
                      onClick={() => deleteUser(user.uid)}
                      className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile card view */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:hidden">
        {filteredUsers.map((user) => (
          <div key={user.uid} className="border p-4 rounded-lg shadow bg-white">
            <h3 className="font-bold text-lg">{user.name}</h3>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-700">Role: {user.role || "user"}</p>
            <p className="text-sm text-gray-700">Membership: {user.membership || "free"}</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              {user.role !== "admin" && (
                <button
                  onClick={() => makeAdmin(user.uid, user.role)}
                  className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-xs"
                >
                  <FiUser /> Admin
                </button>
              )}
              <button
                onClick={() => toggleMembership(user.uid, user.membership)}
                className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs"
              >
                <FiAward /> {user.membership === "premium" ? "Free" : "Premium"}
              </button>
              <button
                onClick={() => deleteUser(user.uid)}
                className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs"
              >
                <FiTrash2 /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageUsers;
