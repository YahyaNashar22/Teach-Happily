import { useUserStore } from "../store";
import "../css/ProfilePage.css";
import { useEffect, useState } from "react";
import ICourse from "../interfaces/ICourse";
import axios from "axios";
import Loading from "../components/Loading";
import { Link, useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const { user, clearUser } = useUserStore();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<ICourse[]>([]);
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

    fetchCoursesEnrolled();
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

      <section className="profile-buttons">
        <Link to="/" onClick={clearUser} className="profile-signout">
          تسجيل الخروج
        </Link>
      </section>
    </main>
  );
};

export default ProfilePage;
