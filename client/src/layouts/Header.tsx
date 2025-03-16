import "../css/Header.css";

import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Logo_white.png";
import { useUserStore } from "../store";
import { useEffect, useState } from "react";

const Header = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState<boolean>(false);

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
          <Link to="/contact" className="nav-link">
            تواصل معنا
            <div className="dropdown">
              <ul>
                <li>
                  <Link to="/teach-with-us" className="nav-link">
                    درب معنا
                  </Link>
                </li>
                <li>
                  <Link to="/sign-up" className="nav-link">
                    تدرب معنا
                  </Link>
                </li>
                <li>
                  <Link to="/showcase-digital-product" className="nav-link">
                    اعرض منتجك الرقمي لدينا
                  </Link>
                </li>
              </ul>
            </div>
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
        <Link to="/sign-in" className="btn-yellow">
          تسجيل دخول 
        </Link>
      )}
    </header>
  );
};

export default Header;
