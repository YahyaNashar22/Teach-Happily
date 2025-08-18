import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import Loading from "../components/Loading.tsx";
import MainLayout from "./MainLayout.tsx";
import { useUserStore } from "../store.ts";

const NotFound = lazy(() => import("../pages/NotFound.tsx"));

const HomePage = lazy(() => import("../pages/HomePage.tsx"));
const AboutPage = lazy(() => import("../pages/AboutPage.tsx"));
const ContactPage = lazy(() => import("../pages/ContactPage.tsx"));
const ContactPageTeachWithUs = lazy(
  () => import("../pages/ContactPageTeachWithUs.tsx")
);
const ContactPageDigitalProduct = lazy(
  () => import("../pages/ContactPageDigitalProduct.tsx")
);

const CoursesPage = lazy(() => import("../pages/CoursesPage.tsx"));
const DigitalProductPage = lazy(
  () => import("../pages/DigitalProductPage.tsx")
);

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

const CourseShowCase = lazy(() => import("../pages/CourseShowCase.tsx"));
const TeacherShowCase = lazy(() => import("../pages/TeacherShowCase.tsx"));

const PaymentCallback = lazy(() => import("../pages/PaymentCallback.tsx"));

const AppRoutes = () => {
  const { user } = useUserStore();
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Main Layout Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/digital-products" element={<DigitalProductPage />} />

          <Route path="/tutors" element={<TutorsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="/contact-teach-with-us"
            element={<ContactPageTeachWithUs />}
          />
          <Route
            path="/contact-teach-digital-product"
            element={<ContactPageDigitalProduct />}
          />

          <Route path="/course/:slug" element={<CoursePage />} />
          <Route path="/course-showcase/:slug" element={<CourseShowCase />} />
          <Route path="/teacher-showcase/:id" element={<TeacherShowCase />} />

          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/teach-with-us" element={<TeachWithUs />} />
          
          <Route path="/payment-callback" element={<PaymentCallback />} />

        </Route>

        {/* Sign in/up routes */}
        {!user && (
          <>
            <Route path="/sign-up" element={<SignupPage />} />
            <Route path="/sign-in" element={<SigninPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </>
        )}

        {/* protected routes */}
        {(user?.role === "teacher" || user?.role === "admin") && (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
          </>
        )}

        {/* Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
