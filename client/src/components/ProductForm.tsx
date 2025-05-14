/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";

import ITeacher from "../interfaces/ITeacher";
import ICategory from "../interfaces/ICategory";

const ProductForm = ({
  setNewProductForm,
}: {
  setNewProductForm: (val: boolean) => void;
}) => {
  const backend = import.meta.env.VITE_BACKEND;

  const [image, setImage] = useState<File | null>(null);
  const [productFile, setProductFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    teacher: "",
    category: "",
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Ensure `files` is not null
    if (file) {
      setProductFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    if (image) data.append("image", image);
    if (productFile) data.append("product", productFile);

    try {
      const response = await axios.post(
        `${backend}/digital-product/create`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSuccess(response.data.message);
      alert("تم انشاء المنتج بنجاح");
      setNewProductForm(false);
      setImage(null);
      setProductFile(null);
      setFormData({
        title: "",
        description: "",
        price: "",
        teacher: teachers.length > 0 ? teachers[0]._id : "",
        category: categories.length > 0 ? categories[0]._id : "",
      });
    } catch (error: any) {
      alert(error.response?.data?.message || "حدث خطأ ما");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="category-form-container">
      <form onSubmit={handleSubmit} className="course-form">
        <h1 className="form-title">إضافة منتج جديد</h1>

        <label>
          اسم المنتج
          <input
            type="text"
            name="title"
            placeholder="اسم المنتج"
            onChange={handleChange}
            required
          />
        </label>

        <label>
          نبذة عن المنتج
          <textarea
            name="description"
            placeholder="نبذة عن المنتج"
            onChange={handleChange}
            required
          ></textarea>
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
          صورة المنتج
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </label>

        <label>
          ملف المنتج
          <input type="file" onChange={handleFileChange} required />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "جارٍ الرفع..." : "رفع المنتج"}
        </button>

        <button
          type="button"
          onClick={() => setNewProductForm(false)}
          disabled={loading}
          className="cancel-btn"
        >
          الغاء
        </button>
        {error && <p className="course-form-error">{error}</p>}
        {success && <p className="course-form-success">{success}</p>}
      </form>
    </div>
  );
};

export default ProductForm;
