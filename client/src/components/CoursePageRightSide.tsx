import "../css/CoursePageRightSide.css";

import ICourse from "../interfaces/ICourse";

import { GiGraduateCap, GiNetworkBars } from "react-icons/gi";
import { FaClock, FaSync, FaLock } from "react-icons/fa";
import IContent from "../interfaces/IContent";

const CoursePageRightSide = ({
  course,
  unlockedVideos,
  setSelectedVideo,
}: {
  course: ICourse | null;
  unlockedVideos: number[];
  setSelectedVideo: (video: IContent) => void;
}) => {
  const backend = import.meta.env.VITE_BACKEND;
  const removeFileExtension = (filename: string | undefined) => {
    return filename?.split(".").slice(0, -1).join(".") || filename;
  };

  // Handles video selection
  const handleSelectVideo = (video: IContent, index: number) => {
    if (unlockedVideos.includes(index)) {
      setSelectedVideo(video);
    }
  };

  return (
    <div className="course-viewer-right-side">
      {/* videos playlist */}
      <div className="course-viewer-playlist-container">
        <h2 className="course-viewer-playlist-title">المحتوى</h2>
        <ul className="course-viewer-playlist">
          {course?.content?.map((video, index) => {
            const isUnlocked = unlockedVideos.includes(index);
            return (
              <li
                key={index}
                onClick={() => isUnlocked && handleSelectVideo(video, index)}
                className={`course-viewer-playlist-item${
                  isUnlocked ? "" : " locked"
                }`}
                style={{
                  cursor: isUnlocked ? "pointer" : "not-allowed",
                  opacity: isUnlocked ? 1 : 0.5,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {!isUnlocked && (
                  <FaLock style={{ marginLeft: 6, color: "#888" }} />
                )}
                <span style={{ display: "block", width: "100%" }}>
                 📽️ {removeFileExtension(video.title)}
                </span>
                <span style={{ display: "block", width: "100%" }}>
                  {video.material && (
                    <a
                      href={`${backend}/${video.material}`}
                      download
                      className="material-link"
                    >
                      📦 تحميل المواد الإضافية
                    </a>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* course meta information  */}
      <div className="course-viewer-meta-information">
        <ul className="course-viewer-meta-list">
          <li className="course-viewer-meta-list-item">
            <GiNetworkBars style={{ color: "var(--purple)" }} />
            {course?.level}
          </li>

          <li className="course-viewer-meta-list-item">
            <GiGraduateCap style={{ color: "var(--purple)" }} />
            {course?.enrolledStudents?.length} مجموع الملتحقون
          </li>

          <li className="course-viewer-meta-list-item">
            <FaClock style={{ color: "var(--purple)" }} />
            {course?.duration}
          </li>

          <li className="course-viewer-meta-list-item">
            <FaSync style={{ color: "var(--purple)" }} />
            {course &&
              new Date(course.createdAt).toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
          </li>
        </ul>
      </div>

      {/* teacher name  */}
      <div className="course-viewer-teacher-name">
        <h2 className="course-viewer-teacher-name-title">الدورة بتقديم</h2>
        <p className="course-viewer-teacher-name-content">
          <span className="course-viewer-teacher-name-initials">
            {course?.teacher?.fullname?.split(" ")[0][0]}
          </span>
          {course?.teacher?.fullname}
        </p>
      </div>

      {/* requirements  */}
      <div className="course-viewer-requirements">
        <h2 className="course-viewer-requirements-title">المتطلبات</h2>
        <ul className="course-viewer-requirements-list">
          {course?.requirements[0]?.split("\n").map((requirement, index) => (
            <li key={index} className="course-viewer-requirements-list-item">
              {requirement}
            </li>
          ))}
        </ul>
      </div>

      {/* audience  */}
      <div className="course-viewer-audience">
        <h2 className="course-viewer-audience-title">الجمهور</h2>
        <ul className="course-viewer-audience-list">
          {course?.audience[0]?.split("\n").map((aud, index) => (
            <li key={index} className="course-viewer-audience-list-item">
              {aud}
            </li>
          ))}
        </ul>
      </div>

      {/* end of right side  */}
    </div>
  );
};

export default CoursePageRightSide;
