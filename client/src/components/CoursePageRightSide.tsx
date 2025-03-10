import "../css/CoursePageRightSide.css";

import ICourse from "../interfaces/ICourse";

import { GiGraduateCap, GiNetworkBars } from "react-icons/gi";
import { FaClock, FaSync } from "react-icons/fa";

const CoursePageRightSide = ({ course }: { course: ICourse | null }) => {
  return (
    <div className="course-viewer-right-side">
      {/* videos playlist */}
      <div className="course-viewer-playlist-container">
        <h2 className="course-viewer-playlist-title">المحتوى</h2>
        <ul className="course-viewer-playlist">
          {course?.content?.map((video, index) => {
            return (
              <li key={index} className="course-viewer-playlist-item">
                {video.title}
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
            {course && new Date(course.createdAt).toLocaleDateString("ar-EG", {
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
