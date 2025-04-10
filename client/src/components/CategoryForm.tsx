import { useState } from "react";
import axios, { AxiosError } from "axios";
import "../css/CategoryForm.css";

const CategoryForm = ({
  setNewCategoryForm,
}: {
  setNewCategoryForm: (bool: boolean) => void;
}) => {
  const backend = import.meta.env.VITE_BACKEND;
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");

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
    formData.append("description", description);
    formData.append("title", title);
    formData.append("image", image!);

    try {
      const response = await axios.post(
        `${backend}/category/create-category`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setImage(null);
      setName("");
      setDescription("");
      setTitle("");

      setMessage(response.data.message);
      setNewCategoryForm(false);
    } catch (error) {
      if (error instanceof AxiosError) setMessage(error.response?.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="category-form-container">
      <h1 className="form-title">إضافة فئة جديدة</h1>
      <form onSubmit={handleSubmit} className="category-form">
        <label htmlFor="name" className="dash-cat-label">
          اسم الفئة
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="أدخل اسم الفئة"
          className="dash-cat-inp"
        />

        <label htmlFor="name" className="dash-cat-label">
          العنوان
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="العنوان"
          className="dash-cat-inp"
        />

        <label htmlFor="description" className="dash-cat-label">
          الوصف
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="أدخل وصف الفئة"
          className="dash-cat-inp"
        />

        <label htmlFor="image" className="dash-cat-label">
          صورة الفئة
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
          إضافة الفئة
        </button>
        <button
          type="button"
          onClick={() => setNewCategoryForm(false)}
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

export default CategoryForm;
