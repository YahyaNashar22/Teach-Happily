import "../css/CategorySelector.css";
import { categories } from "../dummyData";

const CategorySelector = () => {
  return (
    <div className="category-panel">
      <h3 className="category-title">الخانات</h3>
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
