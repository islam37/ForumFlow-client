import { createBrowserRouter } from "react-router-dom";

// Layouts
import RootLayout from "../../Layout/RootLayout";
import UserDashboardLayout from "../../Layout/UserDashboardLayout";
import AdminDashboardLayout from "../../Layout/AdminDashboardLayout";

// Pages
import Home from "../../Pages/Home";
import PostDetails from "../../Pages/PostDetails";
import Membership from "../../Pages/MemberShip";

// Auth
import Login from "../../components/authComponents/Login";
import Register from "../../components/authComponents/Register";
import PrivateRoute from "../../components/authComponents/PrivateRoute";

// Shared
import Errorpage from "../../components/Shared/Errorpage";
import Profile from "../../components/Shared/Profile";

// Dashboard - User
import MyProfile from "../../User/MyProfile";
import AddPost from "../../User/AddPost";
import MyPost from "../../User/MyPost";

// Dashboard - Admin
import AdminProfile from "../../Pages/Admin/AdminProfile";
import ManageUsers from "../../Pages/Admin/ManageUsers";

import MakeAnnouncement from "../../Pages/Admin/AdminMakeAnnouncement";

const router = createBrowserRouter([
  // Root (Public + Private routes inside)
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <Errorpage />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "profile", element: <Profile /> },
      { path: "post/:id", element: <PostDetails /> },
      {
        path: "membership",
        element: (
          <PrivateRoute>
            <Membership />
          </PrivateRoute>
        ),
      },
      { path: "*", element: <Errorpage /> }, // catch-all
    ],
  },

  // User Dashboard (Private)
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <UserDashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { path: "profile", element: <MyProfile /> },
      { path: "add-post", element: <AddPost /> },
      { path: "my-posts", element: <MyPost /> },
    ],
  },

  // Admin Dashboard (Private with role check)
  {
    path: "/admin",
    element: (
      <PrivateRoute requiredRole="admin">
        <AdminDashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { path: "profile", element: <AdminProfile /> },
      { path: "manage-users", element: <ManageUsers /> },
     
      { path: "announcement", element: <MakeAnnouncement /> },
    ],
  },
]);

export default router;
