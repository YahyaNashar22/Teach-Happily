import "../css/Header.css";

import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Logo_white.png";

const Header = () => {
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
            لائحة الدروس
          </Link>
          <Link to="/tutors" className="nav-link">
            مدرباتنا
          </Link>
          <Link to="/contact" className="nav-link">
            تواصل معنا
          </Link>
        </ul>
      </nav>
      <Link to="/sign-up" className="btn-yellow">
        انضم الآن
      </Link>
    </header>
  );
};

export default Header;
