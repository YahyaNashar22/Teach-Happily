import { useState } from "react";
import axios, { AxiosError } from "axios";
import "../css/TeacherForm.css";

const TeacherForm = ({
  setNewTeacherForm,
}: {
  setNewTeacherForm: (bool: boolean) => void;
}) => {
  const backend = import.meta.env.VITE_BACKEND;
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("profession", profession);
    formData.append("description", description);
    formData.append("image", image!);

    try {
      const response = await axios.post(
        `${backend}/teacher/create-teacher`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setImage(null);
      setName("");
      setProfession("");
      setDescription("");
      setMessage(response.data.message);
      setNewTeacherForm(false);
    } catch (error) {
      if (error instanceof AxiosError) setMessage(error.response?.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="category-form-container">
      <h1 className="form-title">إضافة مدربة جديدة</h1>
      <form onSubmit={handleSubmit} className="category-form">
        <label htmlFor="name" className="dash-cat-label">
          اسم المدربة
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="أدخل اسم المدربة"
          className="dash-cat-inp"
        />

        <label htmlFor="profession" className="dash-cat-label">
          اختصاص المدربة
        </label>
        <input
          type="text"
          id="profession"
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
          required
          placeholder="أدخل اختصاص المدربة"
          className="dash-cat-inp"
        />

        <label htmlFor="description" className="dash-cat-label">
          وصف المدربة
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="أدخل وصف المدربة"
          className="dash-cat-inp"
          rows={4}
        />

        <label htmlFor="image" className="dash-cat-label">
          صورة المدربة
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
          required
          className="dash-cat-inp"
        />

        <button type="submit" disabled={loading} className="submit-btn">
          إضافة المدربة
        </button>

        <button
          type="button"
          onClick={() => setNewTeacherForm(false)}
          disabled={loading}
          className="cancel-btn"
        >
          الغاء
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default TeacherForm;
