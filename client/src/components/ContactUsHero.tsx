import "../css/ContactUsHero.css";

import magnifier from "../assets/Website design-17.png";

const ContactUsHero = () => {
  return (
    <section className="contact-hero">
      <div className="contact-content">
        <h1 className="contact-title">علّم بسعادة</h1>

        <p className="contact-purple-text">
          لأنّ التّعليم رحلة ممتعة، نقدّم لك منصّة و خبرة تعليميّة
        </p>

        <p className="contact-yellow-text"> تفوق 10 سنوات</p>

        <p className="contact-purple-text">لجعل التّدريس متعة لك ولطلّابك.</p>
      </div>
      <img
        src={magnifier}
        alt="magnifier"
        loading="lazy"
        className="contact-magnifier"
        width={500}
      />
    </section>
  );
};

export default ContactUsHero;
