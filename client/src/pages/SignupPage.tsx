import { useState } from "react";
import "../css/Signup.css";
import { Link, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useUserStore } from "../store";

const SignupPage = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const [error, setError] = useState<string>("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("كلمة المرور غير متطابقة");
      return; // Stop form submission if passwords don't match
    }
    try {
      const response = await axios.post(
        `${backend}/user/create-student`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
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
      console.log(error);
      if (error instanceof AxiosError) {
        setError(error.response?.data.message);
      } else {
        setError("حدث خطأ أثناء التسجيل");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="wrapper">
      <h1 className="title">تسجيل الطالب</h1>
      <form className="form-container" onSubmit={handleSubmit}>
        <label className="sign-label">
          الاسم
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            placeholder="الاسم"
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
        {/* Display error message */}
        {error && <div className="error-message">{error}</div>}{" "}
        <div className="btn-container">
          <Link to="/" className="back">
            العودة
          </Link>
          <button type="submit" disabled={loading} className="sign-submit">
            سجل الآن
          </button>
        </div>
        <Link to="/sign-in" className="sign-in">
          لدي حساب بالفعل
        </Link>
      </form>
    </main>
  );
};

export default SignupPage;
