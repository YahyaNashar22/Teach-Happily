// PaymentCallbackHandler.jsx
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentCallbackHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const completePayment = async () => {
      const query = new URLSearchParams(window.location.search);
      const paymentId = query.get("paymentId");
      const paymentData = JSON.parse(
        localStorage.getItem("paymentData") || "{}"
      );

      if (!paymentId || !paymentData.userId) {
        return navigate("/payment-error");
      }

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND}/user/finalize-payment-enroll`,
          {
            paymentKey: paymentId,
            userId: paymentData.userId,
            itemId: paymentData.itemId,
            itemType: paymentData.itemType,
          }
        );

        localStorage.removeItem("paymentData");
        navigate("/payment-success", { state: response.data });
      } catch (error) {
        navigate("/payment-error", { state: { error } });
      }
    };

    completePayment();
  }, [navigate]);

  return <div>Processing payment...</div>;
}
