import { useState } from "react";
import axios, { AxiosError } from "axios";
import "../css/CategoryForm.css";

const CategoryForm = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
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
      setMessage(response.data.message);
    } catch (error) {
      if (error instanceof AxiosError) setMessage(error.response?.data.message);
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

        <button type="submit" className="submit-btn">
          إضافة الفئة
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default CategoryForm;
