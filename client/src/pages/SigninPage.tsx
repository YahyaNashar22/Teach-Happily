import { useState } from "react";
import "../css/Signin.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUserStore } from "../store";

const SigninPage = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const { setUser } = useUserStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${backend}/user/login`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const token = response.data.payload;
      localStorage.setItem("token", token);

      const userResponse = await axios.get(`${backend}/user/get-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(userResponse.data.payload);

      navigate("/");
    } catch (error) {
      console.error(error);
      setError("خطأ في البريد او كلمة المرور");
    } finally {
      setLoading(false);
    }
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
        {error && <div className="error-message">{error}</div>}
        <div className="btn-container">
          <Link to="/" className="back">
            العودة
          </Link>
          <button type="submit" disabled={loading} className="sign-submit">
            الدخول
          </button>
        </div>
        <Link to="/sign-up" className="sign-up">
          ليس لدي حساب
        </Link>
      </form>
    </main>
  );
};

export default SigninPage;
