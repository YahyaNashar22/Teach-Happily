import "../css/Courses.css";
import CategorySelector from "./CategorySelector";
import CourseSelector from "./CourseSelector";

const Courses = () => {
  return (
    <section className="courses-section">
      <CourseSelector />
      <CategorySelector />
    </section>
  );
};

export default Courses;
