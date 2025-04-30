import "../css/Header.css";

import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useUserStore } from "../store";
import { useEffect, useState } from "react";

const Header = () => {
  const { user, clearUser } = useUserStore();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState(false);

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
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
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
            الرئيسية
          </Link>
          <Link to="/about" className="nav-link">
            عن المنصة
          </Link>
          <Link to="/courses" className="nav-link">
            الدورات
          </Link>
          <Link to="/tutors" className="nav-link">
            المدربون و المستشارون
          </Link>
          <Link to="/digital-products" className="nav-link">
            المنتجات الرقمية
          </Link>
          <div onClick={() => navigate("/contact")} className="nav-link">
            تواصل معنا
            <div className="dropdown">
              <ul>
                <li>
                  <p
                    className="nav-link secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/contact-teach-with-us");
                    }}
                  >
                    درب معنا
                  </p>
                </li>

                <li>
                  <p
                    className="nav-link secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/contact-teach-digital-product");
                    }}
                  >
                    اعرض منتجك الرقمي لدينا
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </ul>
      </nav>
      {user ? (
        user.role === "admin" ? (
          <div className="profile-dropdown">
            <div
              className="profile"
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              {user.fullName.split(" ")[0][0]}
            </div>
            {showDropdown && (
              <ul className="dropdown-menu">
                <li onClick={() => navigate("/dashboard")}> لوحة التحكم</li>
                <li onClick={() => handleLogout()}>تسجيل خروج</li>
              </ul>
            )}
          </div>
        ) : (
          <div className="profile-dropdown">
            <div
              className="profile"
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              {user.fullName.split(" ")[0][0]}
            </div>
            {showDropdown && (
              <ul className="dropdown-menu">
                <li onClick={() => navigate("/profile")}>الملف الشخصي</li>
                <li onClick={() => handleLogout()}>تسجيل خروج</li>
              </ul>
            )}
          </div>
        )
      ) : (
        <Link to="/sign-in" className="header-btn-yellow">
          تسجيل دخول
        </Link>
      )}
    </header>
  );
};

export default Header;
