import "../css/CourseCard.css";

import { FaClock } from "react-icons/fa";
import ICourse from "../interfaces/ICourse";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../store";
import { useEffect, useState } from "react";

const CourseCard = ({ course }: { course: ICourse }) => {
  const backend = import.meta.env.VITE_BACKEND;

  const { user } = useUserStore();
  const navigate = useNavigate();

  const [isUserEnrolled, setIsUserEnrolled] = useState<boolean>(false);

  const handleCourseNavigation = () => {
    return isUserEnrolled
      ? navigate(`/course/${course.slug}`)
      : navigate(`/course-showcase/${course.slug}`);
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
      <li className="course-card" onClick={handleCourseNavigation}>
        <img
          src={`${backend}/${course.image}`}
          width={320}
          height={200}
          alt={course.title}
          loading="lazy"
          className="course-card-image"
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
            <Link
              to={`/course/${course.slug}`}
              className="btn enroll-btn enrolled "
            >
              الالتحاق
            </Link>
          ) : (
            <div className="not-purchased">
              <Link
                to={`/course-showcase/${course.slug}`}
                className="btn enroll-btn "
              >
                عرض المحتوى
              </Link>
              <p className="price">$ {course.price.toFixed(2)}</p>
            </div>
          )}
        </div>
      </li>
    </>
  );
};

export default CourseCard;
