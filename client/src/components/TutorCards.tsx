import "../css/TutorCards.css";
import { tutors } from "../dummyData";

const TutorCards = () => {
  return (
    <section className="tutor-cards-section">
      <ul className="tutor-card-list">
        {tutors.map((teacher) => {
          return (
            <li
              key={teacher._id}
              className="tutor-card"
              style={{
                background: `${
                  teacher.image && teacher.image !== ""
                    ? `url(${teacher.image})`
                    : `var(--gradient-overlay)`
                }`,
              }}
            >
              <h3 className="teacher-name">{teacher.fullname}</h3>
              <p className="teacher-profession">{teacher.profession}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default TutorCards;
