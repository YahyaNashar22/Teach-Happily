import "../css/ContactPage.css";

import { FormEvent, useState } from "react";
import ContactUsHero from "../components/ContactUsHero";
import axios from "axios";

// import mails from "../assets/Vector Smart Object-1.png";

const ContactPageTeachWithUs = () => {
  const backend = import.meta.env.VITE_BACKEND;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [profession, setProfession] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!fullName || !email || !profession || !message || !file) {
        alert("يرجى ملء جميع الحقول.");
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("يرجى إدخال بريد إلكتروني صالح.");
        return;
      }

      // Validate file type (PDF)
      if (file && file.type !== "application/pdf") {
        alert("يرجى تحميل ملف PDF فقط.");
        return;
      }

      // Create FormData and append form fields and the file
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("profession", profession);
      formData.append("message", message);
      formData.append("file", file);

      const res = await axios.post(
        `${backend}/email/teach-with-us-email`,
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
        setProfession("");
        setMessage("");
        setFile(null);
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
            <h2 className="contact-page-form-title"> أرغب بالانضمام </h2>

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
              المهنة
              <input
                className="contact-page-form-input"
                type="text"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="مهنك"
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
              تحميل الملف (PDF فقط)
              <input
                className="contact-page-form-input"
                type="file"
                accept="application/pdf"
                onChange={(e) =>
                  setFile(e.target.files ? e.target.files[0] : null)
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

export default ContactPageTeachWithUs;
