import "../css/TeacherShowCase.css";

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import ITeacher from "../interfaces/ITeacher";
import axios from "axios";
import Loading from "../components/Loading";
import ICourse from "../interfaces/ICourse";
import CourseCard from "../components/CourseCard";
import TeacherShowCaseHero from "../components/TeacherShowCaseHero";

const TeacherShowCase = () => {
  const { id } = useParams();
  const backend = import.meta.env.VITE_BACKEND;

  const [teacher, setTeacher] = useState<ITeacher | null>(null);
  const [courses, setCourses] = useState<ICourse[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [selectedTab, setSelectedTab] = useState<"Info" | "Courses">("Courses");

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backend}/teacher/${id}`);

        setTeacher(res.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [backend, id]);

  useEffect(() => {
    if (!teacher) return;

    const fetchTeacherCourses = async () => {
      try {
        setLoading(true);
        const res = await axios.post(
          `${backend}/course/get-teacher-courses`,
          {
            teacherId: teacher._id,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setCourses(res.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherCourses();
  }, [backend, teacher]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <main>
          <TeacherShowCaseHero />
          <section className="teacher-viewer-wrapper">
            {/* upper section with profile picture  */}
            <div className="teacher-viewer-profile-img-section">
              <img
                src={`${backend}/${teacher?.image}`}
                loading="lazy"
                alt={teacher?.fullname}
                className="teacher-viewer-image"
              />
              <div>
                <h2 className="teacher-viewer-name">{teacher?.fullname}</h2>
                <p className="teacher-viewer-profession">
                  {teacher?.profession}
                </p>
              </div>
            </div>

            {/* tab selector */}
            <div className="teacher-viewer-nav-selector">
              <p
                className={
                  selectedTab === "Info"
                    ? "teacher-viewer-nav-option teacher-viewer-nav-option-active"
                    : "teacher-viewer-nav-option"
                }
                onClick={() => setSelectedTab("Info")}
              >
                الرئيسية
              </p>
              <p
                className={
                  selectedTab === "Courses"
                    ? "teacher-viewer-nav-option teacher-viewer-nav-option-active"
                    : "teacher-viewer-nav-option"
                }
                onClick={() => setSelectedTab("Courses")}
              >
                الدورات
              </p>
            </div>

            {/* information about the teacher  */}
            {selectedTab === "Info" && (
              <div className="teacher-viewer-info-container">
                <h2 className="teacher-viewer-info-container-title">
                  عن المدرب
                </h2>

                <p className="teacher-viewer-info-container-section-description">
                  {teacher?.description}
                </p>

                {/* TODO: For now only description is needed */}
                {/* <ul className="teacher-viewer-info-container-section-description">
                  {teacher?.previousExperience.map((e, index) => {
                    return (
                      <li
                        key={index}
                        className="teacher-viewer-info-container-section-description-prev-work"
                      >
                        {e}
                      </li>
                    );
                  })}
                </ul> */}
              </div>
            )}

            {/* courses provided by the teacher */}
            {selectedTab === "Courses" && (
              <div className="teacher-viewer-courses-container">
                <h2 className="teacher-viewer-courses-container-title">
                  الدورات
                </h2>
                {courses.length === 0 ? (
                  <p className="teacher-viewer-courses-no-content">
                    لا توجد دروس بعد
                  </p>
                ) : (
                  <ul className="teacher-viewer-courses">
                    {courses.map((c) => {
                      return <CourseCard key={c._id} course={c} />;
                    })}
                  </ul>
                )}
              </div>
            )}
          </section>
        </main>
      )}
    </>
  );
};

export default TeacherShowCase;
