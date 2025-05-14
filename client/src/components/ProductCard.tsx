import "../css/ProductCard.css";

import IProduct from "../interfaces/IProduct";
import { useUserStore } from "../store";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const ProductCard = ({ product }: { product: IProduct }) => {
  const backend = import.meta.env.VITE_BACKEND;

  const { user } = useUserStore();

  const [isUserEnrolled, setIsUserEnrolled] = useState<boolean>(false);
  const [inWishlist, setInWishlist] = useState<boolean>(false);
  const [purchaseModal, setPurchaseModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

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

  const togglePurchaseModal = () => {
    setPurchaseModal((prev) => !prev);
  };

  const enroll = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${backend}/user/enroll-product`,
        {
          userId: user?._id,
          productId: product?._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        // Update UI state
        setIsUserEnrolled(true);
        setPurchaseModal(false);
        downloadProduct();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductPurchase = async () => {
    try {
      await enroll();
    } catch (error) {
      console.error("Purchase error:", error);
    }
  };

  const downloadProduct = async () => {
    try {
      const response = await axios.get(
        `${backend}/product/${product._id}/download`,
        {
          responseType: "blob", // Important for file downloads
        }
      );

      // Create a URL and trigger a download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Use product title as filename, or set a default one
      const fileName = product.title ? `${product.title}` : "product-download";
      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <>
      <li
        className="course-card"
        onClick={togglePurchaseModal}
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
              <p className="price">$ {Number(product.price).toFixed(2)}</p>
            </div>
          )}

          <div className="hover-sheet">
            <div className="hover-sheet-small-border" />
            <p>{product.teacher.fullname}</p>
            <p>{product.category.name}</p>
            <p>{product.description}</p>
          </div>
        </div>

        {/* Purchase Confirmation Modal */}
        {purchaseModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2 className="modal-title">تأكيد الشراء</h2>
              <p className="modal-text">
                هل أنت متأكد أنك تريد شراء المنتج{" "}
                <strong>{product?.title}</strong> مقابل{" "}
                <span className="modal-price">
                  $ {product?.price.toFixed(2)}
                </span>
                ؟
              </p>
              <div className="modal-actions">
                <button
                  className="btn btn-confirm"
                  disabled={loading}
                  onClick={handleProductPurchase}
                >
                  تأكيد
                </button>
                <button
                  className="btn btn-cancel"
                  disabled={loading}
                  onClick={togglePurchaseModal}
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}
      </li>
    </>
  );
};

export default ProductCard;
