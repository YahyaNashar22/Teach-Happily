import { useUserStore } from "../store";
import "../css/ProfilePage.css";
import { useEffect, useState } from "react";
import ICourse from "../interfaces/ICourse";
import axios from "axios";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const { user } = useUserStore();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<ICourse[]>([]);
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
        console.log(res);

        setFavorites(res.data.payload.courseWishlist);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesEnrolled();
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
                return (
                  <li
                    key={course._id}
                    className="profile-course-item"
                    onClick={() => navigate(`/course/${course.slug}`)}
                  >
                    <p className="profile-course-title">{course.title}</p>
                    <img
                      src={`${backend}/${course.image}`}
                      className="profile-course-image"
                      loading="lazy"
                      alt={course.title}
                    />
                  </li>
                );
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
        <h2 className="enrolled-courses-title">الدورات المفضلة</h2>
        {!loading ? (
          <ul className="profile-course-list">
            {favorites.length > 0 ? (
              favorites.map((course) => {
                return (
                  <li
                    key={course._id}
                    className="profile-course-item"
                    onClick={() => navigate(`/course/${course.slug}`)}
                  >
                    <p className="profile-course-title">{course.title}</p>
                    <img
                      src={`${backend}/${course.image}`}
                      className="profile-course-image"
                      loading="lazy"
                      alt={course.title}
                    />
                  </li>
                );
              })
            ) : (
              <li>لا توجد دورات مفضلة</li>
            )}
          </ul>
        ) : (
          <Loading />
        )}
      </section>

      {/* <section className="profile-buttons">
        <Link to="/" onClick={clearUser} className="profile-signout">
          تسجيل الخروج
        </Link>
      </section> */}
    </main>
  );
};

export default ProfilePage;
