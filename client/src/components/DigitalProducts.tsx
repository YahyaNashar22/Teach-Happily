import "../css/DigitalProducts.css";

import { useState } from "react";
import CategorySelector from "./CategorySelector";
import CourseSelector from "./CourseSelector";

const DigitalProducts = () => {
  const [category, setCategory] = useState<string>("");
  const [priceType, setPriceType] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  return (
    <section className="digital-products-section">
      <CategorySelector
        setCategory={setCategory}
        setPriceType={setPriceType}
        setPage={setPage}
        page={page}
        totalPages={totalPages}
      />
      <CourseSelector
        category={category}
        priceType={priceType}
        page={page}
        setTotalPages={setTotalPages}
        digital={true}
      />
    </section>
  );
};

export default DigitalProducts;
