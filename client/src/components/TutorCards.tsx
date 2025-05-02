import { useEffect, useState } from "react";
import "../css/TutorCards.css";
import ITeacher from "../interfaces/ITeacher";
import axios from "axios";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";

import mails from "../assets/Vector Smart Object.png";
import mag from "../assets/Website design-13.png";

const TutorCards = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [teachers, setTeachers] = useState<ITeacher[]>([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await axios.get(`${backend}/teacher`);
        setTeachers(res.data.payload || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, [backend]);
  return (
    <section className="tutor-cards-section">
      <img
        src={mails}
        width={300}
        alt="messages"
        loading="lazy"
        className="testimonials-section-container-mails-img"
      />

      <img
        src={mag}
        width={300}
        alt="messages"
        loading="lazy"
        className="testimonials-section-container-mag-img"
      />
      {loading ? (
        <Loading />
      ) : teachers.length > 0 ? (
        <div className="tutor-cards-list-container">
          <h1 className="tutor-cards-list-container-title">
            تعرّف على فريقنا من المحترفين{" "}
          </h1>

          <ul className="tutor-card-list">
            {teachers.map((teacher) => {
              return (
                <li
                  key={teacher._id}
                  className="tutor-card"
                  onClick={() => navigate(`/teacher-showcase/${teacher._id}`)}
                >
                  <div className="tutor-card-upper"></div>
                  <div
                    style={{
                      backgroundImage: teacher.image
                        ? `url(${backend}/${teacher.image})`
                        : "var(--gradient-overlay)",
                      backgroundSize: teacher.image ? "cover" : "auto",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                    className="tutor-card-teacher-img"
                  ></div>
                  <h3 className="teacher-name">{teacher.fullname}</h3>
                  <p className="teacher-profession">{teacher.profession}</p>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <p className="no-tutors-message">لا توجد مدربات متاحة حاليًا</p>
      )}
    </section>
  );
};

export default TutorCards;
