import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import Loading from "../components/Loading.tsx";
import MainLayout from "./MainLayout.tsx";

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
const ProfilePage = lazy(() => import("../pages/ProfilePage.tsx"));
const Dashboard = lazy(() => import("../pages/Dashboard.tsx"));

const TeachWithUs = lazy(() => import("../pages/TeachWithUs.tsx"));
const ShowCaseDigitalProduct = lazy(
  () => import("../pages/ShowCaseDigitalProduct.tsx")
);

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
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/teach-with-us" element={<TeachWithUs />} />
          <Route
            path="/showcase-digital-product"
            element={<ShowCaseDigitalProduct />}
          />
        </Route>

        {/* Sign in/up routes */}
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/sign-in" element={<SigninPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* protected routes */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
