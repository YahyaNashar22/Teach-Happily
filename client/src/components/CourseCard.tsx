import "../css/CourseCard.css";

import { FaClock } from "react-icons/fa";
import ICourse from "../interfaces/ICourse";

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
    </li>
  );
};

export default CourseCard;
