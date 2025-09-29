import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../../Layout/RootLayout";
import Home from "../../Pages/Home";
import Errorpage from "../../components/Shared/Errorpage";
import Login from "../../components/authComponents/Login";
import Register from "../../components/authComponents/Register";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    errorElement: <Errorpage />, // must match import
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path:"/register",
        Component : Register 
      },
      {
        path: "*", // catch-all route
        Component: Errorpage,
      },
    ],
  },
]);

export default router;
