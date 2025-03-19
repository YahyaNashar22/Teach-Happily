import "../css/HomeHeroNew.css";

import emoji from "../assets/home_bg.png";
import logo from "../assets/logo.png";

const HomeHeroNew = () => {
  return (
    <section className="new-home-hero">
      <div className="content">
        <img
          src={logo}
          alt="teach"
          loading="lazy"
          className="new-home-logo"
          width={500}
        />

        <p className="new-home-purple-text">
          لأنّ التّعليم رحلة ممتعة، نقدّم لك منصّة
        </p>

        <p className="new-home-yellow-text">وخبرة تعليميّة تفوق 10 سنوات</p>

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
