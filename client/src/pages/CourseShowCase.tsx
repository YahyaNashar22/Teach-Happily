import "../css/CourseShowCase.css";

const CourseShowCase = () => {
  return <main className="course-showcase-wrapper"></main>;
};

export default CourseShowCase;

{
  /* <button
type="button"
onClick={handleCourseNavigation}
className="btn enroll-btn"
>
عرض المحتوى
</button> */
}

// const handleCourseNavigation = () => {
//     if (!user) {
//       navigate("/sign-in");
//     } else {
//       navigate(`/course-showcase/:${course.slug}`);
//     }
//   };

{
  /* Purchase Confirmation Modal */
}
//   {isPurchaseModal && (
//     <div className="modal-overlay">
//       <div className="modal">
//         <h2 className="modal-title">تأكيد الشراء</h2>
//         <p className="modal-text">
//           هل أنت متأكد أنك تريد شراء الدورة <strong>{course.title}</strong>{" "}
//           مقابل{" "}
//           <span className="modal-price">$ {course.price.toFixed(2)}</span>؟
//         </p>
//         <div className="modal-actions">
//           <button
//             className="btn btn-confirm"
//             disabled={loading}
//             onClick={confirmPurchase}
//           >
//             تأكيد
//           </button>
//           <button
//             className="btn btn-cancel"
//             disabled={loading}
//             onClick={() => setIsPurchaseModal(false)}
//           >
//             إلغاء
//           </button>
//         </div>
//       </div>
//     </div>
//   )}

// const confirmPurchase = () => {
//     // TODO: Handle actual purchase logic (API request, payment, etc.)

//     // TODO: MOVE THIS FUNCTION TO AFTER SUCCESS PAYMENT
//     enroll();

//     setIsPurchaseModal(false);
//   };

//   // TODO: MOVE THIS FUNCTION TO AFTER SUCCESS PAYMENT
//   const enroll = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.post(
//         `${backend}/user/enroll-course`,
//         {
//           userId: user?._id,
//           courseId: course._id,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (res.status === 200) {
//         setIsUserEnrolled(true);
//       }
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const [isPurchaseModal, setIsPurchaseModal] = useState<boolean>(false);
//   const [loading, setLoading] = useState<boolean>(false);
