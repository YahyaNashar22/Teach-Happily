import { Outlet } from "react-router-dom";
import DashboardHeader from "../layouts/DashboardHeader/DashboardHeader";
import Footer from "../layouts/Footer/Footer";

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
