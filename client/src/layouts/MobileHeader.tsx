import "../css/MobileHeader.css";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Logo_white.png";
import { FiMenu, FiX } from "react-icons/fi";
import { useUserStore } from "../store";

const MobileHeader = () => {
  const { user, clearUser } = useUserStore();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  const handleLogout = () => {
    clearUser();
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 180) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`mobile-header ${isScrolled || menuOpen ? "scrolled" : ""}`}
    >
      <img src={logo} alt="logo" width={100} loading="lazy" />
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FiX size={30} /> : <FiMenu size={30} />}
      </button>

      <nav className={`mobile-nav ${menuOpen ? "open" : ""}`}>
        <ul>
          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
            الرئيسية
          </Link>
          <Link
            to="/about"
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            عن المنصة
          </Link>
          <Link
            to="/courses"
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            الدورات
          </Link>
          <Link
            to="/tutors"
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            المدربون و المستشارون
          </Link>
          <Link to="/digital-products" className="nav-link">
            المنتجات الرقمية
          </Link>
          <Link
            to="/contact"
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            تواصل معنا
          </Link>

          <Link
            to="/contact-teach-with-us"
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            درب معنا
          </Link>

          <Link
            to="/contact-teach-digital-product"
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            اعرض منتجك الرقمي لدينا
          </Link>

          {user && <li  className="nav-link" onClick={() => handleLogout()}>تسجيل خروج</li>}

          {user ? (
            user.role === "admin" ? (
              <Link to="/dashboard" className="mob-profile">
                {user.fullName.split(" ")[0][0]}
              </Link>
            ) : (
              <Link to="/profile" className="mob-profile">
                {user.fullName.split(" ")[0][0]}
              </Link>
            )
          ) : (
            <Link
              to="/sign-in"
              className="btn-yellow"
              onClick={() => setMenuOpen(false)}
            >
              تسجيل دخول
            </Link>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MobileHeader;
