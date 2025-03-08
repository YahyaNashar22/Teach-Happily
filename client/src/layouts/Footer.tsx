import { Link } from "react-router-dom";

import logo from "../assets/Logo_white.png";
const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="wrapper-footer">
        <div className="footer-col">
          <h4 className="footer-col-title">النشرات الإخبارية </h4>
          <p className="footer-col-text">
            اشترك في الإشعارات للحصول على الأخبار
          </p>
          <form className="horizontal-wrapper">
            <button className="btn-yellow" id="news-letter-btn">
              تسجيل دخول
            </button>
            <input
              type="email"
              className="news-letter"
              required
              placeholder="بريد إلكتروني"
            />
          </form>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">تواصل معنا</h4>
          <ul>
            <li className="footer-col-text">قطر</li>
            <li className="footer-col-text">(316) 555-0116</li>
            <li className="footer-col-text">onlineschool@email.com</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">روابط سريعة</h4>
          <ul>
            <li className="footer-col-text">
              <Link to="/">الشاشة الرئيسية</Link>
            </li>
            <li className="footer-col-text">
              <Link to="/about">معلومات عنا</Link>
            </li>
            <li className="footer-col-text">
              <Link to="/courses">لائحة الدروس</Link>
            </li>
            <li className="footer-col-text">
              <Link to="/tutors">مدرباتنا</Link>
            </li>
            <li className="footer-col-text">
              <Link to="/contact">تواصل معنا</Link>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <img src={logo} alt="logo" width={120} loading="lazy" />
          <Link to="/about" className="footer-col-text">
            هناك بعض المزايا التي تتمتع بها مدرستنا. <br />
            اقرأ هذا النص وستكتشف لماذا يجب عليك الانضمام إلينا.
          </Link>
        </div>
      </div>

      <p className="copyrights">&copy; Teach Happily 2025, Powered by bepro</p>
    </footer>
  );
};

export default Footer;
