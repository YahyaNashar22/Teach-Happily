import "../css/ErrorPayment.css";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const ErrorPayment = () => {
  return (
    <main className="error-payment">
      <img src={logo} width={300} alt="logo" loading="lazy" />
      <h2 className="section-sub-title">حدث خطأ في عملية الدفع</h2>
      <p className="text-grey">
        عذرًا، لم نتمكن من إتمام عملية الدفع الخاصة بك. يرجى المحاولة مرة أخرى
        أو استخدام طريقة دفع أخرى.
      </p>
      <Link to="/" className="btn error-payment-btn">
        العودة إلى الصفحة الرئيسية
      </Link>
    </main>
  );
};

export default ErrorPayment;
