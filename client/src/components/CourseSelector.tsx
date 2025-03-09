import "../css/CourseSelector.css";

import { courses } from "../dummyData";
import CourseCard from "./CourseCard";
const course = courses[0];
const course1 = courses[1];

// TODO: FETCH COURSES FROM THE BACKEND

const CourseSelector = () => {
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

export default CourseSelector;
