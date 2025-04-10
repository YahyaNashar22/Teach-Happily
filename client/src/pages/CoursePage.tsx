import "../css/CoursePage.css";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ICourse from "../interfaces/ICourse";
import axios from "axios";
import Loading from "../components/Loading";
import CoursePageRightSide from "../components/CoursePageRightSide";
import CoursePageLeftSide from "../components/CoursePageLeftSide";
import IContent from "../interfaces/IContent";
import { useUserStore } from "../store";

const CoursePage = () => {
  const { slug } = useParams();
  const { user } = useUserStore();
  const navigate = useNavigate();
  const backend = import.meta.env.VITE_BACKEND;

  const [course, setCourse] = useState<ICourse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [unlockedVideos, setUnlockedVideos] = useState<number[]>([0]); // First video unlocked by default

  const [selectedVideo, setSelectedVideo] = useState<IContent | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${backend}/course/get/${slug}`);

        if (!res.data.payload.enrolledStudents.includes(user?._id)) {
          navigate("*");
        }

        setCourse(res.data.payload);

        // Set the first video as the default selected one
        if (res.data.payload?.content?.length > 0) {
          setSelectedVideo(res.data.payload.content[0]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [backend, slug, user, navigate]);
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
              الخانة:{" "}
              <span className="course-viewer-black">
                {course?.category?.name}
              </span>
            </p>
          </div>

          {/* rest of the page where the content and information are */}
          <div className="course-viewer-content">
            {/* right side columns in which exist the content, meta information */}
            <CoursePageRightSide
              course={course}
              unlockedVideos={unlockedVideos}
              setSelectedVideo={setSelectedVideo}
            />

            <div className="course-viewer-left-side">
              <CoursePageLeftSide
                selectedVideo={selectedVideo}
                course={course}
                setUnlockedVideos={setUnlockedVideos}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default CoursePage;
