import "../css/TeacherShowCaseHero.css";

import magnifier from "../assets/Website design-11.png";

const TeacherShowCaseHero = () => {
  return (
    <section className="teacher-showcase-hero">
      <div className="teacher-showcase-content">
        <h1 className="teacher-showcase-title">المدربات</h1>

        <p className="teacher-showcase-purple-text">
          لأنّ التّعليم رحلة ممتعة، نقدّم لك منصّة و خبرة تعليميّة
        </p>

        <p className="teacher-showcase-yellow-text"> تفوق 10 سنوات</p>

        <p className="teacher-showcase-purple-text">
          لجعل التّدريس متعة لك ولطلّابك.
        </p>
      </div>
      <img
        src={magnifier}
        alt="magnifier"
        loading="lazy"
        className="teacher-showcase-magnifier"
        width={500}
      />
    </section>
  );
};

export default TeacherShowCaseHero;
