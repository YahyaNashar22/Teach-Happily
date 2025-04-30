import "../css/Testimonials.css";
import { useEffect, useState } from "react";
import { testimonials } from "../dummyData";

import messages from "../assets/Website design-5.png";
import mails from "../assets/Vector Smart Object.png";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Switch slides automatically every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    // <section className="testimonials-section-container">
    //   <img
    //     src={mails}
    //     width={300}
    //     alt="messages"
    //     loading="lazy"
    //     className="testimonials-section-container-mails-img"
    //   />
    //   <div className="testimonials-right">
    //     {/* <p className="soft-text">شهادات العملاء</p>
    //     <h3 className="bold-text">آراء الطلاب</h3>
    //     <p className="soft-text">خلال تعاوننا، أثبت موظفو الشركة أنفسهم</p>
    //     <Link
    //       to={user ? "/courses" : "/sign-in"}
    //       className="btn testimonials-signin"
    //     >
    //       ابدأ التعلم
    //     </Link> */}
    //     <img
    //       src={messages}
    //       width={300}
    //       alt="messages"
    //       loading="lazy"
    //       className="testimonials-section-container-messages-img"
    //     />
    //   </div>
    //   <div className="testimonials-left">
    //     <div className="testimonial-content">
    //       <p className="testimonial-text">
    //         {testimonials[currentIndex].content}
    //       </p>
    //       {/* <p className="student-name">
    //         {testimonials[currentIndex].studentName}
    //       </p> */}
    //     </div>

    //     <div className="dots">
    //       {testimonials.map((_, index) => (
    //         <span
    //           key={index}
    //           className={`dot ${index === currentIndex ? "active" : ""}`}
    //           onClick={() => handleDotClick(index)}
    //         />
    //       ))}
    //     </div>
    //   </div>
    // </section>

    <section className="testimonials-section-container">
      <img
        src={mails}
        width={300}
        alt="messages"
        loading="lazy"
        className="testimonials-section-container-mails-img"
      />
      <div className="testimonials-right">
        <img
          src={messages}
          width={300}
          alt="messages"
          loading="lazy"
          className="testimonials-section-container-messages-img"
        />
      </div>
      <div className="testimonials-left">
        <div className="testimonial-content">
          <p className="testimonial-text">
            {testimonials[currentIndex].content}
          </p>
        </div>

        <div className="dots">
          {testimonials.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
