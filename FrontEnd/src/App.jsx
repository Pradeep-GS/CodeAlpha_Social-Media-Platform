import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout";
import FeedPage from "./Pages/FeedPage";
import MyProfilePage from "./Pages/MyProfilePage";
import Search from "./Pages/Search";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProfileUpload from "./components/ProfileUpload";
import ProfileEdit from "./components/ProfileEdit";
import UploadPost from "./Pages/UploadPost";
import OtherProfile from "./Pages/OtherProfile";
const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path: "/profile-upload",
    element: <ProfileUpload />
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "feed", element: <FeedPage /> },
      { path: "search", element: <Search /> },
      { path: "profile", element: <MyProfilePage /> },
      {path: "login", element: <Login />},
      {path:"signup",element:<Signup/>},
      {path:"profileUpload",element:<ProfileUpload/>},
      {path:"profile/edit", element: <ProfileEdit />},
      {path:"add-post", element: <UploadPost/>},
      {path:"otherprofile/:id", element:<OtherProfile/> },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
