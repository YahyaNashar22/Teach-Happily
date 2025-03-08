import { Outlet } from "react-router-dom";
import DashboardHeader from "../layouts/DashboardHeader";
import Footer from "../layouts/Footer";

const DashboardLayout = () => {
  return (
    <>
      <DashboardHeader />
      <Outlet />
      <Footer />
    </>
  );
};

export default DashboardLayout;
