import "../css/CourseShowCase.css";

import { useNavigate, useParams } from "react-router-dom";
import { useUserStore } from "../store";
import { useEffect, useState } from "react";
import IProduct from "../interfaces/IProduct";
import { usePayment } from "../hooks/usePayment";
import PaymentModal from "../components/PaymentModal";
import axios from "axios";
import Loading from "../components/Loading";
import ProductShowCaseHero from "../components/ProductShowCaseHero";

const ProductShowCase = () => {
  const backend = import.meta.env.VITE_BACKEND;

  const navigate = useNavigate();
  const { slug } = useParams();
  const { user } = useUserStore();
  const [pageLoading, setPageLoading] = useState<boolean>(false);

  const [product, setProduct] = useState<IProduct | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setPageLoading(true);
      try {
        const res = await axios.get(`${backend}/digital-product/get/${slug}`);

        if (!res.data.payload) {
          navigate("*");
        }

        setProduct(res.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setPageLoading(false);
      }
    };

    fetchProduct();
  }, [backend, navigate, slug]);

  // Use the reusable payment hook
  const { isModalOpen, openModal, closeModal } = usePayment({
    item: {
      _id: product?._id ?? "",
      title: product?.title ?? "",
      price: product?.price ?? 0,
      image: typeof product?.image === "string" ? product?.image : "",
      teacher: product?.teacher,
    },
    itemType: "product",
  });

  const togglePurchaseModal = async () => {
    if (!user) {
      // Handle authentication - could redirect to sign in
      return;
    }

    // If product is free, enroll directly without payment modal
    if (product?.price === 0) {
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

  return (
    <>
      {pageLoading ? (
        <Loading />
      ) : (
        <main>
          <ProductShowCaseHero />
          <section className="course-showcase-wrapper">
            {/* Upper Section  */}
            <div className="course-showcase-upper">
              {/* Upper right Section  */}
              <div className="course-showcase-upper-right"></div>
              <img
                src={`${backend}/${product?.image}`}
                alt={product?.title}
                loading="lazy"
                className="course-showcase-thumbnail"
              />
            </div>

            {/* Upper left Section  */}
            <div className="course-showcase-upper-left">
              <h1 className="course-showcase-course-title">{product?.title}</h1>
              <p
                style={{
                  fontSize: "1.2rem",
                  margin: "12px 0px",
                  fontWeight: "500",
                }}
              >
                {product?.description}
              </p>

              <div className="course-showcase-course-teacher">
                <img
                  src={`${backend}/${product?.teacher?.image}`}
                  loading="lazy"
                  alt={product?.teacher.fullname}
                  className="course-showcase-course-teacher-img"
                />
                <p className="course-showcase-course-teacher-name">
                  تقديم {product?.teacher.fullname}
                </p>
              </div>
              <button
                type="button"
                onClick={togglePurchaseModal}
                className="btn enroll-btn course-showcase-buy"
              >
                {product?.price === 0 ? "سجل مجاناً" : "شراء الان"}
              </button>
            </div>
          </section>

          {/* Reusable Payment Modal */}
          <PaymentModal
            isOpen={isModalOpen}
            onClose={closeModal}
            item={{
              _id: product?._id ?? "",
              title: product?.title ?? "",
              price: product?.price ?? 0,
              image: typeof product?.image === "string" ? product?.image : "",
              teacher: product?.teacher,
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
          />
        </main>
      )}
    </>
  );
};

export default ProductShowCase;
