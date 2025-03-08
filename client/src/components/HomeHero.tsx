import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const HomeHero = () => {
  return (
    <section className="wrapper home-hero">
      <h1 className="hero-title">علّم بسعادة: معنى أن يستأنس المعلم بمهنته.</h1>
      <p className="slogan">
        لأن التعليم ليس مجرد مهنة، بل رحلة تزهو بالاستئناس والاستمتاع، نقدم لك
        منصة متكاملة تقلص الفجوات بين النظرية والتطبيق، وتجمع بين الاستراتيجيات
        الفعالة، والموارد الجاهزة، والتدريب المستمر، والاستشارات الخاصة، وخبرات
        عمليّة تعليمية تفوق العشر سنوات، لتجعل من التدريس متعة لك ولطلابك!"
      </p>
      <div className="wrapper-horizontal hero-btns">
        <Link to="/courses" id="hero-start-learn">
          ابدأ التعلم <FaArrowLeft />
        </Link>
        <Link to="/sign-in" id="hero-discover">
          تسجيل الدخول
        </Link>
      </div>
    </section>
  );
};

export default HomeHero;
