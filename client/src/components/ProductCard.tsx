import "../css/ProductCard.css";

import IProduct from "../interfaces/IProduct";
import { useUserStore } from "../store";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }: { product: IProduct }) => {
  const backend = import.meta.env.VITE_BACKEND;
  const navigate = useNavigate();
  const { user } = useUserStore();

  const [isUserEnrolled, setIsUserEnrolled] = useState<boolean>(false);
  const [inWishlist, setInWishlist] = useState<boolean>(false);

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

  const handleProductNavigation = () => {
    if (!user?._id) {
      navigate("/sign-in");
      return;
    }
    if (isUserEnrolled) {
      const fileUrl = `${backend}/${product.product}`;
      window.open(fileUrl, "_blank");
    } else navigate(`/product-showcase/${product.slug}`);
  };

  return (
    <>
      <li
        className="course-card"
        onClick={() => handleProductNavigation()}
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

        <div className="upper">
          <h2 className="course-title">{product.title}</h2>
        </div>

        <div className="card-footer">
          {!isUserEnrolled && (
            <div className="not-purchased">
              <p className="price">
                {product.price === 0
                  ? "مجاني"
                  : `QR ${Number(product.price).toFixed(2)}`}
              </p>
            </div>
          )}

          <div className="hover-sheet">
            <div className="hover-sheet-small-border" />
            <p>{product.teacher.fullname}</p>
            <p>{product.category.name}</p>
            <p>{product.description}</p>
          </div>
        </div>
      </li>
    </>
  );
};

export default ProductCard;
