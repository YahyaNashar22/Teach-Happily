import { Link } from "react-router-dom";
import "../css/Testimonials.css";
import { useUserStore } from "../store";
import { useEffect, useState } from "react";
import { testimonials } from "../dummyData";

const Testimonials = () => {
  const { user } = useUserStore();

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
    <section className="testimonials-section-container">
      <div className="testimonials-right">
        <p className="soft-text">شهادات العملاء</p>
        <h3 className="bold-text">آراء الطلاب</h3>
        <p className="soft-text">خلال تعاوننا، أثبت موظفو الشركة أنفسهم</p>
        <Link
          to={user ? "/courses" : "/sign-in"}
          className="btn testimonials-signin"
        >
          ابدأ التعلم
        </Link>
      </div>
      <div className="testimonials-left">
        <div className="testimonial-content">
          <p className="testimonial-text">
            {testimonials[currentIndex].content}
          </p>
          {/* <p className="student-name">
            {testimonials[currentIndex].studentName}
          </p> */}
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
