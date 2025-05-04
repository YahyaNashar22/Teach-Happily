import "../css/AboutUsHero.css";

import magnifier from "../assets/Website design-10.png";

const AboutUsHero = () => {
  return (
    <section className="about-us-hero">
      <div className="about-us-content">
        <h1 className="about-us-title"> معلومات عنا</h1>

        <p className="about-us-purple-text">
          لأنّ التّعليم رحلة ممتعة، نقدّم لك منصّة و خبرة تعليميّة
        </p>

        <p className="about-us-yellow-text"> تفوق 10 سنوات</p>

        <p className="about-us-purple-text">لجعل التّدريس متعة لك ولطلّابك.</p>
      </div>
      <img
        src={magnifier}
        alt="magnifier"
        loading="lazy"
        className="about-us-magnifier"
        width={500}
      />
    </section>
  );
};

export default AboutUsHero;
