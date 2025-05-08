import { FC, useEffect, useState } from "react";
import "../css/CourseSelector.css";

import CourseCard from "./CourseCard";
import ICourse from "../interfaces/ICourse";
import axios from "axios";
import Loading from "./Loading";
import ICourseSelector from "../interfaces/ICourseSelector";
import IProduct from "../interfaces/IProduct";
import ProductCard from "./ProductCard";

const CourseSelector: FC<ICourseSelector> = ({
  category,
  priceType,
  page,
  digital,
  setTotalPages,
}) => {
  const backend = import.meta.env.VITE_BACKEND;
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!digital) {
      const fetchCourses = async () => {
        setLoading(true);
        try {
          const res = await axios.post(
            `${backend}/course/get-all`,
            {
              category,
              priceType,
              page,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          setCourses(res.data.payload);
          setTotalPages(res.data.pagination.totalPages);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };
      fetchCourses();
    }
    if (digital) {
      const fetchProducts = async () => {
        setLoading(true);
        try {
          const res = await axios.post(
            `${backend}/digital-product/get-all`,
            {
              category,
              priceType,
              page,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          setProducts(res.data.payload);
          setTotalPages(res.data.pagination.totalPages);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  }, [backend, category, priceType, page, setTotalPages, digital]);
  return (
    <>
      {loading ? (
        <div className="courses-loading">
          <Loading />
        </div>
      ) : (
        <>
          {!digital && (
            <ul className="course-list">
              {courses.length > 0 ? (
                courses.map((course) => {
                  return <CourseCard key={course._id} course={course} />;
                })
              ) : (
                <p className="no-courses">لا توجد دورات حاليا</p>
              )}
            </ul>
          )}

          {digital && (
            <ul className="course-list">
              {products.length > 0 ? (
                products.map((product) => {
                  return <ProductCard key={product._id} product={product} />;
                })
              ) : (
                <p className="no-courses">لا توجد منتحات حاليا</p>
              )}
            </ul>
          )}
        </>
      )}
    </>
  );
};

export default CourseSelector;
