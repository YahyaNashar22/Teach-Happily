import "../css/AboutUsBlog.css";

import magnifier from "../assets/Website design-21.png";
import stars from "../assets/Website design-2.png";
import badge from "../assets/Website design-06.png";
import hand from "../assets/Website design-19.png";

const AboutUsBlog = () => {
  return (
    <section className="about-us-blog-wrapper">
      <div className="about-us-upper">
        <div className="about-us-upper-right">
          <h2 className="about-us-blog-header">عن منصة "علم بسعادة"</h2>
          <h3 className="about-us-blog-white-header">
            لأن المعلم السعيد يصنع الفرق
          </h3>
          <p className="about-us-upper-desc">
            في علّم بسعادة, نقدّم لكم مجموعة واسعة من الدّورات التّدريبية التي
            تهدف إلى تطوير مهارات المعلّمات وتعزيز قدرتهم على تقديم تعليم متميز.
          </p>
        </div>
        <img
          src={magnifier}
          alt="magnifier"
          loading="lazy"
          className="about-us-blog-magnifier"
          width={300}
        />
      </div>
      <h3 className="about-us-blog-subheader">الفكرة الأساسية :</h3>
      <div className="about-us-blog-text">
        التعليم رسالة سامية وقيمة إنسانية عظيمة، قد يواجه المعلم فيه تحديات
        وضغوطًا تؤثر على شغفه وحماسه. "هنا تأتي{" "}
        <strong style={{ color: "var(--purple)" }}>علم بسعادة</strong> لتعيد
        للمعلم متعة التدريس، وتساعده على الاستمتاع بمهنته من خلال تمكينه بأدوات
        واستراتيجيات حديثة تجعل التعليم تجربة أكثر إبداعًا، تأثيرًا، وسعادة.
      </div>

      <h3 className="about-us-blog-subheader">الهدف الأسمى: </h3>
      <div className="about-us-blog-text">
        <p
          style={{
            color: "var(--purple)",
            filter: "brightness(1.2)",
            marginBottom: "20px",
          }}
        >
          نؤمن بأن المعلم السعيد هو مفتاح التعليم الفعّال، ولهذا تسعى المنصة
          إلى:
        </p>

        <div className="about-us-goal-container">
          <ul>
            <li>
              تمكين المعلمين بأدوات واستراتيجيات تجعل التدريس أكثر متعة
              وتأثيرًا.
            </li>
            <li>
              مساعدة المعلمين على إدارة وقتهم وضغوطهم بطريقة ذكية، ليجدوا
              توازنًا بين العمل والحياة.
            </li>
            <li>
              تعزيز بيئة تعليمية تفاعلية ومبتكرة تجعل التعلم تجربة إيجابية
              للطلاب والمعلمين معًا.
            </li>
            <li>
              بناء مجتمع تعليمي داعم يتيح تبادل الخبرات وتطوير الأداء المهني.
            </li>
          </ul>
          <img
            src={stars}
            alt="stars"
            loading="lazy"
            className="about-us-blog-stars"
            width={300}
          />
        </div>
      </div>

      <div className="about-us-what-we-provide">
        <h3 className="about-us-blog-subheader-what-we-provide">ماذا نقدم؟</h3>
        <div className="about-us-blog-text">
          <ul className="about-us-blog-what-we-provide-list">
            <li>
              استشارات تعليمية فردية وجماعية لدعم المعلمين في تطوير مهاراتهم،
              مواجهة التحديات الصفية، وتحسين ممارساتهم التدريسية.
            </li>

            <li>
              أدوات واستراتيجيات عملية تساعد المعلمين على التخطيط، التنفيذ،
              والتقييم بطرق مبتكرة.
            </li>

            <li>
              مجتمع تفاعلي قريب من الواقع يجمع المعلمين والمعلمات لتبادل الخبرات
              وأفضل الممارسات التربوية.
            </li>

            <li>
              موارد رقمية قابلة للتحميل تساعد في تنظيم العملية التعليمية وجعلها
              أكثر كفاءة. كل ما تحتاجه لتكون معلمًا أكثر تأثيرًا، إبداعًا،
              وسعادة تجده هنا في "علم بسعادة"!
            </li>
          </ul>
        </div>
      </div>

      <div className="about-us-blog-why">
        <h3 className="about-us-blog-subheader-why">
          لماذا اسم "علم بسعادة"؟{" "}
        </h3>
        <p className="about-us-blog-text">
          لأننا نؤمن بأن المعلم السعيد ينقل طاقته الإيجابية إلى طلابه . لأن
          التعليم الفعّال لا يقتصر على المناهج والكتب، بل على شغف المعلم ورسالته
          .
          <strong
            style={{
              color: "var(--purple)",
              display: "block",
            }}
          >
            لأننا نريد أن يكون التعليم رحلة ممتعة، وليس عبئًا !
          </strong>
        </p>

        <img
          src={badge}
          alt="badge"
          loading="lazy"
          className="about-us-blog-badge"
          width={200}
        />

        <img
          src={hand}
          alt="hand"
          loading="lazy"
          className="about-us-blog-hand"
          width={200}
        />
      </div>
    </section>
  );
};

export default AboutUsBlog;
