import "../css/CourseCard.css";

import { FaClock } from "react-icons/fa";
import ICourse from "../interfaces/ICourse";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../store";
import { useEffect, useState } from "react";

const CourseCard = ({ course }: { course: ICourse }) => {
  const backend = import.meta.env.VITE_BACKEND;
  const navigate = useNavigate();

  const { user } = useUserStore();

  const [isUserEnrolled, setIsUserEnrolled] = useState<boolean>(false);
  const [isPurchaseModal, setIsPurchaseModal] = useState<boolean>(false);

  const handleCourseNavigation = () => {
    if (!user) {
      navigate("/sign-in");
    } else {
      setIsPurchaseModal(true);
    }
  };

  const confirmPurchase = () => {
    console.log(`Purchasing course: ${course.title}`);
    setIsPurchaseModal(false);
    // TODO: Handle actual purchase logic (API request, payment, etc.)
  };

  useEffect(() => {
    const checkUserEnrolled = () => {
      if (user && course.enrolledStudents.includes(user._id)) {
        setIsUserEnrolled(true);
      } else {
        setIsUserEnrolled(false);
      }
    };

    checkUserEnrolled();
  }, [user, backend, course]);
  return (
    <>
      <li className="course-card">
        <img
          // TODO: REMOVE THIS WHEN CREATING THE BACKEND
          onClick={() => setIsPurchaseModal(true)}
          src={`${backend}/${course.image}`}
          width={261}
          height={146.81}
          alt={course.title}
          loading="lazy"
        />
        <div className="upper">
          <h2 className="course-title">{course.title}</h2>
          <p className="course-duration">
            <FaClock /> {course.duration}
          </p>
          <div className="teacher-info">
            <div className="teacher-initials">
              {course.teacher.fullname?.split(" ")[0][0]}
            </div>
            <div className="teacher-divider">
              <p className="teacher-category">
                من
                <span className="hovered"> {course.teacher.fullname} </span>
                موجود في
                <span className="hovered"> {course.category.name}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="card-footer">
          {isUserEnrolled ? (
            <Link to="/course/:id" className="btn enroll-btn enrolled">
              الالتحاق
            </Link>
          ) : (
            <div className="not-purchased">
              <button
                type="button"
                onClick={handleCourseNavigation}
                className="btn enroll-btn"
              >
                سجل الآن
              </button>
              <p className="price">$ {course.price.toFixed(2)}</p>
            </div>
          )}
        </div>
      </li>

      {/* Purchase Confirmation Modal */}
      {isPurchaseModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-title">تأكيد الشراء</h2>
            <p className="modal-text">
              هل أنت متأكد أنك تريد شراء الدورة <strong>{course.title}</strong>{" "}
              مقابل{" "}
              <span className="modal-price">$ {course.price.toFixed(2)}</span>؟
            </p>
            <div className="modal-actions">
              <button className="btn btn-confirm" onClick={confirmPurchase}>
                تأكيد
              </button>
              <button
                className="btn btn-cancel"
                onClick={() => setIsPurchaseModal(false)}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseCard;
