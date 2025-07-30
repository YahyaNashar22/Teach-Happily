import "../css/HomeTutorsBlock.css";

// import { Link } from "react-router-dom";
import laptop from "../assets/Website design-11.png";

const HomeTutorsBlock = () => {
  return (
    <section className="tutors-block">
      <div className="tutors-right">
        <h1 className="section-title">
          نحن هنا لدعم المعلّمين في رحلتهم التعليمية
        </h1>
        <p className="text-grey">
          في علّم بسعادة, نقدّم لكم مجموعة واسعة من الدّورات التّدريبية التي
          تهدف إلى تطوير مهارات المعلّمين وتعزيز قدرتهم على تقديم تعليم متميز
        </p>
      </div>
      {/* <Link to="/tutors" className="btn" id="tutors-btn">
        مدرباتنا
      </Link> */}
      <img
        src={laptop}
        alt="laptop"
        loading="lazy"
        className="tutors-laptop"
        width={400}
      />
    </section>
  );
};

export default HomeTutorsBlock;
