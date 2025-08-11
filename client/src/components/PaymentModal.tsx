/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { useEffect, useRef, useState } from "react";
import { FaCreditCard } from "react-icons/fa";
import axios from "axios";

interface PaymentItem {
  _id: string;
  title: string;
  price: number;
  image: string;
  teacher?: {
    fullname: string;
  };
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

  // States (some become vestigial when using embedded)
  loading: boolean;
  error: string;
  success: boolean;
  agreeTerms: boolean;
  paymentMethod: string; // expecting "credit" here

  // (Optional) kept so parent can still control if needed
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCVV: string;

  // Actions from parent
  onPaymentSubmit: (e: React.FormEvent) => void; // will be overridden internally
  setAgreeTerms: (value: boolean) => void;
  setPaymentMethod: (value: string) => void;
  setCardName: (value: string) => void;
  setCardNumber: (value: string) => void;
  setCardExpiry: (value: string) => void;
  setCardCVV: (value: string) => void;

  // Optional: callback after payment success to let parent update order
  onSuccess?: (data: any) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  item,
  itemType,
  user,
  loading: parentLoading,
  error: parentError,
  success: parentSuccess,
  agreeTerms,
  paymentMethod,
  cardName,
  cardNumber,
  cardExpiry,
  cardCVV,
  onPaymentSubmit, // will not be used directly for embedded flow
  setAgreeTerms,
  setPaymentMethod,
  setCardName,
  setCardNumber,
  setCardExpiry,
  setCardCVV,
  onSuccess,
}) => {
  const backend = import.meta.env.VITE_BACKEND;

  const [loading, setLoading] = useState<boolean>(parentLoading);
  const [error, setError] = useState<string>(parentError);
  const [success, setSuccess] = useState<boolean>(parentSuccess);
  const [sessionInfo, setSessionInfo] = useState<{
    SessionId?: string;
    CountryCode?: string;
  } | null>(null);
  const embeddedContainerRef = useRef<HTMLDivElement | null>(null);
  const [executed, setExecuted] = useState(false);

  // Sync parent props if they change
  useEffect(() => {
    setLoading(parentLoading);
  }, [parentLoading]);
  useEffect(() => {
    setError(parentError);
  }, [parentError]);
  useEffect(() => {
    setSuccess(parentSuccess);
  }, [parentSuccess]);

  // Kick off embedded payment when user submits
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // if (!agreeTerms) {
  //   //   setError("يجب الموافقة على الشروط والأحكام قبل الدفع.");
  //   //   return;
  //   // }
  //   if (!item) {
  //     setError("لا يوجد عنصر صالح للدفع.");
  //     return;
  //   }
  //   setError("");
  //   setLoading(true);

  //   try {
  //     // 1. initiate session from backend
  //     const sessionRes = await axios.post(
  //       backend + "/api/payments/initiate-session"
  //     );
  //     const data = sessionRes.data?.Data || sessionRes.data;
  //     const sessionId = data?.SessionId || data?.sessionId;
  //     const countryCode = data?.CountryCode || data?.countryCode;
  //     console.log("sessionId: ", sessionId);
  //     console.log("countryCode: ", countryCode);

  //     const { SessionId, CountryCode } = sessionRes.data.Data;
  //     console.log("SessionId: ", SessionId);
  //     console.log("CountryCode: ", CountryCode);

  //     if (!sessionId || !countryCode) {
  //       throw new Error("فشل الحصول على SessionId أو CountryCode من الخادم.");
  //     }
  //     setSessionInfo({ SessionId: sessionId, CountryCode: countryCode });

  //     // 2. load embedded script if not already loaded
  //     await loadMyFatoorahScript();

  //     // 3. initialize embedded payment
  //     if (typeof (window as any).myfatoorah === "undefined") {
  //       throw new Error("مكتبة MyFatoorah لم تُحمل بعد.");
  //     }

  //     const amountStr = item.price.toFixed(2);

  //     (window as any).myfatoorah.init({
  //       sessionId: SessionId,
  //       countryCode: CountryCode,
  //       currencyCode: "QAR", // fixed for Qatar
  //       amount: amountStr,

  //       callback: async function (response: any) {
  //         console.log("MyFatoorah embedded callback:", response);

  //         const sessionId = response?.sessionId;
  //         if (!sessionId) {
  //           setError("لم يتم استلام SessionId من MyFatoorah.");
  //           return;
  //         }

  //         try {
  //           // Step 1: Execute the actual payment
  //           const execRes = await axios.post(
  //             backend + "/api/payments/execute",
  //             {
  //               sessionId: response?.sessionId,
  //               invoiceValue: item.price,
  //               customerReference: user?.email || "",
  //               userDefinedField: item._id,
  //             }
  //           );

  //           if (execRes.data?.Data?.PaymentURL) {
  //             window.location.href = execRes.data.Data.PaymentURL; // Critical redirect
  //           } else {
  //             // If no redirect URL (shouldn't happen)
  //             throw new Error("Missing 3DS verification URL");
  //           }

  //           const execData = execRes.data?.Data || execRes.data;
  //           console.log("Execute payment data:", execData);

  //           const paymentKey =
  //             execData?.InvoiceId || execData?.Key || execData?.PaymentId;

  //           if (!paymentKey) {
  //             throw new Error("لم يتم استلام معرف الفاتورة من MyFatoorah.");
  //           }

  //           console.log("Sending finalize-payment-enroll data:", {
  //             userId: user?.userId,
  //             itemId: item._id,
  //             itemType,
  //             paymentKey,
  //             amount: item.price,
  //             currency: "QAR",
  //           });
  //           // Step 2: Verify and enroll
  //           const finalizeRes = await axios.post(
  //             backend + "/user/finalize-payment-enroll",
  //             {
  //               userId: user?.userId,
  //               itemId: item._id,
  //               itemType,
  //               paymentKey,
  //               amount: item.price,
  //               currency: "QAR",
  //             }
  //           );

  //           setSuccess(true);
  //           onSuccess?.(finalizeRes.data);
  //         } catch (err: any) {
  //           console.log(err);
  //           const msg =
  //             err?.response?.data?.message || err.message || "حدث خطأ";
  //           setError(`الدفع تم ولكن فشل تفعيل المنتج: ${msg}`);
  //         } finally {
  //           setLoading(false);
  //         }
  //       },
  //       containerId: "embedded-payment",
  //       paymentOptions: ["Card"], // you can add other supported options if enabled
  //     });

  //     setExecuted(true);
  //   } catch (err: any) {
  //     console.error("Payment flow error", err);
  //     setError(
  //       err?.response?.data?.message ||
  //         err?.message ||
  //         "حدث خطأ أثناء إعداد الدفع."
  //     );
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) {
      setError("لا يوجد عنصر صالح للدفع.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      // 1. Initiate session
      const sessionRes = await axios.post(
        `${backend}/api/payments/initiate-session`
      );
      const { SessionId, CountryCode } = sessionRes.data.Data;

      if (!SessionId || !CountryCode) {
        throw new Error("Failed to get SessionId or CountryCode");
      }

      // 2. Load MyFatoorah script
      await loadMyFatoorahScript();

      if (embeddedContainerRef.current) {
        embeddedContainerRef.current.innerHTML = "";
      }

      // 3. Initialize embedded payment
      const amountStr = item.price.toFixed(2);

      (window as any).myfatoorah.init({
        sessionId: SessionId,
        countryCode: CountryCode,
        currencyCode: "QAR",
        amount: amountStr,
        callback: async (response: any) => {
          try {
            // Store payment data in localStorage before redirect
            localStorage.setItem(
              "paymentData",
              JSON.stringify({
                userId: user?.userId,
                itemId: item._id,
                itemType,
                amount: item.price,
                email: user?.email,
              })
            );

            // Execute payment to get PaymentURL
            const execRes = await axios.post(
              `${backend}/api/payments/execute`,
              {
                sessionId: response?.sessionId,
                invoiceValue: item.price,
                customerReference: user?.email || "",
                userDefinedField: item._id,
              }
            );

            if (execRes.data?.Data?.PaymentURL) {
              // Open in new tab to preserve state
              const newWindow = window.open(
                execRes.data.Data.PaymentURL,
                "_blank"
              );

              if (!newWindow) {
                throw new Error("Please allow popups for payment processing");
              }

              // Poll for payment completion
              const pollCompletion = async () => {
                try {
                  const paymentKey = execRes.data.Data.InvoiceId;
                  const verifyRes = await axios.post(
                    `${backend}/user/finalize-payment-enroll`,
                    {
                      paymentKey,
                      userId: user?.userId,
                      itemId: item._id,
                      itemType,
                      amount: item.price,
                    }
                  );

                  if (verifyRes.data.payment?.status === "Paid") {
                    setSuccess(true);
                    onSuccess?.(verifyRes.data);
                    newWindow.close();
                    setTimeout(() => {
                      window.location.reload();
                    }, 2000);
                  } else {
                    setTimeout(pollCompletion, 2000); // Retry after 2 seconds
                  }
                } catch (error) {
                  console.error("Verification error:", error);
                  setError("Payment verification failed");
                  newWindow.close();
                }
              };

              // Start polling after 20 seconds (give time for payment)
              setTimeout(pollCompletion, 20000);
            } else {
              throw new Error("Missing payment URL");
            }
          } catch (err: any) {
            console.error("Payment error:", err);
            setError(
              err.response?.data?.message || err.message || "Payment failed"
            );
          } finally {
            setLoading(false);
          }
        },
        containerId: "embedded-payment",
        paymentOptions: ["Card"],
      });

      setExecuted(true);
    } catch (err: any) {
      console.error("Payment initiation error:", err);
      setError(err.response?.data?.message || err.message || "Payment failed");
      setLoading(false);
    }
  };
  const loadMyFatoorahScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // avoid double injection
      if (
        document.querySelector(
          'script[src*="qa.myfatoorah.com/payment/v1/session.js"]'
        )
      ) {
        // wait a tick for it to be ready
        return resolve();
      }
      const script = document.createElement("script");
      script.src = "https://qa.myfatoorah.com/payment/v1/session.js";
      script.async = true;
      script.onload = () => {
        resolve();
      };
      script.onerror = () => reject(new Error("فشل تحميل سكربت MyFatoorah"));
      document.body.appendChild(script);
    });
  };

  if (!isOpen) return null;
  return (
    <div
      className="modal-overlay"
      style={{
        zIndex: 1001,
        position: "fixed",
        inset: 0,
        background: "rgba(143,67,140,0.10)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "fadeInOverlay 0.25s",
      }}
      onClick={onClose}
    >
      <div
        className="modal checkout-modal"
        style={{
          background: "linear-gradient(180deg, #fff 0%, #f7eafd 100%)",
          borderRadius: 24,
          boxShadow: "0 8px 32px rgba(143,67,140,0.18)",
          padding: 40,
          minWidth: 320,
          maxWidth: 440,
          width: "95%",
          color: "#222",
          fontFamily: "inherit",
          position: "relative",
          margin: "auto",
          animation: "modalFadeIn 0.5s cubic-bezier(.4,1.4,.6,1) both",
          pointerEvents: "auto",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          className="modal-title"
          style={{
            textAlign: "center",
            marginBottom: 24,
            fontWeight: 800,
            fontSize: 24,
            color: "#8f438c",
            letterSpacing: 1,
          }}
        >
          إتمام الشراء
        </h2>

        <div
          className="checkout-summary"
          style={{
            marginBottom: 24,
            borderBottom: "1.5px solid #f0e6fa",
            paddingBottom: 18,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <img
              src={`${backend}/${item?.image}`}
              alt={item?.title}
              style={{
                width: 64,
                height: 64,
                borderRadius: 12,
                objectFit: "cover",
                border: "1px solid #eee",
                boxShadow: "0 2px 8px #f7eafd",
              }}
            />
            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 19,
                  color: "#8f438c",
                }}
              >
                {item?.title}
              </div>
              <div style={{ fontSize: 15, color: "#888" }}>
                {itemType === "course"
                  ? `تقديم ${item?.teacher?.fullname}`
                  : "منتج رقمي"}
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              fontSize: 17,
              fontWeight: 700,
              color: "#8f438c",
            }}
          >
            السعر:{" "}
            <span style={{ color: "#222" }}>QR {item?.price.toFixed(2)}</span>
          </div>
        </div>

        <div
          className="checkout-user-info"
          style={{ marginBottom: 18, fontSize: 15, color: "#555" }}
        >
          <div>
            <b>المستخدم:</b> {user?.fullName || "---"}
          </div>
        </div>

        <div
          className="checkout-payment-method"
          style={{
            marginBottom: 18,
            borderBottom: "1.5px solid #f0e6fa",
            paddingBottom: 18,
          }}
        >
          <div
            style={{
              fontWeight: 600,
              marginBottom: 8,
              color: "#8f438c",
            }}
          >
            طريقة الدفع
          </div>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 16,
            }}
          >
            <input
              type="radio"
              name="payment-method"
              checked={paymentMethod === "credit"}
              onChange={() => setPaymentMethod("credit")}
              style={{ accentColor: "#8f438c" }}
            />
            <FaCreditCard style={{ color: "#8f438c", fontSize: 22 }} /> بطاقة
            ائتمان
          </label>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Embedded payment container */}
          <div
            className="embedded-wrapper"
            style={{ marginBottom: 24, minHeight: 120 }}
          >
            {paymentMethod === "credit" ? (
              <>
                {!executed && (
                  <div
                    style={{
                      padding: 12,
                      background: "#f9f4fb",
                      borderRadius: 12,
                      fontSize: 14,
                      color: "#555",
                    }}
                  >
                    بعد الضغط على "ادفع الآن" سيُفتح نموذج الدفع الآمن من
                    MyFatoorah داخل هذه النافذة.
                  </div>
                )}
                <div
                  id="embedded-payment"
                  ref={(el) => (embeddedContainerRef.current = el)}
                  style={{ marginTop: 12 }}
                />
              </>
            ) : (
              // If you eventually support other methods, fallback UI
              <div
                style={{
                  padding: 12,
                  background: "#f9f4fb",
                  borderRadius: 12,
                  fontSize: 14,
                  color: "#555",
                }}
              >
                اختر طريقة دفع صالحة.
              </div>
            )}
          </div>
          {/* 
          <div className="checkout-terms" style={{ marginBottom: 24 }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 15,
                color: "#8f438c",
              }}
            >
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={() => setAgreeTerms(!agreeTerms)}
                style={{ accentColor: "#8f438c" }}
              />
              أوافق على{" "}
              <a
                href="#"
                style={{
                  color: "#8f438c",
                  textDecoration: "underline",
                  marginLeft: 4,
                }}
              >
                الشروط والأحكام
              </a>
            </label>
          </div> */}

          {error && (
            <div
              style={{
                color: "#d32f2f",
                marginBottom: 14,
                textAlign: "center",
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          )}

          {loading ? (
            <div
              style={{
                textAlign: "center",
                margin: "18px 0",
              }}
            >
              <div
                className="spinner"
                style={{
                  width: 36,
                  height: 36,
                  border: "4px solid #eee",
                  borderTop: "4px solid #8f438c",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  margin: "0 auto",
                }}
              />
              <div
                style={{
                  marginTop: 8,
                  color: "#8f438c",
                }}
              >
                جاري معالجة الدفع...
              </div>
            </div>
          ) : success ? (
            <div
              style={{
                textAlign: "center",
                color: "#388e3c",
                fontWeight: 700,
                fontSize: 18,
                margin: "18px 0",
              }}
            >
              تم الشراء بنجاح!
              <br />
              سيتم تحويلك الآن...
            </div>
          ) : (
            <div
              className="modal-actions"
              style={{
                display: "flex",
                gap: 12,
                marginTop: 12,
              }}
            >
              <button
                className="btn btn-confirm"
                disabled={loading}
                type="submit"
                style={{
                  flex: 1,
                  background:
                    "linear-gradient(90deg, #8f438c 0%, #e573c7 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 14,
                  fontSize: 19,
                  fontWeight: 700,
                  padding: "16px 0",
                  boxShadow: "0 2px 12px rgba(143,67,140,0.10)",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "transform 0.15s, box-shadow 0.15s",
                  outline: "none",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.03)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                ادفع الآن
              </button>
              <button
                className="btn btn-cancel"
                disabled={loading}
                type="button"
                onClick={onClose}
                style={{
                  flex: 1,
                  background: "#eee",
                  color: "#8f438c",
                  border: "none",
                  borderRadius: 14,
                  fontSize: 16,
                  fontWeight: 600,
                  padding: "16px 0",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "background 0.2s",
                }}
              >
                إلغاء
              </button>
            </div>
          )}

          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes modalFadeIn {
              0% { opacity: 0; transform: translateY(40px) scale(0.98);}
              100% { opacity: 1; transform: translateY(0) scale(1);}
            }
            @keyframes fadeInOverlay {
              0% { opacity: 0; }
              100% { opacity: 1; }
            }
          `}</style>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
