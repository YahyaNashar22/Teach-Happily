import "../css/ContactPage.css";

import { FormEvent, useState } from "react";
import ContactUsHero from "../components/ContactUsHero";
import axios from "axios";

// import mails from "../assets/Vector Smart Object-1.png";

const ContactPageDigitalProduct = () => {
  const backend = import.meta.env.VITE_BACKEND;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!fullName || !email || !message || !projectTitle || !image) {
        alert("يرجى ملء جميع الحقول.");
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("يرجى إدخال بريد إلكتروني صالح.");
        return;
      }

      // Prepare FormData for file upload
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("message", message);
      formData.append("projectTitle", projectTitle);
      formData.append("image", image);

      // Send data to backend
      const res = await axios.post(
        `${backend}/email/digital-product-email`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 200) {
        alert("تم إرسال رسالتك بنجاح!");
        setFullName("");
        setEmail("");
        setMessage("");
        setProjectTitle("");
        setImage(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="contact-from-page-wrapper">
      {/* <img
        src={mails}
        alt="messages"
        loading="lazy"
        className="contact-mails-img"
      /> */}

      <ContactUsHero />
      <div className="contact-page-form-container">
        <form className="contact-page-form" onSubmit={handleSubmit}>
          <div className="contact-page-form-bg">
            <h2 className="contact-page-form-title"> أرغب بعرض منتج رقمي</h2>

            <label className="contact-page-form-label">
              الاسم الكامل
              <input
                className="contact-page-form-input"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="الاسم الكامل"
                required
              />
            </label>

            <label className="contact-page-form-label">
              البريد الإلكتروني
              <input
                className="contact-page-form-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="بريدك الإلكتروني"
                required
              />
            </label>

            <label className="contact-page-form-label">
              اسم المنتج
              <input
                className="contact-page-form-input"
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="اسم المنتج"
                required
              />
            </label>

            <label className="contact-page-form-label">
              الرسالة
              <textarea
                className="contact-page-form-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="اكتب رسالتك هنا"
                required
              />
            </label>

            <label className="contact-page-form-label">
              تحميل الصورة
              <input
                className="contact-page-form-input"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setImage(e.target.files ? e.target.files[0] : null)
                }
                required
              />
            </label>

            <button
              disabled={loading}
              className="contact-page-form-button"
              type="submit"
            >
              إرسال
            </button>
          </div>
        </form>
        {/* <img
          src={mails}
          alt="messages"
          loading="lazy"
          className="contact-mails-img-2-teach"
        /> */}
      </div>
    </main>
  );
};

export default ContactPageDigitalProduct;
