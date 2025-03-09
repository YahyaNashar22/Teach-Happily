import { useEffect, useState, useRef } from "react";
import "../css/HomeNumbers.css";

const numbersData = [
  { value: 120, suffix: "+", label: "الجامعات" },
  { value: 400, suffix: "+", label: "ساعات الدراسة" },
  { value: 10_000, suffix: "+", label: "الخريجين" },
  { value: 30, suffix: "+", label: "معلمين مؤهلين" },
];

const HomeNumbers = () => {
  const [counts, setCounts] = useState(numbersData.map(() => 0));
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateNumbers();
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateNumbers = () => {
    numbersData.forEach((item, index) => {
      let start = 0;
      const step = Math.ceil(item.value / 100); // Adjust speed
      const interval = setInterval(() => {
        start += step;
        setCounts((prevCounts) => {
          const newCounts = [...prevCounts];
          newCounts[index] = start > item.value ? item.value : start;
          return newCounts;
        });

        if (start >= item.value) clearInterval(interval);
      }, 30); // Animation speed
    });
  };

  return (
    <section className="numbers-section" ref={sectionRef}>
      {numbersData.map((item, index) => (
        <div key={index} className="number-box">
          <h2 className="number">
            {item.suffix}
            {counts[index]}
          </h2>
          <p className="label">{item.label}</p>
        </div>
      ))}
    </section>
  );
};

export default HomeNumbers;
