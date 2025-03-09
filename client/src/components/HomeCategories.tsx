import "../css/HomeCategories.css";
import { categories } from "../dummyData";

const HomeCategories = () => {
  return (
    <section className="home-categories-section">
      <h1 className="home-categories-title">الفئات المتاحة</h1>
      <ul className="home-categories-container">
        {categories.map((category) => {
          return (
            <li
              key={category._id}
              className="category-item"
              style={{ background: `url(${category.image})` }}
            >
              {category.name}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default HomeCategories;
