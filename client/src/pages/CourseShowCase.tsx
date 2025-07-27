import "../css/CourseShowCase.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useUserStore } from "../store";
import { useEffect, useState } from "react";
import ICourse from "../interfaces/ICourse";
import axios from "axios";
import Loading from "../components/Loading";

import IFeedback from "../interfaces/IFeedback";
import CourseCard from "../components/CourseCard";

import documents from "../assets/documents.png";
import clock from "../assets/clock.png";
import message from "../assets/message.png";
import infinity from "../assets/infinity.png";
import badge_ico from "../assets/badge_ico.png";
import StarRating from "../components/StarRating";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CourseShowCaseHero from "../components/CourseShowCaseHero";
import { FaCreditCard } from "react-icons/fa";

const CourseShowCase = () => {
  const { slug } = useParams();
  const { user } = useUserStore();
  const navigate = useNavigate();
  const backend = import.meta.env.VITE_BACKEND;

  const [course, setCourse] = useState<ICourse | null>(null);
  const [similar, setSimilar] = useState<ICourse[]>([]);
  const [feedbacks, setFeedbacks] = useState<IFeedback[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [feedbackLoader, setFeedbackLoader] = useState<boolean>(false);
  const [similarLoader, setSimilarLoader] = useState<boolean>(false);

  const [inWishlist, setInWishlist] = useState<boolean>(false);

  const [isPurchaseModal, setIsPurchaseModal] = useState<boolean>(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [checkoutError, setCheckoutError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${backend}/course/get/${slug}`);

        if (!res.data.payload) {
          navigate("*");
        }

        setCourse(res.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [backend, slug, user, navigate]);

  useEffect(() => {
    if (!course) return;
    const fetchFeedbacks = async () => {
      setFeedbackLoader(true);
      try {
        const res = await axios.get(`${backend}/feedback/${course._id}`);

        setFeedbacks(res.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setFeedbackLoader(false);
      }
    };

    fetchFeedbacks();
  }, [backend, course, user]);

  useEffect(() => {
    if (!course) return;
    const fetchSimilar = async () => {
      setSimilarLoader(true);
      try {
        const res = await axios.post(
          `${backend}/course/get-similar`,
          { category: course.category },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setSimilar(res.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setSimilarLoader(false);
      }
    };

    fetchSimilar();
  }, [backend, course, user]);

  const handleEnrollClick = () => {
    if (!user) {
      navigate("/sign-in");
    } else {
      setIsPurchaseModal(true);
    }
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
          courseId: course?._id,
          userId: user?._id,
          amount: course?.price,
          cardName,
          cardNumber,
          cardExpiry,
          cardCVV,
          userEmail: user?.email,
          userName: user?.fullName,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.data && res.data.paymentUrl) {
        window.location.href = res.data.paymentUrl;
        // Optionally, show a spinner or message while redirecting
      } else {
        setCheckoutError("حدث خطأ أثناء إنشاء الدفع. حاول مرة أخرى.");
      }
    } catch {
      setCheckoutError("حدث خطأ أثناء الاتصال ببوابة الدفع. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && course?.enrolledStudents.includes(user._id)) {
      navigate(`/course/${course?.slug}`);
    }
  }, [user, course, navigate]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await axios.put(
        `${backend}/user/course-wishlist`,
        {
          userId: user?._id,
          courseId: course?._id,
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

  const averageRating = feedbacks.length
    ? Math.round(
        feedbacks.reduce((acc, f) => acc + (f.rating || 0), 0) /
          feedbacks.length
      )
    : 0;

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <main>
          <CourseShowCaseHero />
          <section className="course-showcase-wrapper">
            {/* Upper Section  */}
            <div className="course-showcase-upper">
              {/* Upper right Section  */}
              <div className="course-showcase-upper-right">
                {course?.demo ? (
                  <video
                    className="course-showcase-video-player"
                    controlsList="nodownload"
                    disablePictureInPicture
                  >
                    <source
                      src={`${backend}/${course.demo}`}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={`${backend}/${course?.image}`}
                    alt={course?.title}
                    loading="lazy"
                    className="course-showcase-thumbnail"
                  />
                )}
              </div>

              {/* Upper left Section  */}
              <div className="course-showcase-upper-left">
                <h1 className="course-showcase-course-title">
                  {course?.title}
                </h1>
                <div className="course-showcase-course-rating">
                  <StarRating rating={averageRating} />
                </div>
                {user &&
                  course &&
                  !course.enrolledStudents.includes(user._id) && (
                    <div
                      className="course-showcase-wishlist-icon"
                      onClick={toggleWishlist}
                    >
                      {inWishlist ? (
                        <FaHeart color="var(--yellow)" />
                      ) : (
                        <FaRegHeart />
                      )}
                    </div>
                  )}
                <ul className="course-showcase-course-meta">
                  <li className="course-showcase-course-meta-item">
                    <span>
                      <img src={clock} width={16} alt="clock" loading="lazy" />
                    </span>
                    {course?.duration}
                  </li>

                  <li className="course-showcase-course-meta-item">
                    <span>
                      <img
                        src={documents}
                        width={16}
                        alt="documents"
                        loading="lazy"
                      />
                    </span>
                    {course?.content.length} دروس
                  </li>
                </ul>
                <div className="course-showcase-course-teacher">
                  <img
                    src={`${backend}/${course?.teacher?.image}`}
                    loading="lazy"
                    alt={course?.teacher.fullname}
                    className="course-showcase-course-teacher-img"
                  />
                  <p className="course-showcase-course-teacher-name">
                    تقديم {course?.teacher.fullname}
                  </p>
                </div>
                <div className="course-showcase-perks">
                  <h2 className="course-showcase-perks-title">
                    سجل بهذه الدورة واحصل على
                  </h2>
                  <div className="course-showcase-perks-item">
                    <img
                      src={infinity}
                      loading="lazy"
                      alt="perk-icon"
                      className="course-showcase-perks-item-ico"
                      width={16}
                    />
                    <p className="course-showcase-perks-item-text">
                      مشاهدة غير محدودة للدورة
                    </p>
                  </div>
                  <div className="course-showcase-perks-item">
                    <img
                      src={badge_ico}
                      loading="lazy"
                      alt="perk-icon"
                      className="course-showcase-perks-item-ico"
                      width={16}
                    />
                    <p className="course-showcase-perks-item-text">
                      شهادة إتمام الدورة
                    </p>
                  </div>
                  <div className="course-showcase-perks-item">
                    <img
                      src={message}
                      loading="lazy"
                      alt="perk-icon"
                      className="course-showcase-perks-item-ico"
                      width={16}
                    />
                    <p className="course-showcase-perks-item-text">
                      التواصل مع المدرب
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleEnrollClick}
                  className="btn enroll-btn course-showcase-buy"
                >
                  شراء الان
                </button>
              </div>
            </div>

            {/* Lower Section  */}
            <div className="course-showcase-lower">
              <div className="course-showcase-course-description-teacher">
                <div className="course-showcase-course-description">
                  <h1 className="course-showcase-course-description-title">
                    محتوى الدورة
                  </h1>
                  <p className="course-showcase-course-description-content">
                    {course?.description}
                  </p>
                </div>
                <div className="course-showcase-course-teacher-section">
                  <img
                    src={`${backend}/${course?.teacher?.image}`}
                    alt={course?.teacher.fullname}
                    loading="lazy"
                    className="course-showcase-course-teacher-section-img"
                  />
                  <div className="course-showcase-teacher-section-info-container">
                    <h2 className="course-showcase-teacher-section-name">
                      {course?.teacher.fullname}
                    </h2>
                    <Link
                      to={`/teacher-showcase/${course?.teacher._id}`}
                      className="course-showcase-teacher-read-more"
                    >
                      اقرأ المزيد
                    </Link>
                  </div>
                </div>
              </div>

              <div className="course-showcase-feedback">
                <h2 className="course-showcase-feedback-header">
                  التقييمات والآراء
                </h2>
                {feedbackLoader ? (
                  <p>جار الحصول على البيانات</p>
                ) : feedbacks.length === 0 ? (
                  <p className="course-showcase-loading-text">
                    لا يوجد تقييمات
                  </p>
                ) : (
                  <ul className="course-showcase-feedback-list">
                    {feedbacks.map((feedback) => {
                      return (
                        <li
                          key={feedback._id}
                          className="course-showcase-feedback-card"
                        >
                          <p className="course-showcase-feedback-card-initials">
                            {feedback.userId.fullName.split(" ")[0][0]}
                          </p>
                          <div className="course-showcase-feedback-card-text">
                            <p className="course-showcase-feedback-card-user-name">
                              {feedback.userId.fullName}
                            </p>
                            <p className="course-showcase-feedback-card-date">
                              {new Date(feedback.createdAt).toLocaleString(
                                "ar-EG",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                }
                              )}
                            </p>
                            <StarRating rating={feedback.rating || 0} />
                            <p className="course-showcase-feedback-card-content">
                              {feedback.content}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div className="course-showcase-similar">
                <h2 className="course-showcase-similar-header">دورات مشابهة</h2>
                {similarLoader ? (
                  <p className="course-showcase-loading-text">
                    جار الحصول على البيانات
                  </p>
                ) : (
                  <ul className="course-showcase-similar-list">
                    {similar.map((c) => {
                      return <CourseCard key={c._id} course={c} />;
                    })}
                  </ul>
                )}
              </div>
            </div>

            {/* Purchase Confirmation Modal */}
            {isPurchaseModal && (
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
                onClick={() => setIsPurchaseModal(false)}
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
                      <img src={`${backend}/${course?.image}`} alt={course?.title} style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover', border: '1px solid #eee', boxShadow: '0 2px 8px #f7eafd' }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 19, color: '#8f438c' }}>{course?.title}</div>
                        <div style={{ fontSize: 15, color: '#888' }}>تقديم {course?.teacher.fullname}</div>
                      </div>
                    </div>
                    <div style={{ marginTop: 14, fontSize: 17, fontWeight: 700, color: '#8f438c' }}>
                      السعر: <span style={{ color: '#222' }}>$ {course?.price.toFixed(2)}</span>
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
                        تم الشراء بنجاح!<br />سيتم تحويلك للدورة الآن...
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
                          onClick={() => setIsPurchaseModal(false)}
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
          </section>
        </main>
      )}
    </>
  );
};

export default CourseShowCase;
