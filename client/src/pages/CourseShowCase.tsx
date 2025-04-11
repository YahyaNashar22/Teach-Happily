import "../css/CourseShowCase.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useUserStore } from "../store";
import { useEffect, useState } from "react";
import ICourse from "../interfaces/ICourse";
import axios from "axios";
import Loading from "../components/Loading";

import placeholderImg from "../assets/course_placeholder.png";
import IFeedback from "../interfaces/IFeedback";
import CourseCard from "../components/CourseCard";

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

  const [isPurchaseModal, setIsPurchaseModal] = useState<boolean>(false);

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

  const confirmPurchase = () => {
    // TODO: Handle actual purchase logic (API request, payment, etc.)

    // TODO: MOVE THIS FUNCTION TO AFTER SUCCESS PAYMENT
    enroll();

    setIsPurchaseModal(false);
  };

  // TODO: MOVE THIS FUNCTION TO AFTER SUCCESS PAYMENT
  const enroll = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${backend}/user/enroll-course`,
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

      if (res.status === 200) {
        setIsPurchaseModal(false);
        navigate(`/course/${course?.slug}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && course?.enrolledStudents.includes(user._id)) {
      navigate(`/course/${course?.slug}`);
    }
  }, [user, course, navigate]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <main className="course-showcase-wrapper">
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
                  <source src={`${backend}/${course.demo}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  // TODO: DON'T FORGET TO CHANGE THIS BACK
                  // src={`${backend}/${course?.image}`}
                  src={placeholderImg}
                  alt={course?.title}
                  loading="lazy"
                  className="course-showcase-thumbnail"
                />
              )}
            </div>

            {/* Upper left Section  */}
            <div className="course-showcase-upper-left">
              <h1 className="course-showcase-course-title">{course?.title}</h1>
              <div className="course-showcase-course-rating">⭐⭐⭐⭐⭐</div>
              <ul className="course-showcase-course-meta">
                <li className="course-showcase-course-meta-item">
                  {course?.duration}
                </li>

                <li className="course-showcase-course-meta-item">
                  {course?.content.length}
                </li>
              </ul>
              <div className="course-showcase-course-teacher">
                <img
                  src={`${backend}/${course?.teacher.image}`}
                  loading="lazy"
                  alt={course?.teacher.fullname}
                  className="course-showcase-course-teacher-img"
                />
              </div>
              <div className="course-showcase-perks">
                <h2 className="course-showcase-perks-title">
                  سجل بهذه الدورة واحصل على
                </h2>
                <div className="course-showcase-perks-item">
                  <img
                    src=""
                    loading="lazy"
                    alt="perk-icon"
                    className="course-showcase-perks-item-ico"
                  />
                  <p className="course-showcase-perks-item-text">
                    مشاهدة غير محدودة للدورة
                  </p>
                </div>
                <div className="course-showcase-perks-item">
                  <img
                    src=""
                    loading="lazy"
                    alt="perk-icon"
                    className="course-showcase-perks-item-ico"
                  />
                  <p className="course-showcase-perks-item-text">
                    شهادة إتمام الدورة
                  </p>
                </div>
                <div className="course-showcase-perks-item">
                  <img
                    src=""
                    loading="lazy"
                    alt="perk-icon"
                    className="course-showcase-perks-item-ico"
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
              <div className="course-showcase-course-teacher">
                <img
                  src={`${backend}/${course?.teacher.image}`}
                  alt={course?.teacher.fullname}
                  loading="lazy"
                  className="course-showcase-course-teacher-section-img"
                />
                <h2 className="course-showcase-teacher-section-name">
                  {course?.teacher.fullname}
                </h2>
                <p className="course-showcase-teacher-section-teacher">
                  المدرب
                </p>
                <Link to="" className="course-showcase-teacher-read-more">
                  اقرأ المزيد
                </Link>
              </div>
            </div>

            <div className="course-showcase-feedback">
              <h2 className="course-showcase-feedback-header">
                التقييمات والآراء
              </h2>
              {feedbackLoader ? (
                <p className="course-showcase-loading-text">
                  جار الحصول على البيانات
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
                            {feedback.createdAt}
                          </p>
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
                    return <CourseCard course={c} />;
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* Purchase Confirmation Modal */}
          {isPurchaseModal && (
            <div className="modal-overlay">
              <div className="modal">
                <h2 className="modal-title">تأكيد الشراء</h2>
                <p className="modal-text">
                  هل أنت متأكد أنك تريد شراء الدورة{" "}
                  <strong>{course?.title}</strong> مقابل{" "}
                  <span className="modal-price">
                    $ {course?.price.toFixed(2)}
                  </span>
                  ؟
                </p>
                <div className="modal-actions">
                  <button
                    className="btn btn-confirm"
                    disabled={loading}
                    onClick={confirmPurchase}
                  >
                    تأكيد
                  </button>
                  <button
                    className="btn btn-cancel"
                    disabled={loading}
                    onClick={() => setIsPurchaseModal(false)}
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      )}
    </>
  );
};

export default CourseShowCase;
