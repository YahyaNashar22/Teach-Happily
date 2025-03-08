import "../css/MobileHeader.css";

import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/Logo_white.png";
import { FiMenu, FiX } from "react-icons/fi";

const MobileHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="mobile-header">
      <img src={logo} alt="logo" width={100} loading="lazy" />
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FiX size={30} /> : <FiMenu size={30} />}
      </button>

      <nav className={`mobile-nav ${menuOpen ? "open" : ""}`}>
        <ul>
          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
            الشاشة الرئيسية
          </Link>
          <Link
            to="/about"
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            معلومات عنا
          </Link>
          <Link
            to="/courses"
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            لائحة الدروس
          </Link>
          <Link
            to="/tutors"
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            مدرباتنا
          </Link>
          <Link
            to="/contact"
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            تواصل معنا
          </Link>
          <Link
            to="/sign-up"
            className="btn-yellow"
            onClick={() => setMenuOpen(false)}
          >
            انضم الآن
          </Link>
        </ul>
      </nav>
    </header>
  );
};

export default MobileHeader;
