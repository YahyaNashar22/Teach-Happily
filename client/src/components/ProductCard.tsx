import "../css/ProductCard.css";

import IProduct from "../interfaces/IProduct";
import { useUserStore } from "../store";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { usePayment } from "../hooks/usePayment";
import PaymentModal from "./PaymentModal";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }: { product: IProduct }) => {
  const backend = import.meta.env.VITE_BACKEND;
  const navigate = useNavigate();
  const { user } = useUserStore();

  const [isUserEnrolled, setIsUserEnrolled] = useState<boolean>(false);
  const [inWishlist, setInWishlist] = useState<boolean>(false);

  // Use the reusable payment hook
  const {
    isModalOpen,
    loading,
    error,
    success,
    agreeTerms,
    paymentMethod,
    cardName,
    cardNumber,
    cardExpiry,
    cardCVV,
    openModal,
    closeModal,
    handlePayment,
    setAgreeTerms,
    setPaymentMethod,
    setCardName,
    setCardNumber,
    setCardExpiry,
    setCardCVV,
  } = usePayment({
    item: {
      _id: product._id,
      title: product.title,
      price: product.price,
      image: typeof product.image === "string" ? product.image : "",
      teacher: product.teacher,
    },
    itemType: "product",
  });

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

  const togglePurchaseModal = async () => {
    if (!user) {
      // Handle authentication - could redirect to sign in
      return;
    }

    // If product is free, enroll directly without payment modal
    if (product.price === 0) {
      try {
        const res = await axios.post(
          `${backend}/user/enroll-product`,
          {
            userId: user._id,
            productId: product._id,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (res.status === 200) {
          // Refresh the page or update the UI to show enrolled state
          window.location.reload();
        }
      } catch (error) {
        console.log(error);
        // Handle error - could show a toast notification here
      }
    } else {
      // For paid products, show payment modal
      openModal();
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlePayment();
  };

  return (
    <>
      <li
        className="course-card"
        onClick={() => {
          if (!user?._id) {
            navigate("/sign-in");
            return;
          }

          if (isUserEnrolled) {
            alert("Already enrolled");
          } else if (!isModalOpen) togglePurchaseModal();
        }}
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

      {/* Reusable Payment Modal */}
      <PaymentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        item={{
          _id: product._id,
          title: product.title,
          price: product.price,
          image: typeof product.image === "string" ? product.image : "",
          teacher: product.teacher,
        }}
        itemType="product"
        user={
          user
            ? {
                fullName: user.fullName,
                email: user.email || "",
                userId: user._id,
              }
            : null
        }
        loading={loading}
        error={error}
        success={success}
        agreeTerms={agreeTerms}
        paymentMethod={paymentMethod}
        cardName={cardName}
        cardNumber={cardNumber}
        cardExpiry={cardExpiry}
        cardCVV={cardCVV}
        onPaymentSubmit={handlePaymentSubmit}
        setAgreeTerms={setAgreeTerms}
        setPaymentMethod={setPaymentMethod}
        setCardName={setCardName}
        setCardNumber={setCardNumber}
        setCardExpiry={setCardExpiry}
        setCardCVV={setCardCVV}
      />
    </>
  );
};

export default ProductCard;
