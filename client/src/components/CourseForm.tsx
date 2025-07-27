
import "../css/CourseForm.css";

import { useEffect, useState } from "react";
import axios from "axios";
import ITeacher from "../interfaces/ITeacher";
import ICategory from "../interfaces/ICategory";
import { IQuiz, IQuizQuestion } from "../interfaces/IContent";
import ICourse from "../interfaces/ICourse";

interface CourseFormProps {
  setNewCourseForm: (bool: boolean) => void;
  course?: ICourse | null;
}

const CourseUploadForm = ({ setNewCourseForm, course }: CourseFormProps) => {
  const backend = import.meta.env.VITE_BACKEND;

  const isEditMode = !!course;

  const [image, setImage] = useState<File | null>(null);
  const [videos, setVideos] = useState<{ title: string; file: File | null; url?: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [showProgressModal, setShowProgressModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    level: "مبتدئ",
    duration: "",
    price: "",
    teacher: "",
    category: "",
    whatWillYouLearn: "",
    requirements: "",
    audience: "",
  });

  // Add quiz state for each video
  const [quizzes, setQuizzes] = useState<IQuiz[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${backend}/category`);
        setCategories(res.data.payload || []);
        const fetchedCategories = res.data.payload || [];
        setCategories(fetchedCategories);
        if (fetchedCategories.length > 0) {
          setFormData((prevData) => ({
            ...prevData,
            category: fetchedCategories[0]._id,
          }));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [backend]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await axios.get(`${backend}/teacher`);
        setTeachers(res.data.payload || []);
        const fetchedTeachers = res.data.payload || [];
        setTeachers(fetchedTeachers);
        if (fetchedTeachers.length > 0) {
          setFormData((prevData) => ({
            ...prevData,
            teacher: fetchedTeachers[0]._id,
          }));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, [backend]);

  // If editing, initialize state from course prop
  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title,
        description: course.description,
        level: course.level,
        duration: course.duration,
        price: course.price.toString(),
        teacher: course.teacher._id,
        category: course.category._id,
        whatWillYouLearn: course.whatWillYouLearn,
        requirements: course.requirements,
        audience: course.audience,
      });
      setImage(null); // Only set if user uploads new image
      setVideos(
        course.content.map((c) => ({
          title: c.title,
          file: null,
          url: typeof c.url === "string" ? c.url : undefined,
        }))
      );
      setQuizzes(
        course.content.map((c) =>
          c.quiz && c.quiz.questions.length > 0
            ? { questions: c.quiz.questions }
            : { questions: [] }
        )
      );
    }
  }, [course]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setError(null);
    setSuccess(null);
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Ensure `files` is not null
    if (file) {
      setImage(file);
    }
  };

  const handleVideoChange = (
    index: number,
    field: "title" | "file",
    value: string | File
  ) => {
    const updatedVideos = [...videos];
    updatedVideos[index] = {
      ...updatedVideos[index],
      [field]: value,
    };
    setVideos(updatedVideos);
  };

  const addNewVideoField = () => {
    setVideos([...videos, { title: "", file: null }]);
    setQuizzes([...quizzes, { questions: [] }]);
  };

  const removeVideoField = (index: number) => {
    const updatedVideos = [...videos];
    updatedVideos.splice(index, 1);
    setVideos(updatedVideos);
    const updatedQuizzes = [...quizzes];
    updatedQuizzes.splice(index, 1);
    setQuizzes(updatedQuizzes);
  };

  // Quiz editing handlers
  const handleQuizQuestionChange = (videoIdx: number, qIdx: number, field: keyof IQuizQuestion, value: string) => {
    const updated = quizzes.map((quiz, vIdx) => {
      if (vIdx !== videoIdx) return quiz;
      const questions = quiz.questions.map((q, idx) =>
        idx === qIdx ? { ...q, [field]: value } : q
      );
      return { ...quiz, questions };
    });
    setQuizzes(updated);
  };

  const handleQuizOptionChange = (videoIdx: number, qIdx: number, optIdx: number, value: string) => {
    const updated = quizzes.map((quiz, vIdx) => {
      if (vIdx !== videoIdx) return quiz;
      const questions = quiz.questions.map((q, idx) => {
        if (idx !== qIdx) return q;
        const options = q.options.map((opt, oIdx) =>
          oIdx === optIdx ? value : opt
        );
        return { ...q, options };
      });
      return { ...quiz, questions };
    });
    setQuizzes(updated);
  };

  const addQuizQuestion = (videoIdx: number) => {
    const updated = quizzes.map((quiz, vIdx) => {
      if (vIdx !== videoIdx) return quiz;
      return {
        ...quiz,
        questions: [
          ...quiz.questions,
          { question: "", options: ["", "", "", ""], correctIndex: 0 },
        ],
      };
    });
    setQuizzes(updated);
  };

  const removeQuizQuestion = (videoIdx: number, qIdx: number) => {
    const updated = quizzes.map((quiz, vIdx) => {
      if (vIdx !== videoIdx) return quiz;
      const questions = quiz.questions.filter((_, idx) => idx !== qIdx);
      return { ...quiz, questions };
    });
    setQuizzes(updated);
  };

  const handleCorrectOptionChange = (videoIdx: number, qIdx: number, correctIndex: number) => {
    const updated = quizzes.map((quiz, vIdx) => {
      if (vIdx !== videoIdx) return quiz;
      const questions = quiz.questions.map((q, idx) =>
        idx === qIdx ? { ...q, correctIndex } : q
      );
      return { ...quiz, questions };
    });
    setQuizzes(updated);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key as keyof typeof formData]);
    });
    if (image) {
      data.append("image", image);
    }

    if (!isEditMode) {
      // ADD MODE
      videos.forEach((video, idx) => {
        if (video.file) {
          data.append("videos", video.file);
          data.append("videoTitles", video.title); // send titles too
        }
        // Add quiz for this video
        if (quizzes[idx] && quizzes[idx].questions.length > 0) {
          data.append(`quizzes`, JSON.stringify(quizzes[idx]));
        }
      });
      try {
        setShowProgressModal(true);
        const res = await axios.post(`${backend}/course/create-course`, data, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setUploadProgress(percentCompleted);
          },
        });
        setSuccess(res.data.message);
        setFormData({
          title: "",
          description: "",
          level: "مبتدئ",
          duration: "",
          price: "",
          teacher: teachers.length > 0 ? teachers[0]._id : "",
          category: categories.length > 0 ? categories[0]._id : "",
          whatWillYouLearn: "",
          requirements: "",
          audience: "",
        });
        setImage(null);
        setVideos([]);
        setNewCourseForm(false);
      } catch (error) {
        console.error(error);
        setError("حدث خطأ أثناء رفع الدورة");
      } finally {
        setLoading(false);
        setShowProgressModal(false);
        setUploadProgress(0);
      }
    } else {
      // EDIT MODE
      // Build content array for backend
      const updatedContent = videos.map((video, idx) => {
        // If a new file is uploaded, url will be replaced by backend
        return {
          title: video.title,
          url: video.file ? (video.file as File).name : video.url, // send original name for new files, filename for existing
          quiz: quizzes[idx] && quizzes[idx].questions.length > 0 ? quizzes[idx] : undefined,
        };
      });
      data.append("content", JSON.stringify(updatedContent));
      // Attach only new video files
      videos.forEach((video) => {
        if (video.file) {
          data.append("videos", video.file);
        }
      });
      try {
        setShowProgressModal(true);
        await axios.patch(`${backend}/course/${course?._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setUploadProgress(percentCompleted);
          },
        });
        setSuccess("تم تحديث الدورة بنجاح");
        setNewCourseForm(false);
      } catch (error) {
        console.error(error);
        setError("حدث خطأ أثناء تحديث الدورة");
      } finally {
        setLoading(false);
        setShowProgressModal(false);
        setUploadProgress(0);
      }
    }
  };

  return (
    <div className="category-form-container">
      <form onSubmit={handleSubmit} className="course-form">
        <h1 className="form-title">{isEditMode ? "تعديل الدورة" : "إضافة دورة جديدة"}</h1>

        {/* Show current image in edit mode */}
        {isEditMode && course?.image && typeof course.image === "string" && (
          <div style={{ marginBottom: 8 }}>
            <span>الصورة الحالية:</span>
            <img src={`${backend}/${course.image}`} alt="Current Thumbnail" style={{ width: 120, margin: 8 }} />
          </div>
        )}
        <label>
          صورة الدورة
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required={!isEditMode}
          />
        </label>

        <label>
          عنوان الدورة
          <input
            type="text"
            name="title"
            placeholder="عنوان الدورة"
            onChange={handleChange}
            required
            value={formData.title}
          />
        </label>

        <label>
          نبذة عن الدورة
          <textarea
            name="description"
            placeholder="نبذة عن الدورة"
            onChange={handleChange}
            required
            value={formData.description}
          ></textarea>
        </label>

        <label>
          المرحلة
          <select name="level" onChange={handleChange} value={formData.level}>
            <option value="مبتدئ">مبتدئ</option>
            <option value="متوسط">متوسط</option>
            <option value="متقدم">متقدم</option>
          </select>
        </label>

        <label>
          المدة
          <input
            type="text"
            name="duration"
            placeholder="المدة"
            onChange={handleChange}
            required
            value={formData.duration}
          />
        </label>

        <label>
          السعر
          <input
            type="number"
            name="price"
            placeholder="السعر"
            onChange={handleChange}
            required
            min="0"
            value={formData.price}
          />
        </label>

        <label>
          المدربة
          <select name="teacher" onChange={handleChange} value={formData.teacher}>
            {teachers.map((teacher) => {
              return (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.fullname}
                </option>
              );
            })}
          </select>
        </label>

        <label>
          الفئة
          <select name="category" onChange={handleChange} value={formData.category}>
            {categories.map((category) => {
              return (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              );
            })}
          </select>
        </label>

        <label>
          ماذا ستتعلم ؟
          <textarea
            name="whatWillYouLearn"
            placeholder="ماذا ستتعلم؟"
            onChange={handleChange}
            required
            value={formData.whatWillYouLearn}
          ></textarea>
        </label>

        <label>
          المتطلبات
          <textarea
            name="requirements"
            placeholder="المتطلبات"
            onChange={handleChange}
            required
            value={formData.requirements}
          ></textarea>
        </label>

        <label>
          الجمهور المستهدف
          <textarea
            name="audience"
            placeholder="الجمهور المستهدف"
            onChange={handleChange}
            required
            value={formData.audience}
          ></textarea>
        </label>

        <label>فيديوهات الدورة</label>
        {videos.map((video, vIdx) => (
          <div key={vIdx} className="video-quiz-block">
            <label>
              عنوان الفيديو
              <input
                type="text"
                value={video.title}
                onChange={(e) => handleVideoChange(vIdx, "title", e.target.value)}
                required
              />
            </label>
            {/* Show current video file in edit mode */}
            {isEditMode && video.url && (
              <div style={{ marginBottom: 8 }}>
                <span>الفيديو الحالي:</span>
                <a href={`${backend}/${video.url}`} target="_blank" rel="noopener noreferrer">
                  {video.url}
                </a>
              </div>
            )}
            <label>
              ملف الفيديو
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleVideoChange(vIdx, "file", e.target.files[0]);
                  }
                }}
                required={!isEditMode}
              />
            </label>
            {/* Quiz UI */}
            <div className="quiz-editor">
              <h4>أسئلة الاختبار لهذا الفيديو</h4>
              {quizzes[vIdx]?.questions.map((q: IQuizQuestion, qIdx: number) => (
                <div key={qIdx} className="quiz-question-block">
                  <input
                    type="text"
                    placeholder="نص السؤال"
                    value={q.question}
                    onChange={(e) => handleQuizQuestionChange(vIdx, qIdx, "question", e.target.value)}
                    required
                  />
                  <div className="quiz-options">
                    {q.options.map((opt: string, oIdx: number) => (
                      <div key={oIdx} className="quiz-option-block">
                        <input
                          type="text"
                          placeholder={`خيار ${oIdx + 1}`}
                          value={opt}
                          onChange={(e) => handleQuizOptionChange(vIdx, qIdx, oIdx, e.target.value)}
                          required
                        />
                        <input
                          type="radio"
                          name={`correct-${vIdx}-${qIdx}`}
                          checked={q.correctIndex === oIdx}
                          onChange={() => handleCorrectOptionChange(vIdx, qIdx, oIdx)}
                        />
                        <span>صحيح</span>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={() => removeQuizQuestion(vIdx, qIdx)}>
                    حذف السؤال
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addQuizQuestion(vIdx)}>
                إضافة سؤال جديد
              </button>
            </div>
            <button type="button" onClick={() => removeVideoField(vIdx)}>
              حذف الفيديو
            </button>
          </div>
        ))}
        <button type="button" onClick={addNewVideoField}>
          + إضافة فيديو جديد
        </button>

        <button type="submit" disabled={loading}>
          {loading ? "جارٍ الرفع..." : "رفع الدورة"}
        </button>

        <button
          type="button"
          onClick={() => setNewCourseForm(false)}
          disabled={loading}
          className="cancel-btn"
        >
          الغاء
        </button>
        {error && <p className="course-form-error">{error}</p>}
        {success && <p className="course-form-success">{success}</p>}
      </form>

      {showProgressModal && (
        <div className="progress-bar-modal-overlay">
          <div className="progress-bar-modal-content">
            <h2>جاري رفع الدورة</h2>
            <p>يرجى عدم إغلاق هذه النافذة حتى انتهاء عملية الرفع</p>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p>{uploadProgress}%</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseUploadForm;
