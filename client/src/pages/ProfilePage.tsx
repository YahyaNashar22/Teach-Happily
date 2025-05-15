import { useUserStore } from "../store";
import "../css/ProfilePage.css";
import { useEffect, useState } from "react";
import ICourse from "../interfaces/ICourse";
import axios from "axios";
import Loading from "../components/Loading";
import IProduct from "../interfaces/IProduct";
import CourseCard from "../components/CourseCard";
import ProductCard from "../components/ProductCard";

const ProfilePage = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const { user } = useUserStore();

  const [courses, setCourses] = useState<ICourse[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [favorites, setFavorites] = useState<ICourse[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCoursesEnrolled = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${backend}/course/get-courses-enrolled/${user?._id}`
        );

        setCourses(res.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPurchasedProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${backend}/digital-product/get-products-enrolled/${user?._id}`
        );

        setProducts(res.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchFavoriteCourses = async () => {
      setLoading(true);
      try {
        const res = await axios.post(
          `${backend}/user/get-favorite-courses`,
          {
            userId: user?._id,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setFavorites(res.data.payload.courseWishlist);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesEnrolled();
    fetchPurchasedProducts();
    fetchFavoriteCourses();
  }, [backend, user]);

  return (
    <main className="profile-wrapper">
      <h1 className="profile-title">أهلا {user?.fullName}</h1>
      <section className="profile-courses">
        <h2 className="enrolled-courses-title">الدورات المسجلة</h2>
        {!loading ? (
          <ul className="profile-course-list">
            {courses.length > 0 ? (
              courses.map((course) => {
                return <CourseCard key={course._id} course={course} />;
              })
            ) : (
              <li>لا توجد دورات مسجلة</li>
            )}
          </ul>
        ) : (
          <Loading />
        )}
      </section>

      <section className="profile-courses">
        <h2 className="enrolled-courses-title">المنتجات الرقمية</h2>
        {!loading ? (
          <ul className="profile-course-list">
            {products?.length > 0 ? (
              products.map((product) => {
                return <ProductCard key={product._id} product={product} />;
              })
            ) : (
              <li>لا توجد منتجات رقمية</li>
            )}
          </ul>
        ) : (
          <Loading />
        )}
      </section>

      <section className="profile-courses">
        <h2 className="enrolled-courses-title">الدورات المفضلة</h2>
        {!loading ? (
          <ul className="profile-course-list">
            {favorites.length > 0 ? (
              favorites.map((course) => {
                return <CourseCard key={course._id} course={course} />;
              })
            ) : (
              <li>لا توجد دورات مفضلة</li>
            )}
          </ul>
        ) : (
          <Loading />
        )}
      </section>
    </main>
  );
};

export default ProfilePage;
