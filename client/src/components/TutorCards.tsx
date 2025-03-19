import { useEffect, useState } from "react";
import "../css/TutorCards.css";
import ITeacher from "../interfaces/ITeacher";
import axios from "axios";
import Loading from "./Loading";

const TutorCards = () => {
  const backend = import.meta.env.VITE_BACKEND;
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
      {loading ? (
        <Loading />
      ) : teachers.length > 0 ? (
        <ul className="tutor-card-list">
          {teachers.map((teacher) => {
            return (
              <li
                key={teacher._id}
                className="tutor-card"
                style={{
                  backgroundImage: teacher.image
                    ? `url(${backend}/${teacher.image})`
                    : "var(--gradient-overlay)",
                  backgroundSize: teacher.image ? "cover" : "auto",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <h3 className="teacher-name">{teacher.fullname}</h3>
                <p className="teacher-profession">{teacher.profession}</p>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="no-tutors-message">لا توجد مدربات متاحة حاليًا</p>
      )}
    </section>
  );
};

export default TutorCards;
