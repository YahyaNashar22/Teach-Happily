import "../css/CourseCard.css";

import { FaClock, FaHeart, FaRegHeart } from "react-icons/fa";
import ICourse from "../interfaces/ICourse";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store";
import { useEffect, useState } from "react";
import axios from "axios";
import IFeedback from "../interfaces/IFeedback";
import StarRating from "./StarRating";

const CourseCard = ({ course }: { course: ICourse }) => {
  const backend = import.meta.env.VITE_BACKEND;

  const { user } = useUserStore();
  const navigate = useNavigate();

  const [isUserEnrolled, setIsUserEnrolled] = useState<boolean>(false);
  const [inWishlist, setInWishlist] = useState<boolean>(false);
  const [feedbacks, setFeedbacks] = useState<IFeedback[]>([]);
  const [feedbackLoader, setFeedbackLoader] = useState<boolean>(false);

  const courseTrackAndShowCase = async (course: ICourse) => {
    try {
      await axios.post(`${backend}/course/track`, { courseId: course._id });
      navigate(`/course-showcase/${course.slug}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCourseNavigation = () => {
    return isUserEnrolled
      ? navigate(`/course/${course.slug}`)
      : courseTrackAndShowCase(course);
  };

  useEffect(() => {
    const checkUserEnrolled = () => {
      if (user && course.enrolledStudents.includes(user._id)) {
        setIsUserEnrolled(true);
      } else {
        setIsUserEnrolled(false);
      }
    };

    checkUserEnrolled();
  }, [user, backend, course]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await axios.put(
        `${backend}/user/course-wishlist`,
        {
          userId: user?._id,
          courseId: course._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setInWishlist(res.data.message === "Added to wishlist");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!course) return;
    const fetchFeedbacks = async () => {
      setFeedbackLoader(true);
      try {
        const res = await axios.get(`${backend}/feedback/${course._id}`);

        setFeedbacks(res.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setFeedbackLoader(false);
      }
    };

    fetchFeedbacks();
  }, [backend, course, user]);

  const averageRating = feedbacks.length
    ? Math.round(
        feedbacks.reduce((acc, f) => acc + (f.rating || 0), 0) /
          feedbacks.length
      )
    : 0;
  return (
    <>
      <li
        className="course-card"
        onClick={handleCourseNavigation}
        style={{
          backgroundImage: `url(${backend}/${course.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {user && !course.enrolledStudents.includes(user._id) && (
          <div className="wishlist-icon" onClick={toggleWishlist}>
            {inWishlist ? <FaHeart color="var(--yellow)" /> : <FaRegHeart />}
          </div>
        )}

        {!feedbackLoader && (
          <div className="card-rating-container">
            <StarRating rating={averageRating} />
          </div>
        )}
        <div className="upper">
          <h2 className="course-title">{course.title}</h2>
 
        </div>

        <div className="card-footer">
          {isUserEnrolled ? (

            <p className="course-duration">
              <FaClock /> {course.duration}
            </p>
          ) : (
            <div className="not-purchased">
      
              <p className="course-duration">
                <FaClock /> {course.duration}
              </p>
              <p className="price">
                {course.price === 0
                  ? "مجاني"
                  : `QR ${Number(course.price).toFixed(2)}`}
              </p>
            </div>
          )}

          <div className="hover-sheet">
            <div className="hover-sheet-small-border" />
            <p>تقديم {course.teacher.fullname}</p>
     
          </div>
        </div>
      </li>
    </>
  );
};

export default CourseCard;
