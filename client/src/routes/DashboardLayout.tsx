import { Outlet, useNavigate } from "react-router-dom";
import Footer from "../layouts/Footer";
import { useUserStore } from "../store";
import { useEffect } from "react";

const DashboardLayout = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);
  return (
    <>
      <Outlet />
      <Footer />
    </>
  );
};

export default DashboardLayout;
