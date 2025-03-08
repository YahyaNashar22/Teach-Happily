import "../css/HomeTutorsBlock.css";

import { Link } from "react-router-dom";

const HomeTutorsBlock = () => {
  return (
    <section className="tutors-block">
      <div className="tutors-right">
        <h1 className="section-title">
          نحن هنا لدعم المعلّمات في رحلتهم التعليمية
        </h1>
        <p className="text-grey">
          في علّم بسعادة, نقدّم لكم مجموعة واسعة من الدّورات التّدريبية التي
          تهدف إلى تطوير مهارات المعلّمات وتعزيز قدرتهم على تقديم تعليم متميز
        </p>
      </div>
      <Link to="/tutors" className="btn" id="tutors-btn">
        مدرباتنا
      </Link>
    </section>
  );
};

export default HomeTutorsBlock;
