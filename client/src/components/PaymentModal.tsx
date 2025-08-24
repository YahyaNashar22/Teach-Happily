/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

interface PaymentItem {
  _id: string;
  title: string;
  price: number;
  image: string;
  teacher?: { fullname: string };
}

interface User {
  fullName: string;
  email: string;
  userId: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: PaymentItem;
  itemType: "course" | "product";
  user: User | null;
  onSuccess?: (data: any) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  item,
  itemType,
  user,
  onSuccess,
}) => {
  const backend = import.meta.env.VITE_BACKEND;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [otpIframe, setOtpIframe] = useState("");
  const embeddedContainerRef = useRef<HTMLDivElement | null>(null);

  // HACK: not sure if this is necessary
  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (event.data.sender !== "MF-3DSecure") return;
      console.log("event data: ", event.data);
      try {
        const message = JSON.parse(event.data);
        if (message.sender === "MF-3DSecure") {
          const url = message.url;
          console.log("3DSecure redirect URL:", url);

          // extract paymentId from redirect URL
          const params = new URL(url).searchParams;
          const paymentId = params.get("paymentId");

          if (paymentId) {
            // confirm payment with backend
            axios
              .post(`${backend}/api/payments/status`, { paymentId })
              .then((res) => {
                if (res.data.success) {
                  setSuccess(true);
                  if (onSuccess) onSuccess(res.data);
                } else {
                  setError(res.data.message || "فشل الدفع");
                }
                setOtpIframe("");
              })
              .catch((err) => {
                console.error(err);
                setError("فشل التحقق من الدفع");
                setOtpIframe("");
              });
          }
        }
      } catch (err) {
        console.error("3DSecure listener error", err);
      }
    };

    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [backend, onSuccess]);

  useEffect(() => {
    if (!isOpen) return;

    const startPayment = async () => {
      setLoading(true);
      setError("");
      try {
        // 1. Initiate session from backend
        const sessionRes = await axios.post(
          `${backend}/api/payments/initiate-session`
        );
        const { SessionId, CountryCode } = sessionRes.data.Data;

        if (!SessionId || !CountryCode) {
          throw new Error("فشل في بدء جلسة الدفع");
        }

        // 2. Load MyFatoorah script
        await loadMyFatoorahScript();

        // Clear old form if re-opened
        if (embeddedContainerRef.current) {
          embeddedContainerRef.current.innerHTML = "";
        }

        // 3. Init embedded form
        (window as any).myfatoorah.init({
          sessionId: SessionId,
          countryCode: CountryCode,
          currencyCode: "QAR",
          amount: item.price.toFixed(2),
          customerEmail: user?.email,
          customerMobile: "", // optional
          customerName: user?.fullName,
          language: "ar", // or "en"
          containerId: "embedded-payment",
          paymentOptions: ["Card", "ApplePay"],
          callback: async (response: any) => {
            setLoading(false);

            if (response?.isSuccess) {
              try {
                const executePayment = await axios.post(
                  `${backend}/api/payments/execute`,
                  {
                    sessionId: response.sessionId,
                    invoiceValue: item.price,
                    userDefinedField: itemType,
                    customerReference: user?.userId,
                    invoiceItems: [
                      {
                        ItemName: item._id,
                        Quantity: 1,
                        UnitPrice: item.price,
                      },
                    ],
                  }
                );
                console.log("new exec payment res: ", executePayment);
                window.location.href = executePayment.data.paymentUrl;
              } catch (err) {
                console.error(err);
                setError(
                  "تم الدفع ولكن لم يتم تأكيد العملية. يرجى مراجعة الدعم."
                );
              }
            } else {
              setError(
                response?.Message || "فشل الدفع. يرجى المحاولة مرة أخرى."
              );
            }
          },
        });
      } catch (err: any) {
        console.error(err);
        setError(err.message || "حدث خطأ في الدفع");
        setLoading(false);
      }
    };

    startPayment();
  }, [
    backend,
    isOpen,
    item._id,
    item.price,
    itemType,
    onSuccess,
    user?.email,
    user?.fullName,
    user?.userId,
  ]);

  const loadMyFatoorahScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src*="session.js"]')) {
        return resolve();
      }
      const script = document.createElement("script");
      // production
      script.src = "https://qa.myfatoorah.com/payment/v1/session.js";
      // demo
      // script.src = "https://demo.myfatoorah.com/payment/v1/session.js";

      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("فشل تحميل سكربت MyFatoorah"));
      document.body.appendChild(script);
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1001,
      }}
    >
      {otpIframe === "" && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "var(--white)",
            borderRadius: 20,
            padding: "32px 24px",
            maxWidth: 480,
            width: "100%",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            fontFamily: "sans-serif",
            color: "var(--black)",
          }}
        >
          {/* Title */}
          <h2
            style={{
              marginBottom: 24,
              textAlign: "center",
              fontSize: 22,
              fontWeight: "600",
              color: "var(--purple)",
            }}
          >
            🛒 إتمام الشراء
          </h2>

          {/* Item info */}
          <div
            style={{
              marginBottom: 20,
              padding: "16px",
              border: "1px solid #eee",
              borderRadius: 12,
              background: "#fafafa",
            }}
          >
            <p style={{ margin: "6px 0", fontSize: 15, color: "#555" }}>
              🛒 الاسم: <b style={{ color: "var(--purple)" }}>{item?.title}</b>
            </p>
            <p style={{ margin: "6px 0", fontSize: 15, color: "#555" }}>
              💵 السعر:{" "}
              <b style={{ color: "var(--purple)" }}>
                QR {item?.price.toFixed(2)}
              </b>
            </p>
          </div>

          {/* Messages */}
          {error && (
            <p style={{ color: "red", marginBottom: 12, fontSize: 14 }}>
              ⚠️ {error}
            </p>
          )}
          {success && (
            <p style={{ color: "green", marginBottom: 12, fontSize: 14 }}>
              ✅ تمت عملية الدفع بنجاح
            </p>
          )}
          {loading && (
            <p
              style={{ color: "var(--purple)", marginBottom: 12, fontSize: 14 }}
            >
              ⏳ جاري معالجة الدفع...
            </p>
          )}

          {/* Embedded payment form */}
          <div
            id="embedded-payment"
            ref={embeddedContainerRef}
            style={{ marginTop: 20 }}
          />

          {/* Footer actions */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 24,
            }}
          >
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "2px solid var(--purple)",
                color: "var(--purple)",
                padding: "10px 20px",
                borderRadius: 10,
                fontWeight: "600",
                cursor: "pointer",
                transition: "0.2s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "var(--purple)";
                e.currentTarget.style.color = "var(--white)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--purple)";
              }}
            >
              إلغاء
            </button>
          </div>
        </div>
      )}
      {otpIframe !== "" && (
        <iframe
          src={otpIframe}
          style={{
            width: "100%",
            maxWidth: 480,
            height: 600,
            border: "none",
            borderRadius: 16,
            boxShadow: "0 2px 16px rgba(143,67,140,0.15)",
            background: "#fff",
            marginTop: 24,
            marginBottom: 24,
            display: "block",
          }}
          allow="payment"
        />
      )}
    </div>
  );
};

export default PaymentModal;
