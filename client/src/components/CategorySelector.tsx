import { useEffect, useState } from "react";
import "../css/CategorySelector.css";
import ICategory from "../interfaces/ICategory";
import axios from "axios";
import Loading from "./Loading";

const CategorySelector = ({
  setCategory,
  setPriceType,
  setPage,
  page,
  totalPages,
}: {
  setCategory: (category: string) => void;
  setPriceType: (priceType: string) => void;
  setPage: (page: number) => void;
  page: number;
  totalPages: number;
}) => {
  const backend = import.meta.env.VITE_BACKEND;
  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedPriceType, setSelectedPriceType] = useState<string>("");

  // Handle category selection
  const handleCategoryChange = (categoryId: string) => {
    const newCategory = selectedCategory === categoryId ? "" : categoryId;
    setSelectedCategory(newCategory);
    setCategory(newCategory);
  };

  // Handle price type selection
  const handlePriceChange = (priceType: string) => {
    const newPriceType = selectedPriceType === priceType ? "" : priceType;
    setSelectedPriceType(newPriceType);
    setPriceType(newPriceType);
  };

  // Pagination handlers
  const goToPreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const goToNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

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
      <h3 className="category-title">الفئات</h3>
      {loading ? (
        <Loading />
      ) : categories.length > 0 ? (
        <ul className="category-list">
          {categories.map((category) => {
            return (
              <li key={category._id} className="category-item-selector">
                <label className="category-item-label">
                  <input
                    type="checkbox"
                    className="category-item-input"
                    name="category"
                    value={category._id}
                    checked={selectedCategory === category._id}
                    onChange={() => handleCategoryChange(category._id)}
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
              name="price"
              value="free"
              checked={selectedPriceType === "free"}
              onChange={() => handlePriceChange("free")}
            />
            مجاني
          </label>
        </li>

        <li className="category-item">
          <label className="category-item-label">
            <input
              type="checkbox"
              className="category-item-input"
              name="price"
              value="paid"
              checked={selectedPriceType === "paid"}
              onChange={() => handlePriceChange("paid")}
            />
            مدفوع{" "}
          </label>
        </li>
      </ul>

      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={goToPreviousPage} disabled={page === 1}>
          السابق ➡
        </button>
        <span>
          صفحة {page} من {totalPages}
        </span>
        <button
          className="pagination-btn"
          onClick={goToNextPage}
          disabled={page === totalPages}
        >
          ⬅ التالي
        </button>
      </div>
    </div>
  );
};

export default CategorySelector;
