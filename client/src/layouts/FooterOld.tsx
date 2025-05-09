import "../css/FooterOld.css";

import { Link } from "react-router-dom";

import logo from "../assets/Logo_white.png";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { ChangeEvent, FormEvent, useState } from "react";
const Footer = () => {
  const [email, setEmail] = useState<string>("");

  const newsLetter = (e: FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      alert("يرجى إدخال بريد إلكتروني صالح.");
      return;
    }
    alert("شكرا لاشتاركك!");
    setEmail("");
  };
  return (
    <footer className="footer-container">
      <div className="wrapper-footer">
        <div className="footer-col">
          <h4 className="footer-col-title">النشرات الإخبارية </h4>
          <p className="footer-col-text">
            اشترك في الإشعارات للحصول على الأخبار
          </p>
          <form className="footer-form-container">
            <button
              type="button"
              className="btn-yellow"
              id="news-letter-btn"
              onClick={newsLetter}
            >
              اشترك الان
            </button>
            <input
              type="email"
              className="news-letter"
              required
              value={email}
              placeholder="بريد إلكتروني"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </form>
          <div className="icons">
            <FaYoutube className="social-icon" />
            <FaFacebook className="social-icon" />
            <FaXTwitter className="social-icon" />
            <FaInstagram className="social-icon" />
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">تواصل معنا</h4>
          <ul>
            <li className="footer-col-text">قطر</li>
            <li className="footer-col-text" style={{ direction: "ltr" }}>
              +97450003499
            </li>
            <li className="footer-col-text" style={{ direction: "ltr" }}>
              teachhappily@outlook.com
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">روابط سريعة</h4>
          <ul>
            <li className="footer-col-text">
              <Link to="/">الرئيسية</Link>
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
            انضمي لمنصة علم بسعادة وكوني من اول المؤسسين لها
            <br /> حيث ننطلق معا لصناعة الفرق في التعليم
          </Link>
        </div>
      </div>

      <p className="copyrights">&copy; Teach Happily 2025, Powered by bepro</p>
    </footer>
  );
};

export default Footer;
