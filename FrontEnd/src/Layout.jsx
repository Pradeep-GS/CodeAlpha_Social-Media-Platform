import { Outlet } from "react-router-dom";
import TopNavbar from "./components/TopNavbar";
import MainNavbar from "./components/MainNavbar";

const Layout = () => {
  return (
    <>
      <TopNavbar />
      <Outlet />
      <MainNavbar />
    </>
  );
};

export default Layout;