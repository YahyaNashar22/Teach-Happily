import { FC, useEffect, useState } from "react";
import "../css/CourseSelector.css";

import CourseCard from "./CourseCard";
import ICourse from "../interfaces/ICourse";
import axios from "axios";
import Loading from "./Loading";
import ICourseSelector from "../interfaces/ICourseSelector";

// TODO: FETCH COURSES FROM THE BACKEND

const CourseSelector: FC<ICourseSelector> = ({
  category,
  priceType,
  page,
  setTotalPages,
}) => {
  const backend = import.meta.env.VITE_BACKEND;
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await axios.post(
          `${backend}/course/get-all`,
          {
            category,
            priceType,
            page,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setCourses(res.data.payload);
        // setTotalPages(res.data.payload.totalPages);
        setTotalPages(3);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [backend, category, priceType, page, setTotalPages]);
  return (
    <>
      {loading ? (
        <div className="courses-loading">
          <Loading />
        </div>
      ) : (
        <ul className="course-list">
          {courses.length > 0 ? (
            courses.map((course) => {
              return <CourseCard key={course._id} course={course} />;
            })
          ) : (
            <p className="no-courses">لا توجد دورات حاليا</p>
          )}
        </ul>
      )}
    </>
  );
};

export default CourseSelector;
