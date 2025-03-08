import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import Loading from "../components/Loading.tsx";
import MainLayout from "./MainLayout.tsx";
import DashboardLayout from "./DashboardLayout.tsx";

const NotFound = lazy(() => import("../pages/NotFound.tsx"));

const HomePage = lazy(() => import("../pages/HomePage.tsx"));
const AboutPage = lazy(() => import("../pages/AboutPage.tsx"));
const ContactPage = lazy(() => import("../pages/ContactPage.tsx"));
const CoursesPage = lazy(() => import("../pages/CoursesPage.tsx"));
const ForgotPasswordPage = lazy(
  () => import("../pages/ForgotPasswordPage.tsx")
);
const SigninPage = lazy(() => import("../pages/SigninPage.tsx"));
const SignupPage = lazy(() => import("../pages/SignupPage.tsx"));
const TutorsPage = lazy(() => import("../pages/TutorsPage.tsx"));
const CoursePage = lazy(() => import("../pages/CoursePage.tsx"));


const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Main Layout Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/tutors" element={<TutorsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/course/:slug" element={<CoursePage />} />
        </Route>

        {/* Sign in/up routes */}
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/sign-in" element={<SigninPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* protected routes */}
        <Route path="/dashboard" element={<DashboardLayout />}></Route>

        {/* Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
