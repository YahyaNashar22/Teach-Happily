import "../css/CourseForm.css";

import { useEffect, useState } from "react";
import axios from "axios";
import ITeacher from "../interfaces/ITeacher";
import ICategory from "../interfaces/ICategory";

const CourseUploadForm = ({
  setNewCourseForm,
}: {
  setNewCourseForm: (bool: boolean) => void;
}) => {
  const backend = import.meta.env.VITE_BACKEND;

  const [image, setImage] = useState<File | null>(null);
  const [videos, setVideos] = useState<{ title: string; file: File | null }[]>(
    []
  );
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${backend}/category`);
        setCategories(res.data.payload || []);
        const fetchedCategories = res.data.payload || [];
        setCategories(fetchedCategories);
        if (fetchedCategories.length > 0) {
          // Set the first category as the default
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
          // Set the first teacher as the default
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
  };

  const removeVideoField = (index: number) => {
    const updatedVideos = [...videos];
    updatedVideos.splice(index, 1);
    setVideos(updatedVideos);
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

    videos.forEach((video) => {
      if (video.file) {
        data.append("videos", video.file);
        data.append("videoTitles", video.title); // send titles too
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
  };

  return (
    <div className="category-form-container">
      <form onSubmit={handleSubmit} className="course-form">
        <h1 className="form-title">إضافة دورة جديدة</h1>

        <label>
          عنوان الدورة
          <input
            type="text"
            name="title"
            placeholder="عنوان الدورة"
            onChange={handleChange}
            required
          />
        </label>

        <label>
          نبذة عن الدورة
          <textarea
            name="description"
            placeholder="نبذة عن الدورة"
            onChange={handleChange}
            required
          ></textarea>
        </label>

        <label>
          المرحلة
          <select name="level" onChange={handleChange}>
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
          />
        </label>

        <label>
          المدربة
          <select name="teacher" onChange={handleChange}>
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
          <select name="category" onChange={handleChange}>
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
          ></textarea>
        </label>

        <label>
          المتطلبات
          <textarea
            name="requirements"
            placeholder="المتطلبات"
            onChange={handleChange}
            required
          ></textarea>
        </label>

        <label>
          الجمهور المستهدف
          <textarea
            name="audience"
            placeholder="الجمهور المستهدف"
            onChange={handleChange}
            required
          ></textarea>
        </label>

        <label>
          صورة الدورة
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </label>

        <label>فيديوهات الدورة</label>
        {videos.map((video, index) => (
          <div
            key={index}
            style={{
              marginBottom: "1rem",
              border: "1px solid #ccc",
              padding: "1rem",
              borderRadius: "8px",
            }}
          >
            <input
              type="text"
              placeholder={`عنوان الفيديو ${index + 1}`}
              value={video.title}
              onChange={(e) =>
                handleVideoChange(index, "title", e.target.value)
              }
              required
            />
            <input
              type="file"
              accept="video/*"
              onChange={(e) =>
                e.target.files &&
                handleVideoChange(index, "file", e.target.files[0])
              }
              style={{ margin: "10px 0px" }}
              required
            />
            <button type="button" onClick={() => removeVideoField(index)}>
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
