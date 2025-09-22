import "../css/CourseShowCaseHero.css";

import magnifier from "../assets/Website design-14.png";

const ProductShowCaseHero = () => {
  return (
    <section className="course-showcase-hero">
      <div className="course-showcase-content">
        <h1 className="course-showcase-title">المنتجات الرقمية</h1>

        <p className="course-showcase-purple-text">
          لأنّ التّعليم رحلة ممتعة، نقدّم لك منصّة و خبرة تعليميّة
        </p>

        <p className="course-showcase-yellow-text"> تفوق 10 سنوات</p>

        <p className="course-showcase-purple-text">
          لجعل التّدريس متعة لك ولطلّابك.
        </p>
      </div>
      <img
        src={magnifier}
        alt="magnifier"
        loading="lazy"
        className="course-showcase-magnifier"
        width={500}
      />
    </section>
  );
};

export default ProductShowCaseHero;
