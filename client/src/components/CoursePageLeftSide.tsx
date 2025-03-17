/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import "../css/CoursePageLeftSide.css";
import IContent from "../interfaces/IContent";
import ICourse from "../interfaces/ICourse";
import { useUserStore } from "../store";
import axios from "axios";

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

  // Handle video progress tracking
  const handleTimeUpdate = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    const videoElement = event.currentTarget;
    setVideoProgress((prevProgress) => ({
      ...prevProgress,
      [selectedVideo?.url || ""]: videoElement.currentTime,
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
  return (
    <div className="course-viewer-left-side-wrapper">
      <div className="course-video-container">
        <video
          key={selectedVideo?.url} // Force re-render when the video changes
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
          سشيشبشي بسبشسي شبش لشل شب سيشس بشي بشيبلصق لقصاقا صق لص صقل صثل شيب ش
          لث لثص لص ثلصث يش ي ب
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
    </div>
  );
};

export default CoursePageLeftSide;
