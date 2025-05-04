import "../css/TutorsHero.css";

import magnifier from "../assets/Website design-08.png";

const TutorsHero = () => {
  return (
    <section className="tutors-hero">
      <div className="tutors-content">
        <h1 className="tutors-title"> المدربون و المستشارون</h1>

        <p className="tutors-purple-text">
          لأنّ التّعليم رحلة ممتعة، نقدّم لك منصّة و خبرة تعليميّة
        </p>

        <p className="tutors-yellow-text"> تفوق 10 سنوات</p>

        <p className="tutors-purple-text">لجعل التّدريس متعة لك ولطلّابك.</p>
      </div>
      <img
        src={magnifier}
        alt="magnifier"
        loading="lazy"
        className="tutors-magnifier"
        width={500}
      />
    </section>
  );
};

export default TutorsHero;
