import { Link } from "react-router-dom";
import logo from "../assets/Logo_white.png";

const Header = () => {
  return (
    <header className="wrapper-horizontal header">
      <img src={logo} alt="logo" width={120} loading="lazy" />
      <nav>
        <ul className="wrapper-horizontal">
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
