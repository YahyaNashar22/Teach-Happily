import "../css/ErrorPayment.css";
import { Link, useSearchParams } from "react-router-dom";
import logo from "../assets/logo.png";
import { useEffect, useState } from "react";
import axios from "axios";

const ErrorPayment = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("paymentId");

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (paymentId) {
      axios
        .post(`${backend}/api/payments/status`, { paymentId })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [backend, paymentId]);

  if (loading) {
    return (
      <main className="payment-callback">
        <img src={logo} width={200} alt="logo" />
        <p className="text-grey">جاري التحقق من عملية الدفع...</p>
      </main>
    );
  }

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
