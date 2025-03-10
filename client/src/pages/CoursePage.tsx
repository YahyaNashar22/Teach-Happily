import "../css/CoursePage.css";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ICourse from "../interfaces/ICourse";
import axios from "axios";
import Loading from "../components/Loading";
import CoursePageRightSide from "../components/CoursePageRightSide";

const CoursePage = () => {
  const { slug } = useParams();
  const backend = import.meta.env.VITE_BACKEND;

  const [course, setCourse] = useState<ICourse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${backend}/course/get/${slug}`);
        setCourse(res.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [backend, slug]);
  return (
    <main>
      {loading && course === null ? (
        <Loading />
      ) : (
        <div className="course-viewer">
          {/* upper secion in which the title and the category */}
          <div className="course-viewer-title-section">
            <h1 className="course-viewer-title">{course?.title}</h1>
            <p className="course-viewer-category">
              الخانة: <span className="course-viewer-black">{course?.category?.name}</span>
            </p>
          </div>

          {/* rest of the page where the content and information are */}
          <div className="course-viewer-content">
            {/* right side columns in which exist the content, meta information */}
            <CoursePageRightSide course={course} />

            <div className="course-viewer-left-side"></div>
          </div>
        </div>
      )}
    </main>
  );
};

export default CoursePage;
