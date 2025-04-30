/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import "../css/CoursePageLeftSide.css";
import IContent from "../interfaces/IContent";
import ICourse from "../interfaces/ICourse";
import { useUserStore } from "../store";
import axios from "axios";
import IFeedback from "../interfaces/IFeedback";
import StarRating from "./StarRating";

const CoursePageLeftSide = ({
  selectedVideo,
  course,
  setUnlockedVideos,
}: {
  selectedVideo: IContent | null;
  course: ICourse | null;
  setUnlockedVideos: (video: any) => void;
}) => {
  const backend = import.meta.env.VITE_BACKEND;

  const { user } = useUserStore();

  const [, setVideoProgress] = useState<Record<number, number>>({});

  const [feedbacks, setFeedbacks] = useState<IFeedback[]>([]);
  const [feedbackLoader, setFeedbackLoader] = useState<boolean>(false);

  const [newFeedback, setNewFeedback] = useState<string>("");
  const [newRating, setNewRating] = useState<number>(0);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Handle video progress tracking
  const handleTimeUpdate = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    const videoElement = event.currentTarget;
    const key = selectedVideo?.url ? selectedVideo.url.toString() : "";
    setVideoProgress((prevProgress) => ({
      ...prevProgress,
      [key]: videoElement.currentTime,
    }));
  };

  // Unlock next video when current one ends
  const handleVideoEnd = async () => {
    const currentIndex = course?.content.findIndex(
      (video) => video.url === selectedVideo?.url
    );
    if (
      currentIndex !== undefined &&
      currentIndex + 1 < (course?.content?.length || 0)
    ) {
      try {
        await axios.post(
          `${backend}/user/unlock-video`,
          {
            courseId: course?._id,
            userId: user?._id,
            videoIndex: currentIndex + 1, // the index of the next video to unlock
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Update the state to reflect the new unlocked video
        setUnlockedVideos((prev: any) => [...prev, currentIndex + 1]);
      } catch (error) {
        console.error("Failed to unlock video:", error);
      }
    }
  };

  useEffect(() => {
    if (course && user?._id) {
      const fetchUnlockedVideos = async () => {
        try {
          const res = await axios.get(`${backend}/user/get-unlocked-videos`, {
            params: { userId: user?._id, courseId: course?._id },
          });
          setUnlockedVideos(res.data.unlockedVideos);
        } catch (error) {
          console.error("Failed to fetch unlocked videos:", error);
        }
      };
      fetchUnlockedVideos();
    }
  }, [course, user, backend, setUnlockedVideos]);

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

  const addFeedback = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newFeedback || !newRating || !user || !course) return;
    setSubmitting(true);
    try {
      const res = await axios.post(`${backend}/feedback/create`, {
        userId: user._id,
        courseId: course._id,
        rating: newRating,
        content: newFeedback,
      });

      setFeedbacks((prev) => [res.data.payload, ...prev]);
      setNewFeedback("");
      setNewRating(0);
    } catch (err) {
      console.error("Error adding feedback:", err);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="course-viewer-left-side-wrapper">
      <div className="course-video-container">
        <video
          key={selectedVideo?.url?.toString()} // Force re-render when the video changes
          className="video-player"
          controls
          poster={
            course?.image instanceof File
              ? URL.createObjectURL(course.image)
              : course?.image
          }
          controlsList="nodownload"
          disablePictureInPicture
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnd}
        >
          {selectedVideo?.url && (
            <source src={`${backend}/${selectedVideo.url}`} type="video/mp4" />
          )}
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="course-viewer-course-description">
        <h2 className="course-viewer-description-tile">نبذة عن الدورة</h2>
        <p className="course-viewer-description-content">
          {course?.description}
        </p>
      </div>

      <div className="course-viewer-course-what-will-learn">
        <h2 className="course-viewer-what-will-learn-tile">ماذا ستتعلمي</h2>

        <ul className="course-viewer-what-will-learn-list">
          {course?.whatWillYouLearn[0]?.split("\n").map((learn, index) => (
            <li key={index} className="course-viewer-what-will-learn-list-item">
              {learn}
            </li>
          ))}
        </ul>
      </div>

      {/* Feedbacks section  */}
      <div className="course-left-side-feedback">
        <h2 className="course-left-side-feedback-header">التقييمات والآراء</h2>
        {feedbackLoader ? (
          <p>جار الحصول على البيانات</p>
        ) : feedbacks.length === 0 ? (
          <p className="course-left-side-loading-text">لا يوجد تقييمات</p>
        ) : (
          <ul className="course-left-side-feedback-list">
            {feedbacks.map((feedback) => {
              return (
                <li
                  key={feedback._id}
                  className="course-left-side-feedback-card"
                >
                  <p className="course-left-side-feedback-card-initials">
                    {feedback?.userId?.fullName?.split(" ")[0][0]}
                  </p>
                  <div className="course-left-side-feedback-card-text">
                    <p className="course-left-side-feedback-card-user-name">
                      {feedback?.userId.fullName}
                    </p>
                    <p className="course-left-side-feedback-card-date">
                      {new Date(feedback?.createdAt).toLocaleString("ar-EG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                    <StarRating rating={feedback?.rating || 0} />
                    <p className="course-left-side-feedback-card-content">
                      {feedback?.content}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {user && (
        <div className="course-left-side-add-feedback">
          <h3>أضف تقييمك</h3>
          <StarRating rating={newRating} setRating={setNewRating} />
          <textarea
            className="course-left-side-feedback-input"
            placeholder="اكتب تقييمك هنا..."
            value={newFeedback}
            onChange={(e) => setNewFeedback(e.target.value)}
          />
          <button
            className="course-left-side-feedback-submit"
            onClick={addFeedback}
            disabled={submitting}
          >
            {submitting ? "جاري الإرسال..." : "إرسال التقييم"}
          </button>
        </div>
      )}
    </div>
  );
};

export default CoursePageLeftSide;
