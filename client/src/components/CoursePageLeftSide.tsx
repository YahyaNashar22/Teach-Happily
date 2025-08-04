/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import "../css/CoursePageLeftSide.css";
import IContent from "../interfaces/IContent";
import ICourse from "../interfaces/ICourse";
import { useUserStore } from "../store";
import axios from "axios";
import IFeedback from "../interfaces/IFeedback";
import StarRating from "./StarRating";
import CertificationTemplate from "./CertificationTemplate";
import ICertification from "../interfaces/ICertification";

const CoursePageLeftSide = ({
  selectedVideo,
  course,
  unlockedVideos,
  setUnlockedVideos,
}: {
  selectedVideo: IContent | null;
  course: ICourse | null;
  unlockedVideos: number[];
  setUnlockedVideos: React.Dispatch<React.SetStateAction<number[]>>;
}) => {
  const backend = import.meta.env.VITE_BACKEND;

  const { user } = useUserStore();

  const [videoLoading, setVideoLoading] = useState<boolean>(true);
  const [videoBufferPercent, setVideoBufferPercent] = useState(0);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  const [certificate, setCertificate] = useState<ICertification | null>(null);
  const [certLoading, setCertLoading] = useState(false);
  const [certError, setCertError] = useState("");

  const [, setVideoProgress] = useState<Record<string, number>>({});

  const [feedbacks, setFeedbacks] = useState<IFeedback[]>([]);
  const [feedbackLoader, setFeedbackLoader] = useState<boolean>(false);

  const [newFeedback, setNewFeedback] = useState<string>("");
  const [newRating, setNewRating] = useState<number>(0);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // MCQ/Quiz state
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizError, setQuizError] = useState<string>("");
  const [quizSubmitting, setQuizSubmitting] = useState(false);

  const updateBufferedProgress = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const buffered = video.buffered;
    const duration = video.duration;
    let bufferedEnd = 0;

    if (buffered.length > 0) {
      bufferedEnd = buffered.end(buffered.length - 1);
    }

    const percent = Math.min((bufferedEnd / duration) * 100, 100);
    setVideoBufferPercent(Math.floor(percent));
  };

  // Handle video progress tracking
  const handleTimeUpdate = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    const videoElement = event.currentTarget;
    const key = selectedVideo?.url ? selectedVideo.url.toString() : "";
    setVideoProgress((prevProgress) => ({
      ...prevProgress,
      [key]: videoElement.currentTime,
    }));
  };

  // Helper: get current video index
  const getCurrentIndex = () =>
    course?.content.findIndex((video) => video.url === selectedVideo?.url) ??
    -1;

  // Helper: check if quiz is already passed (from backend logic)
  // (quizPassed state removed, not used)
  useEffect(() => {
    // Reset quiz state when video changes
    setShowQuizModal(false);
    setQuizQuestions([]);
    setQuizAnswers([]);
    setQuizError("");
    // Optionally, fetch quiz progress from backend if needed
  }, [selectedVideo]);

  // Modified handleVideoEnd
  const handleVideoEnd = async () => {
    const currentIndex = getCurrentIndex();

    if (course && currentIndex >= 0) {
      console.log("current video:", course.content[currentIndex]);
      console.log("quiz:", course.content[currentIndex]?.quiz);
      if (currentIndex === course.content.length - 1) {
        console.log("This is the last video.");
        if (course.content[currentIndex]?.quiz) {
          console.log(
            "Last video has a quiz:",
            course.content[currentIndex].quiz
          );
        } else {
          console.log("Last video has NO quiz.");
        }
      }
    }
    if (
      currentIndex !== undefined &&
      currentIndex + 1 < (course?.content?.length || 0)
    ) {
      // Check if current video has a quiz
      const video = course?.content[currentIndex];
      if (
        video?.quiz &&
        video.quiz.questions &&
        video.quiz.questions.length > 0
      ) {
        // Show quiz modal
        setQuizQuestions(video.quiz.questions);
        setQuizAnswers(Array(video.quiz.questions.length).fill(-1));
        setShowQuizModal(true);
        return; // Block unlock until quiz is passed
      } else {
        // No quiz, unlock as before
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
          setUnlockedVideos((prev: number[]) => [...prev, currentIndex + 1]);
        } catch {
          // error handling already done above
        }
      }
    }
  };

  // Quiz answer change handler
  const handleQuizOptionChange = (qIdx: number, optIdx: number) => {
    setQuizAnswers((prev) => {
      const updated = [...prev];
      updated[qIdx] = optIdx;
      return updated;
    });
  };

  // Quiz submit handler
  const handleQuizSubmit = async () => {
    setQuizError("");
    setQuizSubmitting(true);
    const currentIndex = getCurrentIndex();
    try {
      const res = await axios.post(`${backend}/course/submit-quiz-answers`, {
        userId: user?._id,
        courseId: course?._id,
        videoIndex: currentIndex,
        answers: quizAnswers,
      });
      if (res.data.passed) {
        setShowQuizModal(false);
        // Unlock next video
        try {
          await axios.post(
            `${backend}/user/unlock-video`,
            {
              courseId: course?._id,
              userId: user?._id,
              videoIndex: currentIndex + 1,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          setUnlockedVideos((prev: number[]) => [...prev, currentIndex + 1]);
        } catch {
          setQuizError("تم اجتياز الاختبار لكن حدث خطأ في فتح الفيديو التالي.");
        }
      } else {
        setQuizError(
          res.data.message || "بعض الإجابات غير صحيحة. حاول مرة أخرى."
        );
      }
    } catch {
      setQuizError("حدث خطأ أثناء إرسال الإجابات. حاول مرة أخرى.");
    } finally {
      setQuizSubmitting(false);
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
        } catch {
          // error handling already done above
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
      } catch {
        // error handling already done above
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
    } catch {
      // error handling already done above
    } finally {
      setSubmitting(false);
    }
  };

  // Helper: is course completed?
  const isCourseCompleted =
    !!course && unlockedVideos.length === course.content.length;

  // Debug info for certificate/quiz issues
  console.log("unlockedVideos:", unlockedVideos);
  console.log("course.content.length:", course?.content?.length);
  console.log("isCourseCompleted:", isCourseCompleted);

  // Handler: Generate Certificate
  const handleGenerateCertificate = async () => {
    if (!user || !course) return;
    setCertLoading(true);
    setCertError("");
    try {
      const res = await axios.post(`${backend}/certification/generate`, {
        studentId: user._id,
        courseId: course._id,
      });
      setCertificate(res.data.payload);
      setCertError("تم إصدار الشهادة بنجاح! يمكنك الآن تحميلها.");
    } catch (err: any) {
      if (
        err.response &&
        err.response.data &&
        err.response.data.message === "Certificate already exists"
      ) {
        // Fetch existing certificate and show a friendly message
        try {
          const certRes = await axios.post(
            `${backend}/certification/user-certifications`,
            { studentId: user._id }
          );
          const certs: ICertification[] = certRes.data.payload || [];
          const cert = certs.find((c) => c.course._id === course?._id);
          if (cert) {
            setCertificate(cert);
            setCertError("لقد حصلت بالفعل على الشهادة. يمكنك تحميلها.");
          } else {
            setCertError("Certificate not found.");
          }
        } catch {
          setCertError("Certificate not found.");
        }
      } else if (
        err.response &&
        err.response.data &&
        err.response.data.message
      ) {
        setCertError(err.response.data.message);
      } else {
        setCertError("حدث خطأ ما. حاول مرة أخرى.");
      }
    } finally {
      setCertLoading(false);
    }
  };

  return (
    <div className="course-viewer-left-side-wrapper">
      {/* Quiz Modal */}
      {showQuizModal && (
        <div
          className="quiz-modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="quiz-modal-content"
            style={{
              background: "var(--white, #fff)",
              borderRadius: 16,
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              padding: 32,
              minWidth: 320,
              maxWidth: 420,
              width: "90%",
              color: "var(--purple, #8f438c)",
              position: "relative",
            }}
          >
            <button
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                background: "transparent",
                border: "none",
                fontSize: 24,
                color: "#888",
                cursor: quizSubmitting ? "not-allowed" : "pointer",
                zIndex: 2,
              }}
              onClick={() => setShowQuizModal(false)}
              disabled={quizSubmitting}
              aria-label="إغلاق"
            >
              ×
            </button>
            <h3
              style={{
                textAlign: "center",
                marginBottom: 24,
                color: "var(--purple, #8f438c)",
              }}
            >
              أسئلة الاختبار لهذا الفيديو
            </h3>
            {quizQuestions.map((q, qIdx) => (
              <div
                key={qIdx}
                className="quiz-modal-question-block"
                style={{ marginBottom: 24 }}
              >
                <div
                  className="quiz-modal-question-text"
                  style={{ fontWeight: 600, marginBottom: 12 }}
                >
                  {q.question}
                </div>
                <div
                  className="quiz-modal-options"
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {q.options.map((opt: string, oIdx: number) => (
                    <label
                      key={oIdx}
                      className="quiz-modal-option-label"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontSize: 18,
                      }}
                    >
                      <input
                        type="radio"
                        name={`quiz-q${qIdx}`}
                        checked={quizAnswers[qIdx] === oIdx}
                        onChange={() => handleQuizOptionChange(qIdx, oIdx)}
                        disabled={quizSubmitting}
                        style={{
                          width: 22,
                          height: 22,
                          accentColor: "var(--purple, #8f438c)",
                        }}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            {quizError && (
              <div
                className="quiz-modal-error"
                style={{
                  color: "var(--red, #d32f2f)",
                  marginBottom: 16,
                  textAlign: "center",
                }}
              >
                {quizError}
              </div>
            )}
            <button
              className="quiz-modal-submit-btn"
              onClick={handleQuizSubmit}
              disabled={quizSubmitting || quizAnswers.includes(-1)}
              style={{
                width: "100%",
                padding: "12px 0",
                background: "var(--purple, #8f438c)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 18,
                fontWeight: 600,
                cursor:
                  quizSubmitting || quizAnswers.includes(-1)
                    ? "not-allowed"
                    : "pointer",
                marginTop: 8,
                boxShadow: "0 2px 8px rgba(143,67,140,0.08)",
              }}
            >
              {quizSubmitting ? "جارٍ التحقق..." : "إرسال الإجابات"}
            </button>
          </div>
        </div>
      )}
      <div className="course-video-container" style={{ position: "relative" }}>
        {videoLoading && (
          <div className="video-loader-overlay">
            <div className="spinner" />
            <p className="video-loader-percentage">{videoBufferPercent}%</p>
          </div>
        )}
        <video
          ref={videoRef}
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
          onLoadStart={() => {
            setVideoLoading(true);
            setVideoBufferPercent(0);
          }}
          onCanPlayThrough={() => {
            setVideoLoading(false);
            setVideoBufferPercent(100);
          }}
          onProgress={updateBufferedProgress}
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

      {isCourseCompleted && (
        <div className="certificate-section">
          {!certificate && (
            <button
              className="get-certificate-btn"
              onClick={handleGenerateCertificate}
              disabled={certLoading}
            >
              {certLoading ? "جاري تجهيز الشهادة..." : "احصل على شهادتك"}
            </button>
          )}
          {certError && <p className="certificate-error">{certError}</p>}
          {certificate && (
            <div className="certificate-preview">
              <CertificationTemplate id={certificate._id} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CoursePageLeftSide;
