import "../css/HomeContactInfo.css";

import hands from "../assets/hands.png";

const HomeContactInfo = () => {
  return (
    <section className="contact-info-section">
      <div className="contact-info-container">
        <h2 className="contact-info-header">
          ابدء في تطوير مهاراتك اليوم!
          <span className="contact-info-purple">
            سجّل في إحدى دوراتنا التّدريبيّة عبر الموقع
          </span>
          واحصل على تدريب متميّز سيُحدِث فارقاً في مسيرتك التعليمية
        </h2>
        {/* <ul className="contact-info-fields">
          <li className="contact-info-field">
            <span className="info-bold">البريد الالكتروني: </span>
            <span className="info-soft">teachhappily@outlook.com</span>
          </li>

          <li className="contact-info-field">
            <span className="info-bold">الهاتف: </span>
            <span className="info-soft">+97450003499</span>
          </li>

          <li className="contact-info-field">
            <span className="info-bold">العنوان: </span>
            <span className="info-soft">قطر</span>
          </li>
        </ul> */}
      </div>

      {/* <div className="afro-container"> */}
      <img
        src={hands}
        width={500}
        alt="hands"
        loading="lazy"
        className="afro-container-hands"
      />
      {/* <div className="row-1">
          <p className="row-text">أفضل دورة تدريبية عبر الإنترنت</p>
          <img
            src={trophy}
            width={45}
            height={45}
            alt="trophy"
            loading="lazy"
            className="trophy"
          />
        </div>
        <div className="row-2">
          <p className="row-text">المعلمين الأكثر تأهيلا</p>

          <img
            src={badge}
            width={45}
            height={45}
            alt="badge"
            loading="lazy"
            className="badge"
          />
        </div>
        <div className="row-3">
          <p className="row-text">أكثر من 50 ألف طالب نشط</p>

          <img
            src={flag}
            width={45}
            height={45}
            alt="flag"
            loading="lazy"
            className="flag"
          />
        </div> */}
      {/* </div> */}
    </section>
  );
};

export default HomeContactInfo;
