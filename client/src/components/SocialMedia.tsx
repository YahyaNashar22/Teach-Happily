import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import "../css/SocialMedia.css";
import { FaXTwitter } from "react-icons/fa6";

const SocialMedia = () => {
  return (
    <section className="social-media-section">
      <div className="social-left">
        <h1 className="social-title">تابع شبكاتنا الاجتماعية</h1>

        <p className="social-text">ابق على اطلاع وتابعنا للحصول على الأخبار</p>
      </div>

      <ul className="social-right">
        <li className="social-ico">
          <a href="https://www.youtube.com/" target="_blank">
            <FaYoutube className="icon youtube" />
          </a>
        </li>
        <li className="social-ico">
          <a href="https://www.facebook.com/" target="_blank">
            <FaFacebook className="icon facebook" />
          </a>
        </li>
        <li className="social-ico">
          <a href="https://x.com/?lang=en" target="_blank">
            <FaXTwitter className="icon twitter" />
          </a>
        </li>
        <li className="social-ico">
          <a href="https://www.instagram.com/" target="_blank">
            <FaInstagram className="icon instagram" />
          </a>
        </li>
      </ul>
    </section>
  );
};

export default SocialMedia;
