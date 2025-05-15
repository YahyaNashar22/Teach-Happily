import "../css/CoursesHero.css";

import magnifier from "../assets/Website design-12.png";

const CoursesHero = () => {
  return (
    <section className="courses-hero">
      <div className="courses-content">
        <h1 className="courses-title">الدورات</h1>

        <p className="courses-purple-text">
          لأنّ التّعليم رحلة ممتعة، نقدّم لك منصّة و خبرة تعليميّة
        </p>

        <p className="courses-yellow-text"> تفوق 10 سنوات</p>

        <p className="courses-purple-text">لجعل التّدريس متعة لك ولطلّابك.</p>
      </div>
      <img
        src={magnifier}
        alt="magnifier"
        loading="lazy"
        className="courses-magnifier"
        width={500}
      />
    </section>
  );
};

export default CoursesHero;
