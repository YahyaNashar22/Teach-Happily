import { useState } from "react";
import "../css/Dashboard.css";
import { useUserStore } from "../store";
import { Link } from "react-router-dom";
import ListCategories from "../components/ListCategories";
import ListCourses from "../components/ListCourses";
import ListTeachers from "../components/ListTeachers";
import ListProducts from "../components/ListProducts";
import ListEmails from "../components/ListEmails";
import Stats from "../components/Stats";

const Dashboard = () => {
  const { clearUser } = useUserStore();
  const [activeForm, setActiveForm] = useState("stats");

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div>
          <h2 className="dashboard-title">لوحة التحكم</h2>
          <ul className="dashboard-menu">
            <li>
              <button
                className={`dashboard-menu-item ${
                  activeForm === "stats" ? "active" : ""
                }`}
                onClick={() => setActiveForm("stats")}
              >
                الاحصائيات
              </button>
            </li>
            <li>
              <button
                className={`dashboard-menu-item ${
                  activeForm === "course" ? "active" : ""
                }`}
                onClick={() => setActiveForm("course")}
              >
                الدورات
              </button>
            </li>
            <li>
              <button
                className={`dashboard-menu-item ${
                  activeForm === "category" ? "active" : ""
                }`}
                onClick={() => setActiveForm("category")}
              >
                الفئات
              </button>
            </li>
            <li>
              <button
                className={`dashboard-menu-item ${
                  activeForm === "teacher" ? "active" : ""
                }`}
                onClick={() => setActiveForm("teacher")}
              >
                المدربون
              </button>
            </li>
            <li>
              <button
                className={`dashboard-menu-item ${
                  activeForm === "products" ? "active" : ""
                }`}
                onClick={() => setActiveForm("products")}
              >
                المنتجات الرقمية
              </button>
            </li>
            <li>
              <button
                className={`dashboard-menu-item ${
                  activeForm === "emails" ? "active" : ""
                }`}
                onClick={() => setActiveForm("emails")}
              >
                البريد الإلكتروني
              </button>
            </li>
          </ul>
        </div>
        <div className="dash-buttons">
          <Link to="/" className="dash-home-btn">
            الرئيسية
          </Link>
          <Link to="/" className="dash-logout-btn" onClick={clearUser}>
            تسجيل خروج
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        {activeForm === "category" && <ListCategories />}
        {activeForm === "teacher" && <ListTeachers />}
        {activeForm === "course" && <ListCourses />}
        {activeForm === "products" && <ListProducts />}
        {activeForm === "emails" && <ListEmails />}
        {activeForm === "stats" && <Stats />}
      </main>
    </div>
  );
};

export default Dashboard;
