import "../css/ProductCard.css";

import IProduct from "../interfaces/IProduct";
import { useUserStore } from "../store";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart, FaRegHeart, FaCreditCard } from "react-icons/fa";

const ProductCard = ({ product }: { product: IProduct }) => {
  const backend = import.meta.env.VITE_BACKEND;

  const { user } = useUserStore();

  const [isUserEnrolled, setIsUserEnrolled] = useState<boolean>(false);
  const [inWishlist, setInWishlist] = useState<boolean>(false);
  const [purchaseModal, setPurchaseModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [checkoutError, setCheckoutError] = useState("");

  useEffect(() => {
    const checkUserEnrolled = () => {
      if (user && product.students.includes(user._id)) {
        setIsUserEnrolled(true);
      } else {
        setIsUserEnrolled(false);
      }
    };

    checkUserEnrolled();
  }, [user, backend, product]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await axios.put(
        `${backend}/user/course-wishlist`,
        {
          userId: user?._id,
          courseId: product._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setInWishlist(res.data.message === "Added to wishlist");
    } catch (error) {
      console.log(error);
    }
  };

  const togglePurchaseModal = () => {
    setPurchaseModal((prev) => !prev);
  };

  const validateCardForm = () => {
    if (!cardName.trim()) return "يرجى إدخال اسم حامل البطاقة";
    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ""))) return "رقم البطاقة غير صحيح (16 رقم)";
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) return "تاريخ الانتهاء يجب أن يكون بالشكل MM/YY";
    if (!/^\d{3,4}$/.test(cardCVV)) return "رمز التحقق (CVV) غير صحيح";
    if (!agreeTerms) return "يجب الموافقة على الشروط والأحكام";
    return "";
  };

  const confirmPurchase = async () => {
    setCheckoutError("");
    const err = validateCardForm();
    if (err) {
      setCheckoutError(err);
      return;
    }
    setLoading(true);
    setCheckoutSuccess(false);
    try {
      // Call backend to create MyFatoorah payment session
      const res = await axios.post(
        `${backend}/payment/myfatoorah`,
        {
          productId: product?._id,
          userId: user?._id,
          amount: product?.price,
          cardName,
          cardNumber,
          cardExpiry,
          cardCVV,
          userEmail: user?.email,
          userName: user?.fullName,
          isDigitalProduct: true,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.data && res.data.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      } else {
        setCheckoutError("حدث خطأ أثناء إنشاء الدفع. حاول مرة أخرى.");
      }
    } catch {
      setCheckoutError("حدث خطأ أثناء الاتصال ببوابة الدفع. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <li
        className="course-card"
        onClick={() => {
          if (!purchaseModal) togglePurchaseModal();
        }}
        style={{
          backgroundImage: `url(${backend}/${product.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {user && !product.students.includes(user._id) && (
          <div className="wishlist-icon" onClick={toggleWishlist}>
            {inWishlist ? <FaHeart color="var(--yellow)" /> : <FaRegHeart />}
          </div>
        )}

        <div className="upper">
          <h2 className="course-title">{product.title}</h2>
        </div>

        <div className="card-footer">
          {!isUserEnrolled && (
            <div className="not-purchased">
              <p className="price">$ {Number(product.price).toFixed(2)}</p>
            </div>
          )}

          <div className="hover-sheet">
            <div className="hover-sheet-small-border" />
            <p>{product.teacher.fullname}</p>
            <p>{product.category.name}</p>
            <p>{product.description}</p>
          </div>
        </div>

        {/* Purchase Confirmation Modal */}
        {purchaseModal && (
          <div
            className="modal-overlay"
            style={{
              zIndex: 1001,
              position: 'fixed',
              inset: 0,
              background: 'rgba(143,67,140,0.10)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'fadeInOverlay 0.25s',
            }}
            onClick={() => setPurchaseModal(false)}
          >
            <div
              className="modal checkout-modal"
              style={{
                background: 'linear-gradient(180deg, #fff 0%, #f7eafd 100%)',
                borderRadius: 24,
                boxShadow: '0 8px 32px rgba(143,67,140,0.18)',
                padding: 40,
                minWidth: 320,
                maxWidth: 440,
                width: '95%',
                color: '#222',
                fontFamily: 'inherit',
                position: 'relative',
                margin: 'auto',
                animation: 'modalFadeIn 0.5s cubic-bezier(.4,1.4,.6,1) both',
                pointerEvents: 'auto',
              }}
              onClick={e => e.stopPropagation()}
            >
              <h2 className="modal-title" style={{ textAlign: 'center', marginBottom: 24, fontWeight: 800, fontSize: 24, color: '#8f438c', letterSpacing: 1 }}>إتمام الشراء</h2>
              <div className="checkout-summary" style={{ marginBottom: 24, borderBottom: '1.5px solid #f0e6fa', paddingBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <img src={`${backend}/${product?.image}`} alt={product?.title} style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover', border: '1px solid #eee', boxShadow: '0 2px 8px #f7eafd' }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 19, color: '#8f438c' }}>{product?.title}</div>
                    <div style={{ fontSize: 15, color: '#888' }}>تقديم {product?.teacher.fullname}</div>
                  </div>
                </div>
                <div style={{ marginTop: 14, fontSize: 17, fontWeight: 700, color: '#8f438c' }}>
                  السعر: <span style={{ color: '#222' }}>$ {product?.price.toFixed(2)}</span>
                </div>
              </div>
              <div className="checkout-user-info" style={{ marginBottom: 18, fontSize: 15, color: '#555' }}>
                <div><b>المستخدم:</b> {user?.fullName}</div>
                <div><b>البريد:</b> {user?.email || '---'}</div>
              </div>
              <div className="checkout-payment-method" style={{ marginBottom: 18, borderBottom: '1.5px solid #f0e6fa', paddingBottom: 18 }}>
                <div style={{ fontWeight: 600, marginBottom: 8, color: '#8f438c' }}>طريقة الدفع</div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16 }}>
                  <input
                    type="radio"
                    name="payment-method"
                    checked={paymentMethod === "credit"}
                    onChange={() => setPaymentMethod("credit")}
                    style={{ accentColor: '#8f438c' }}
                  />
                  <FaCreditCard style={{ color: '#8f438c', fontSize: 22 }} /> بطاقة ائتمان
                </label>
              </div>
              <form onSubmit={e => { e.preventDefault(); confirmPurchase(); }}>
                <div className="checkout-card-form" style={{ marginBottom: 24 }}>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontWeight: 600, fontSize: 15, color: '#8f438c' }}>اسم حامل البطاقة</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={e => setCardName(e.target.value)}
                      style={{ width: '100%', padding: '16px 14px', borderRadius: 14, border: '1.5px solid #e0c6f7', fontSize: 17, marginTop: 6, marginBottom: 0, boxShadow: '0 2px 8px rgba(143,67,140,0.04)', fontFamily: 'inherit', background: '#faf7fd' }}
                      placeholder="مثال: أحمد محمد"
                      required
                    />
                  </div>
                  <div style={{ marginBottom: 16, position: 'relative' }}>
                    <label style={{ fontWeight: 600, fontSize: 15, color: '#8f438c' }}>رقم البطاقة</label>
                    <FaCreditCard style={{ position: 'absolute', right: 18, top: 44, color: '#8f438c', fontSize: 22, pointerEvents: 'none' }} />
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value.replace(/[^\d]/g, '').slice(0, 16))}
                      style={{ width: '100%', padding: '16px 44px 16px 14px', borderRadius: 14, border: '1.5px solid #e0c6f7', fontSize: 17, marginTop: 6, marginBottom: 0, boxShadow: '0 2px 8px rgba(143,67,140,0.04)', fontFamily: 'inherit', background: '#faf7fd', letterSpacing: 2 }}
                      placeholder="1234 5678 9012 3456"
                      inputMode="numeric"
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontWeight: 600, fontSize: 15, color: '#8f438c' }}>تاريخ الانتهاء</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={e => setCardExpiry(e.target.value.replace(/[^\d/]/g, '').slice(0, 5))}
                        style={{ width: '100%', padding: '16px 14px', borderRadius: 14, border: '1.5px solid #e0c6f7', fontSize: 17, marginTop: 6, marginBottom: 0, boxShadow: '0 2px 8px rgba(143,67,140,0.04)', fontFamily: 'inherit', background: '#faf7fd' }}
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontWeight: 600, fontSize: 15, color: '#8f438c' }}>CVV</label>
                      <input
                        type="password"
                        value={cardCVV}
                        onChange={e => setCardCVV(e.target.value.replace(/[^\d]/g, '').slice(0, 4))}
                        style={{ width: '100%', padding: '16px 14px', borderRadius: 14, border: '1.5px solid #e0c6f7', fontSize: 17, marginTop: 6, marginBottom: 0, boxShadow: '0 2px 8px rgba(143,67,140,0.04)', fontFamily: 'inherit', background: '#faf7fd' }}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="checkout-terms" style={{ marginBottom: 24 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, color: '#8f438c' }}>
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={() => setAgreeTerms((v) => !v)}
                      style={{ accentColor: '#8f438c' }}
                    />
                    أوافق على <a href="#" style={{ color: '#8f438c', textDecoration: 'underline' }}>الشروط والأحكام</a>
                  </label>
                </div>
                {checkoutError && <div style={{ color: '#d32f2f', marginBottom: 14, textAlign: 'center', fontWeight: 600 }}>{checkoutError}</div>}
                {loading ? (
                  <div style={{ textAlign: 'center', margin: '18px 0' }}>
                    <div className="spinner" style={{ width: 36, height: 36, border: '4px solid #eee', borderTop: '4px solid #8f438c', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
                    <div style={{ marginTop: 8, color: '#8f438c' }}>جاري معالجة الدفع...</div>
                  </div>
                ) : checkoutSuccess ? (
                  <div style={{ textAlign: 'center', color: '#388e3c', fontWeight: 700, fontSize: 18, margin: '18px 0' }}>
                    تم الشراء بنجاح!<br />سيتم تحويلك للمنتج الآن...
                  </div>
                ) : (
                  <div className="modal-actions" style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                    <button
                      className="btn btn-confirm"
                      disabled={loading}
                      type="submit"
                      style={{
                        flex: 1,
                        background: 'linear-gradient(90deg, #8f438c 0%, #e573c7 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 14,
                        fontSize: 19,
                        fontWeight: 700,
                        padding: '16px 0',
                        boxShadow: '0 2px 12px rgba(143,67,140,0.10)',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'transform 0.15s, box-shadow 0.15s',
                        outline: 'none',
                      }}
                      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'}
                      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      ادفع الآن
                    </button>
                    <button
                      className="btn btn-cancel"
                      disabled={loading}
                      type="button"
                      onClick={() => setPurchaseModal(false)}
                      style={{
                        flex: 1,
                        background: '#eee',
                        color: '#8f438c',
                        border: 'none',
                        borderRadius: 14,
                        fontSize: 16,
                        fontWeight: 600,
                        padding: '16px 0',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'background 0.2s',
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
        )}
      </li>
    </>
  );
};

export default ProductCard;
