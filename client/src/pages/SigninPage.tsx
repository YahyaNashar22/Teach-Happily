import { useState } from "react";
import "../css/Signin.css";
import { Link } from "react-router-dom";

const SigninPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      <h1 className="title">تسجيل الدخول</h1>
      <form className="form-container" onSubmit={handleSubmit}>
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

        <div className="btn-container">
          <Link to="/" className="back">
            العودة
          </Link>
          <button type="submit" className="sign-submit">الدخول</button>
        </div>
        <Link to="/sign-up" className="sign-up">
          ليس لدي حساب
        </Link>
      </form>
    </main>
  );
};

export default SigninPage;
