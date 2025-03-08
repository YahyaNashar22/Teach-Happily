import "../css/NotFound.css";

import { Link } from "react-router-dom";

import logo from "../assets/logo.png";

const NotFound = () => {
  return (
    <main className="not-found">
      <img src={logo} width={300} alt="logo" loading="lazy" />
      <h2 className="section-sub-title">الصفحة غير موجودة</h2>
      <p className="text-grey">عذرًا، الصفحة التي تبحث عنها غير متاحة.</p>
      <Link to="/" className="btn">
        العودة إلى الصفحة الرئيسية
      </Link>
    </main>
  );
};

export default NotFound;
