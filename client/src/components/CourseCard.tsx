import "../css/CourseCard.css";

import { FaClock } from "react-icons/fa";
import ICourse from "../interfaces/ICourse";
import { Link } from "react-router-dom";

const CourseCard = ({ course }: { course: ICourse }) => {
  return (
    <li className="course-card">
      <img
        src={course.image}
        width={261}
        height={146.81}
        alt={course.title}
        loading="lazy"
      />
      <h2 className="course-title">{course.title}</h2>
      <p className="course-duration">
        <FaClock /> {course.duration}
      </p>
      <div className="teacher-info">
        <div className="teacher-initials"></div>
        <p className="teacher-category">
          من {course.teacherName} موجود في {course.category.name}
        </p>
      </div>

      <Link to="course/:slug" className="btn enroll-btn">سجل الآن</Link>
    </li>
  );
};

export default CourseCard;
