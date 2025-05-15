import "../css/Courses.css";

import { useState } from "react";

import CategorySelector from "./CategorySelector";
import CourseSelector from "./CourseSelector";

const Courses = () => {
  const [category, setCategory] = useState<string>("");
  const [priceType, setPriceType] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);


  return (
    <section className="courses-section">
      <CategorySelector setCategory={setCategory} setPriceType={setPriceType} setPage={setPage} page={page} totalPages={totalPages} />
      <CourseSelector
        category={category}
        priceType={priceType}
        page={page}
        setTotalPages={setTotalPages}
      />
    </section>
  );
};

export default Courses;
