import { useEffect, useState } from "react";
import "../css/CategorySelector.css";
import ICategory from "../interfaces/ICategory";
import axios from "axios";
import Loading from "./Loading";

const CategorySelector = () => {
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
    <div className="category-panel">
      <h3 className="category-title">الخانات</h3>
      {loading ? (
        <Loading />
      ) : categories.length > 0 ? (
        <ul className="category-list">
          {categories.map((category) => {
            return (
              <li key={category._id} className="category-item">
                <label className="category-item-label">
                  <input
                    type="checkbox"
                    className="category-item-input"
                    name={category.name}
                  />
                  {category.name}
                </label>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="no-categories-message">لا توجد فئات متاحة حاليًا</p>
      )}

      <h3 className="category-title">السعر</h3>
      <ul className="category-list">
        <li className="category-item">
          <label className="category-item-label">
            <input
              type="checkbox"
              className="category-item-input"
              name="free"
            />
            مجاني
          </label>
        </li>

        <li className="category-item">
          <label className="category-item-label">
            <input
              type="checkbox"
              className="category-item-input"
              name="paid"
            />
            مدفوع{" "}
          </label>
        </li>
      </ul>
    </div>
  );
};

export default CategorySelector;
