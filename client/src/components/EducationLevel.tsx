import "../css/EducationLEvel.css";

import img1 from "../assets/education-img.jpg";
import img2 from "../assets/education-img-2.jpg";

const EducationLevel = () => {
  return (
    <section className="education-level-section">
      <div className="education-level-right">
        <p className="education-prefix">مناهج قطر</p>
        <h2 className="education-title">اختار المرحلة الدراسية المناسبة لك</h2>
        <ul className="education-list">
          <li className="education-list-item">مرحلة الإبتدائي</li>
          <li className="education-list-item">مرحلة المتوسط</li>
          <li className="education-list-item">مرحلة الثانوي</li>
        </ul>
      </div>
      <div className="education-level-left">
        <div className="education-dots">
          {[...Array(25)].map((_, index) => (
            <div key={index} className="dot"></div>
          ))}
        </div>
        <img
          src={img1}
          alt="education illustration"
          loading="lazy"
          className="img-1"
        />
        <img
          src={img2}
          alt="education illustration"
          loading="lazy"
          className="img-2"
        />
      </div>
    </section>
  );
};

export default EducationLevel;
