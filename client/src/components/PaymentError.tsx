// components/PaymentError.jsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function PaymentError() {
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="payment-error">
      <h2>Payment Failed</h2>
      <p>{state?.error?.message || "An unknown error occurred"}</p>
      <p>You will be redirected to the homepage in 5 seconds...</p>
    </div>
  );
}
