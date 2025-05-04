import "../css/ProductCard.css";

import { useNavigate } from "react-router-dom";
import IProduct from "../interfaces/IProduct";
import { useUserStore } from "../store";
import { useEffect, useState } from "react";
import IFeedback from "../interfaces/IFeedback";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import StarRating from "./StarRating";

const ProductCard = ({ product }: { product: IProduct }) => {
  const backend = import.meta.env.VITE_BACKEND;

  const { user } = useUserStore();
  const navigate = useNavigate();

  const [isUserEnrolled, setIsUserEnrolled] = useState<boolean>(false);
  const [inWishlist, setInWishlist] = useState<boolean>(false);
  const [feedbacks, setFeedbacks] = useState<IFeedback[]>([]);
  const [feedbackLoader, setFeedbackLoader] = useState<boolean>(false);

  const handleCourseNavigation = () => {
    return isUserEnrolled
      ? navigate(`/course/${product.slug}`)
      : navigate(`/course-showcase/${product.slug}`);
  };

  useEffect(() => {
    const checkUserEnrolled = () => {
      if (user && product.students.includes(user._id)) {
        setIsUserEnrolled(true);
      } else {
        setIsUserEnrolled(false);
      }
    };

    checkUserEnrolled();
  }, [user, backend, product]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await axios.put(
        `${backend}/user/course-wishlist`,
        {
          userId: user?._id,
          courseId: product._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setInWishlist(res.data.message === "Added to wishlist");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!product) return;
    const fetchFeedbacks = async () => {
      setFeedbackLoader(true);
      try {
        const res = await axios.get(`${backend}/feedback/${product._id}`);

        setFeedbacks(res.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setFeedbackLoader(false);
      }
    };

    fetchFeedbacks();
  }, [backend, product, user]);

  const averageRating = feedbacks.length
    ? Math.round(
        feedbacks.reduce((acc, f) => acc + (f.rating || 0), 0) /
          feedbacks.length
      )
    : 0;
  return (
    <>
      <li
        className="course-card"
        onClick={handleCourseNavigation}
        style={{
          backgroundImage: `url(${backend}/${product.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {user && !product.students.includes(user._id) && (
          <div className="wishlist-icon" onClick={toggleWishlist}>
            {inWishlist ? <FaHeart color="var(--yellow)" /> : <FaRegHeart />}
          </div>
        )}
        {/* <img
        src={`${backend}/${course.image}`}
        width={320}
        height={200}
        alt={course.title}
        loading="lazy"
        className="course-card-image"
      /> */}
        {!feedbackLoader && (
          <div className="card-rating-container">
            <StarRating rating={averageRating} />
          </div>
        )}
        <div className="upper">
          <h2 className="course-title">{product.title}</h2>
          {/* <p className="course-duration">
          <FaClock /> {course.duration}
        </p> */}
          {/* <div className="teacher-info">
          <div className="teacher-initials">
            {course.teacher.fullname?.split(" ")[0][0]}
          </div>
          <div className="teacher-divider">
            <p className="teacher-category">
              من
              <span className="hovered"> {course.teacher.fullname} </span>
              موجود في
              <span className="hovered"> {course.category.name}</span>
            </p>
          </div>
        </div> */}
        </div>

        <div className="card-footer">
          {isUserEnrolled && (
            // <Link
            //   to={`/course/${course.slug}`}
            //   className="btn enroll-btn enrolled "
            // >
            //   الالتحاق
            // </Link>

            <div className="not-purchased">
              {/* <Link
              to={`/course-showcase/${course.slug}`}
              className="btn enroll-btn "
            >
              عرض المحتوى
            </Link> */}

              <p className="price">$ {Number(product.price).toFixed(2)}</p>
            </div>
          )}

          <div className="hover-sheet">
            <div className="hover-sheet-small-border" />
            <p>{product.teacher.fullname}</p>
            <p>{product.category.name}</p>
            <p>{product.description?.slice(0, 100)}...</p>
          </div>
        </div>
      </li>
    </>
  );
};

export default ProductCard;
