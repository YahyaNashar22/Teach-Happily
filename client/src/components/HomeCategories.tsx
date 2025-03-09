import { useEffect, useState } from "react";
import "../css/HomeCategories.css";
import ICategory from "../interfaces/ICategory";
import axios from "axios";
import Loading from "./Loading";

const HomeCategories = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${backend}/category`);
        setCategories(res.data.payload || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [backend]);

  return (
    <section className="home-categories-section">
      <h1 className="home-categories-title">الفئات المتاحة</h1>
      {loading ? (
        <Loading />
      ) : categories.length > 0 ? (
        <ul className="home-categories-container">
          {categories.map((category) => {
            return (
              <li
                key={category._id}
                className="category-item"
                style={{ background: `url(${backend}/${category.image})` }}
              >
                {category.name}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="no-categories-message">لا توجد فئات متاحة حاليًا</p>
      )}
    </section>
  );
};

export default HomeCategories;
