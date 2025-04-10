import "../css/ForgotPassword.css";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

const ForgotPassword = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const [phase, setPhase] = useState<1 | 2>(1);

  const [otpArray, setOtpArray] = useState<string[]>(Array(6).fill(""));

  const handleOTPChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/\D/, ""); // Only allow digits
    if (!value) return;

    const newOtp = [...otpArray];
    newOtp[index] = value;
    setOtpArray(newOtp);

    // Move to next input
    if (index < 5 && value) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      (nextInput as HTMLInputElement)?.focus();
    }

    setOtp(newOtp.join("")); // Update full OTP value
  };

  const handleOTPKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      const newOtp = [...otpArray];

      if (otpArray[index]) {
        // If current input is not empty, clear it
        newOtp[index] = "";
        setOtpArray(newOtp);
        setOtp(newOtp.join(""));
      } else if (index > 0) {
        // If already empty, move to previous and clear it
        const prevInput = document.getElementById(`otp-${index - 1}`);
        (prevInput as HTMLInputElement)?.focus();

        newOtp[index - 1] = "";
        setOtpArray(newOtp);
        setOtp(newOtp.join(""));
      }

      e.preventDefault(); // prevent default behavior
    }
  };

  const handleSendOTP = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const res = await axios.post(
        `${backend}/user/forgot-password`,
        {
          email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status == 200) {
        setPhase(2);
      }
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        setError(error.response?.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("كلمة المرور غير مطابفة");
    }

    try {
      setLoading(true);
      setError(null);

      const res = await axios.post(
        `${backend}/user/reset-password`,
        {
          email,
          password,
          otp,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status == 200) {
        navigate("/sign-in");
      }
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        setError(error.response?.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={"forgot-password-wrapper"}>
      {/* Entering the email to send the otp */}
      {phase === 1 && (
        <div className={"forgot-password-phase1"}>
          <h1 className={"forgot-password-title"}>أدخل البريد الالكتروني</h1>
          <form
            className={"forgot-password-emailForm"}
            onSubmit={handleSendOTP}
          >
            <label className={"forgot-password-formLabel"}>
              البريد الالكتروني
              <input
                type="email"
                className={"forgot-password-formInput"}
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                required
              />
            </label>
            <div className={"forgot-password-btnContainer"}>
              <Link to="/" className={"forgot-password-back"}>
                العودة
              </Link>

              <button
                type="button"
                className={"forgot-password-submit"}
                onClick={handleSendOTP}
                disabled={loading}
              >
                ارسل الرمز
              </button>
            </div>
            <p className={"forgot-password-error"}>{error}</p>
          </form>
        </div>
      )}

      {/* Validation otp and changing the password  */}
      {phase === 2 && (
        <div className={"forgot-password-phase1"}>
          <h1 className={"forgot-password-title"}>كلمة مرور جديدة</h1>
          <p className={"forgot-password-subTitle"}>
            لقد أرسلنا بريدًا إلكترونيًا يحتوي على رمز التحقق !
            <br /> إذا لم تجده في صندوق الوارد، يرجى التحقق من مجلد الرسائل غير
            المرغوب فيها (spam).
          </p>
          <form className={"forgot-password-emailForm"}>
            <label className={"forgot-password-formLabel"}>
              كلمة مرور جديدة
              <input
                type="password"
                className={"forgot-password-formInput"}
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                required
              />
            </label>

            <label className={"forgot-password-formLabel"}>
              تأكيد كلمة المرور
              <input
                type="password"
                className={"forgot-password-formInput"}
                value={confirmPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setConfirmPassword(e.target.value)
                }
                required
              />
            </label>

            <label className={"forgot-password-formLabel"}>
              رمز التحقق
              <div className={"forgot-password-otpContainer"}>
                {otpArray.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className={"forgot-password-otpInput"}
                    value={digit}
                    onChange={(e) => handleOTPChange(e, index)}
                    onKeyDown={(e) => handleOTPKeyDown(e, index)}
                  />
                ))}
              </div>
            </label>

            <div className={"forgot-password-btnContainer"}>
              <Link to="/" className={"forgot-password-back"}>
                العودة
              </Link>

              <button
                type="button"
                className={"forgot-password-submit"}
                onClick={handlePasswordReset}
                disabled={loading}
              >
                تغيير كلمة المرور
              </button>
            </div>
            <p className={"forgot-password-error"}>{error}</p>
          </form>
        </div>
      )}
    </main>
  );
};

export default ForgotPassword;
