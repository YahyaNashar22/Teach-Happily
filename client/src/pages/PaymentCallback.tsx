// PaymentCallback.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const backend = import.meta.env.VITE_BACKEND_URL;

export default function PaymentCallback() {
  const [status, setStatus] = useState<"pending" | "success" | "failed">(
    "pending"
  );
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Restore stored payment data
        const saved = localStorage.getItem("paymentData");
        if (!saved) throw new Error("No payment data found");

        const paymentData = JSON.parse(saved);

        // Get payment key (InvoiceId) from query params
        const urlParams = new URLSearchParams(window.location.search);
        const paymentKey = urlParams.get("paymentId"); // MyFatoorah returns `paymentId`

        if (!paymentKey) throw new Error("No paymentId in callback");

        // Verify with backend
        const verifyRes = await axios.post(
          `${backend}/user/finalize-payment-enroll`,
          {
            paymentKey,
            ...paymentData,
          }
        );

        if (verifyRes.data.payment?.status === "Paid") {
          setStatus("success");
          localStorage.removeItem("paymentData");
          setTimeout(() => navigate("/dashboard"), 3000);
        } else {
          setStatus("failed");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("failed");
      }
    };

    verifyPayment();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {status === "pending" && <p>جاري التحقق من الدفع...</p>}
      {status === "success" && (
        <p className="text-green-600">✅ تم الدفع بنجاح! سيتم توجيهك...</p>
      )}
      {status === "failed" && (
        <p className="text-red-600">❌ فشل التحقق من الدفع.</p>
      )}
    </div>
  );
}
