import "../css/Header.css";

import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Logo_white.png";
import { useUserStore } from "../store";

const Header = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();
  return (
    <header className="header">
      <img
        src={logo}
        alt="logo"
        width={120}
        loading="lazy"
        onClick={() => navigate("/")}
      />
      <nav>
        <ul className="nav-links">
          <Link to="/" className="nav-link">
            الشاشة الرئيسية
          </Link>
          <Link to="/about" className="nav-link">
            معلومات عنا
          </Link>
          <Link to="/courses" className="nav-link">
           الدورات
          </Link>
          <Link to="/tutors" className="nav-link">
            مدرباتنا
          </Link>
          <Link to="/contact" className="nav-link">
            تواصل معنا
          </Link>
        </ul>
      </nav>
      {user ? (
        user.role === "admin" ? (
          <Link to="/dashboard" className="profile">
            {user.fullName.split(" ")[0][0]}
          </Link>
        ) : (
          <Link to="/profile" className="profile">
            {user.fullName.split(" ")[0][0]}
          </Link>
        )
      ) : (
        <Link to="/sign-up" className="btn-yellow">
          انضم الآن
        </Link>
      )}
    </header>
  );
};

export default Header;
