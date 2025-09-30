import { createBrowserRouter, Navigate } from "react-router-dom";

// Layouts
import RootLayout from "../../Layout/RootLayout";
import UserDashboardLayout from "../../Layout/UserDashboardLayout";


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


// Dashboard - User
import MyProfile from "../../User/MyProfile";
import AddPost from "../../User/AddPost";
import MyPost from "../../User/MyPost";
import AdminDashboardLayout from "../../Layout/AdminDashboardLayout";
import AdminProfile from "../../Pages/Admin/AdminProfile";
import ManageUsers from "../../Pages/Admin/ManageUsers";
import MakeAnuncement from "../../Pages/Admin/MakeAnnouncement";
import ReportedActivities from "../../Pages/Admin/ReportedActivities";
import Announcements from "../../Pages/AnnouncementforUser/Announcements";


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <Errorpage />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      {path: 'announcementsforuser',element:<Announcements></Announcements>},
     
      { path: "post/:id", element: <PostDetails /> },
      {
        path: "membership",
        element: (
          <PrivateRoute requiredRole="user">
            <Membership />
          </PrivateRoute>
        ),
      },
      { path: "*", element: <Errorpage /> },
      // Protecting user dashboard routes
      {
        path: "dashboard",
        element: <UserDashboardLayout />,
        children: [
          { path: "profile", element: <MyProfile /> },
          { path: "add-post", element: <AddPost /> },
          { path: "my-posts", element: <MyPost /> },
        ]
      },
      // Protecting admin dashboard routes
      
      
      {
        path: "admin-dashboard",
        element: <AdminDashboardLayout />,
        children: [
          { path: "admin-profile", element : <AdminProfile></AdminProfile> },
          { path: "manageUser", element: <ManageUsers></ManageUsers> },
          { path: "announcement", element: <MakeAnuncement></MakeAnuncement>},
          { path: "reported-activities", element: <ReportedActivities></ReportedActivities> },
          
        ]
      }
    ],
  },
]);

export default router;
