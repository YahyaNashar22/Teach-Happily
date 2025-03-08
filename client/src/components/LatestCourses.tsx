import "../css/LatestCourses.css";

import { courses } from "../dummyData";
import CourseCard from "./CourseCard";
const course = courses[0];
const course1 = courses[1];

const LatestCourses = () => {
  return (
    <ul className="course-list">
      <CourseCard course={course} />
      <CourseCard course={course} />
      <CourseCard course={course} />
      <CourseCard course={course1} />
      <CourseCard course={course} />
      <CourseCard course={course1} />
      <CourseCard course={course1} />
      <CourseCard course={course} />
    </ul>
  );
};

export default LatestCourses;
