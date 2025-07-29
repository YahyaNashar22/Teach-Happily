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
import { usePayment } from "../hooks/usePayment";
import PaymentModal from "../components/PaymentModal";

const CourseShowCase = () => {
  const { slug } = useParams();
  const { user } = useUserStore();
  const navigate = useNavigate();
  const backend = import.meta.env.VITE_BACKEND;

  const [course, setCourse] = useState<ICourse | null>(null);
  const [similar, setSimilar] = useState<ICourse[]>([]);
  const [feedbacks, setFeedbacks] = useState<IFeedback[]>([]);

  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [feedbackLoader, setFeedbackLoader] = useState<boolean>(false);
  const [similarLoader, setSimilarLoader] = useState<boolean>(false);

  const [inWishlist, setInWishlist] = useState<boolean>(false);

  // Use the reusable payment hook
  const {
    isModalOpen,
    loading,
    error,
    success,
    agreeTerms,
    paymentMethod,
    cardName,
    cardNumber,
    cardExpiry,
    cardCVV,
    openModal,
    closeModal,
    handlePayment,
    setAgreeTerms,
    setPaymentMethod,
    setCardName,
    setCardNumber,
    setCardExpiry,
    setCardCVV,
  } = usePayment({ 
    item: course ? {
      _id: course._id,
      title: course.title,
      price: course.price,
      image: typeof course.image === 'string' ? course.image : '',
      teacher: course.teacher
    } : { _id: '', title: '', price: 0, image: '', teacher: { fullname: '' } },
    itemType: 'course' 
  });

  useEffect(() => {
    const fetchCourse = async () => {
      setPageLoading(true);
      try {
        const res = await axios.get(`${backend}/course/get/${slug}`);

        if (!res.data.payload) {
          navigate("*");
        }

        setCourse(res.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setPageLoading(false);
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

  const handleEnrollClick = async () => {
    if (!user) {
      navigate("/sign-in");
      return;
    }

    // If course is free, enroll directly without payment modal
    if (course && course.price === 0) {
      try {
        const res = await axios.post(
          `${backend}/user/enroll-course`,
          {
            userId: user._id,
            courseId: course._id,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        
        if (res.status === 200) {
          // Redirect to course page after successful enrollment
          navigate(`/course/${course.slug}`);
        }
      } catch (error) {
        console.log(error);
        // Handle error - could show a toast notification here
      }
    } else {
      // For paid courses, show payment modal
      openModal();
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlePayment();
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
      {pageLoading ? (
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
                  {course?.price === 0 ? "سجل مجاناً" : "شراء الان"}
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

            {/* Reusable Payment Modal */}
            <PaymentModal
              isOpen={isModalOpen}
              onClose={closeModal}
              item={course ? {
                _id: course._id,
                title: course.title,
                price: course.price,
                image: typeof course.image === 'string' ? course.image : '',
                teacher: course.teacher
              } : { _id: '', title: '', price: 0, image: '', teacher: { fullname: '' } }}
              itemType="course"
              user={user ? { fullName: user.fullName, email: user.email || '' } : null}
              backend={backend}
              loading={loading}
              error={error}
              success={success}
              agreeTerms={agreeTerms}
              paymentMethod={paymentMethod}
              cardName={cardName}
              cardNumber={cardNumber}
              cardExpiry={cardExpiry}
              cardCVV={cardCVV}
              onPaymentSubmit={handlePaymentSubmit}
              setAgreeTerms={setAgreeTerms}
              setPaymentMethod={setPaymentMethod}
              setCardName={setCardName}
              setCardNumber={setCardNumber}
              setCardExpiry={setCardExpiry}
              setCardCVV={setCardCVV}
            />
          </section>
        </main>
      )}
    </>
  );
};

export default CourseShowCase;
