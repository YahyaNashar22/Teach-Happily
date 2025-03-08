import "../css/LatestCourses.css";

import { courses } from "../dummyData";
import CourseCard from "./CourseCard";
const course = courses[0];

const LatestCourses = () => {
  return (
    <ul className="course-list">
      <CourseCard course={course} />
      <CourseCard course={course} />
      <CourseCard course={course} />
      <CourseCard course={course} />
      <CourseCard course={course} />
      <CourseCard course={course} />
      <CourseCard course={course} />
      <CourseCard course={course} />
    </ul>
  );
};

export default LatestCourses;
