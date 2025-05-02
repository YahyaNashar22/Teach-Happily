import "../css/ContactPage.css";

import { FormEvent, useState } from "react";
import ContactUsHero from "../components/ContactUsHero";
import axios from "axios";

import mails from "../assets/Vector Smart Object-1.png";

const ContactPage = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!email || !message) {
        alert("يرجى ملء البريد الإلكتروني والرسالة.");
        return;
      }

      // Optionally add more email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("يرجى إدخال بريد إلكتروني صالح.");
        return;
      }

      const res = await axios.post(
        `${backend}/email/contact-email`,
        {
          email,
          message,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        alert("تم إرسال رسالتك بنجاح!");
        setEmail("");
        setMessage("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="contact-from-page-wrapper">
      <img
        src={mails}
        width={300}
        alt="messages"
        loading="lazy"
        className="contact-mails-img"
      />

      <ContactUsHero />
      <div className="contact-page-form-container">
        <form className="contact-page-form" onSubmit={handleSubmit}>
          <h2 className="contact-page-form-title">نرغب بسماع ارائك</h2>
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
            الرسالة
            <textarea
              className="contact-page-form-textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب رسالتك هنا"
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
        </form>
        <img
          src={mails}
          alt="messages"
          loading="lazy"
          className="contact-mails-img-2-teach"
        />
      </div>
    </main>
  );
};

export default ContactPage;
