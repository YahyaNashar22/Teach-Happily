import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "../css/PaymentCallback.css";

export default function PaymentCallback() {
  const backend = import.meta.env.VITE_BACKEND;
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("paymentId");

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (paymentId) {
      axios.post(`${backend}/api/payments/status`, { paymentId }).finally(() => {
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
    <main className="payment-callback">
      <img src={logo} width={200} alt="logo" />
      <h2 className="section-sub-title">تم الدفع بنجاح 🎉</h2>
      <p className="text-grey">
        شكراً لك! لقد تمت معالجة عملية الدفع الخاصة بك بنجاح.
      </p>
      <Link to="/" className="btn payment-btn">
        العودة إلى الصفحة الرئيسية
      </Link>
    </main>
  );
}
