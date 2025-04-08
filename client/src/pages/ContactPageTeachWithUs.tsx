import { FormEvent, useState } from "react";
import ContactCards from "../components/ContactCards";
import ContactUsHero from "../components/ContactUsHero";
import Map from "../components/Map";
import SocialMedia from "../components/SocialMedia";
import "../css/ContactPage.css";

const ContactPageTeachWithUs = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [profession, setProfession] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

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

    alert("تم إرسال رسالتك بنجاح!");
    setFullName("");
    setEmail("");
    setProfession("");
    setMessage("");
    setFile(null);
  };

  return (
    <main>
      <ContactUsHero />
      <form className="contact-page-form" onSubmit={handleSubmit}>
        <h2 className="contact-page-form-title"> أرغب بالانضمام </h2>

        <label className="contact-page-form-label">
          الاسم الكامل:
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
          البريد الإلكتروني:
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
          المهنة:
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
          الرسالة:
          <textarea
            className="contact-page-form-textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="اكتب رسالتك هنا"
            required
          />
        </label>

        <label className="contact-page-form-label">
          تحميل الملف (PDF فقط):
          <input
            className="contact-page-form-input"
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            required
          />
        </label>

        <button className="contact-page-form-button" type="submit">
          إرسال
        </button>
      </form>

      <ContactCards />
      <Map />
      <SocialMedia />
    </main>
  );
};

export default ContactPageTeachWithUs;
