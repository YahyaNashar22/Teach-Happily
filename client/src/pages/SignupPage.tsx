import { useState } from "react";
import "../css/Signup.css";
import { Link } from "react-router-dom";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    // Add form submission logic here
  };

  return (
    <main className="wrapper">
      <h1 className="title">تسجيل الطالب</h1>
      <form className="form-container" onSubmit={handleSubmit}>
        <label className="sign-label">
          الاسم
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            placeholder="الاسم"
          />
        </label>

        <label className="sign-label">
          العائلة
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            placeholder="العائلة"
          />
        </label>

        <label className="sign-label">
          البريد الالكتروني
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="البريد الالكتروني"
          />
        </label>

        <label className="sign-label">
          كلمة المرور
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>

        <label className="sign-label">
          تأكيد كلمة المرور
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </label>

        <div className="btn-container">
          <Link to="/" className="back">العودة</Link>
          <button type="submit" className="sign-submit">سجل الآن</button>
        </div>
        <Link to="/sign-in" className="sign-in">لدي حساب بالفعل</Link>
      </form>
    </main>
  );
};

export default SignupPage;
