import "../css/Footer.css";

import { ChangeEvent, FormEvent, useState } from "react";
import { Link } from "react-router-dom";

import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import logo from "../assets/Logo_white.png";

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
    <footer>
      <div className="footer-upper">
        <div className="footer-upper-column">
          <div className="footer-newsletter-container">
            <p className="footer-newsletter-container-text">
              اشترك في الإشعارات للحصول على الأخبار
            </p>
            <form className="footer-newsletter-container-form-container">
              <button
                type="button"
                className="footer-newsletter-container-form-btn"
                id="news-letter-btn"
                onClick={newsLetter}
              >
                اشترك الان
              </button>
              <input
                type="email"
                className="footer-newsletter-container-form-input"
                required
                value={email}
                placeholder="بريد إلكتروني"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
              />
            </form>
          </div>
        </div>
        <div className="footer-upper-column">
          <div className="footer-welcome-container">
            <p className="footer-welcome-container-text">
              أهلا بكم في <span>علم بسعادة</span>
            </p>
            <p className="footer-welcome-container-desc">
              انضمي لمنصة علم بسعادة وكوني من اول المؤسسين لها حيث ننطلق معا
              لصناعة الفرق في التعليم
            </p>
            <div className="footer-welcome-container-icons">
              <FaFacebook className="social-icon" />
              <FaXTwitter className="social-icon" />
              <FaInstagram className="social-icon" />
            </div>
          </div>
        </div>
        <div className="footer-upper-column">
          <div className="footer-links-container">
            <p className="footer-links-container-text">روابط سريعة</p>
            <ul>
              <li className="footer-links-container-link">
                <Link to="/">الرئيسية</Link>
              </li>
              <li className="footer-links-container-link">
                <Link to="/about">معلومات عنا</Link>
              </li>
              <li className="footer-links-container-link">
                <Link to="/courses">لائحة الدروس</Link>
              </li>
              <li className="footer-links-container-link">
                <Link to="/tutors">مدرباتنا</Link>
              </li>
              <li className="footer-links-container-link">
                <Link to="/contact">تواصل معنا</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-upper-column">
          <div className="footer-logo-container">
            <img src={logo} alt="logo" width={120} loading="lazy" />
            <ul>
              <li
                className="footer-logo-container-text"
                style={{ direction: "ltr" }}
              >
                +974 5 000 3 499
              </li>
              <li
                className="footer-logo-container-text"
                style={{ direction: "ltr" }}
              >
                teachhappily@outlook.com
              </li>
              <li className="footer-logo-container-text">Qatar</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-lower">
        <p className="footer-copyrights">© Copyright 2025</p>
      </div>
    </footer>
  );
};

export default Footer;
