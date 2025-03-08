import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import Loading from "../components/Loading.tsx";
import MainLayout from "./MainLayout.tsx";
import DashboardLayout from "./DashboardLayout.tsx";

const NotFound = lazy(() => import("../pages/NotFound.tsx"));
const HomePage = lazy(() => import("../pages/HomePage.tsx"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Main Layout Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        {/* protected routes */}
        <Route path="/dashboard" element={<DashboardLayout />}></Route>

        {/* Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
