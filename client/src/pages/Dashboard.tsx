import { useState } from "react";
import "../css/Dashboard.css";
import CategoryForm from "../components/CategoryForm";
import CourseForm from "../components/CourseForm";
import TeacherForm from "../components/TeacherForm";
import { useUserStore } from "../store";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { clearUser } = useUserStore();
  const [activeForm, setActiveForm] = useState("category");

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
                  activeForm === "category" ? "active" : ""
                }`}
                onClick={() => setActiveForm("category")}
              >
                الخانات
              </button>
            </li>
            <li>
              <button
                className={`dashboard-menu-item ${
                  activeForm === "teacher" ? "active" : ""
                }`}
                onClick={() => setActiveForm("teacher")}
              >
                المدربات
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
          </ul>
        </div>
        <div className="dash-buttons">
          <Link to="/" className="dash-home-btn">
            الرئيسية
          </Link>
          <button className="dash-logout-btn btn" onClick={clearUser}>
            تسجيل خروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        {activeForm === "category" && <CategoryForm />}
        {activeForm === "teacher" && <TeacherForm />}
        {activeForm === "course" && <CourseForm />}
      </main>
    </div>
  );
};

export default Dashboard;
