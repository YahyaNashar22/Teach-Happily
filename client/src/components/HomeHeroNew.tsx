import "../css/HomeHeroNew.css";

import emoji from "../assets/home_bg.png";
import logo from "../assets/Website design-01.png";

const HomeHeroNew = () => {
  return (
    <section className="new-home-hero">
      <div className="new-home-content">
        <img
          src={logo}
          alt="trophy"
          loading="lazy"
          className="new-home-trophy"
          width={200}
        />

        <h1 className="new-home-title">علّم بسعادة</h1>

        <p className="new-home-purple-text">
          لأنّ التّعليم رحلة ممتعة، نقدّم لك منصّة و خبرة تعليميّة
        </p>

        <p className="new-home-yellow-text"> تفوق 10 سنوات</p>

        <p className="new-home-purple-text">لجعل التّدريس متعة لك ولطلّابك.</p>
      </div>
      <img
        src={emoji}
        alt="emoji"
        loading="lazy"
        className="new-home-emoji"
        width={500}
      />
    </section>
  );
};

export default HomeHeroNew;
