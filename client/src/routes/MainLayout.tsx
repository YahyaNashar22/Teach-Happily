import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../layouts/Header";
import MobileHeader from "../layouts/MobileHeader";
import Footer from "../layouts/Footer";

const Container = () => {
  const [isMobile, setIsMobile] = useState(false);

  const checkMobileView = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    checkMobileView(); // Check screen size on mount
    window.addEventListener("resize", checkMobileView); // Update on window resize

    return () => {
      window.removeEventListener("resize", checkMobileView); // Cleanup
    };
  }, []);

  return (
    <>
      {isMobile ? <MobileHeader /> : <Header />}
      <Outlet />
      <Footer />
    </>
  );
};

export default Container;
