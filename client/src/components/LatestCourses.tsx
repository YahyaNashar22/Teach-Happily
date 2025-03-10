import { useEffect, useState } from "react";
import "../css/LatestCourses.css";

import CourseCard from "./CourseCard";
import ICourse from "../interfaces/ICourse";
import axios from "axios";
import Loading from "./Loading";

// TODO: FETCH COURSES FROM THE BACKEND

const LatestCourses = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${backend}/course/get-latest`);

        setCourses(res.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [backend]);
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

export default LatestCourses;
