import "../css/ContactCards.css";

import { IoCallOutline } from "react-icons/io5";
import { SlLocationPin } from "react-icons/sl";
import { HiOutlineMailOpen } from "react-icons/hi";

const data = [
  {
    icon: <SlLocationPin />,
    title: "العنوان",
    content: "قطر",
    description: "خلال تعاوننا، أثبت موظفو الشركة أنفسهم",
  },
  {
    icon: <IoCallOutline />,
    title: "الهاتف",
    content: "+97450003499",
    description: "خلال تعاوننا، أثبت موظفو الشركة أنفسهم",
  },
  {
    icon: <HiOutlineMailOpen />,
    title: "البريد الالكتروني",
    content: "teachhappily@outlook.com",
    description: "خلال تعاوننا، أثبت موظفو الشركة أنفسهم",
  },
];

const ContactCards = () => {
  return (
    <section className="contact-cards-section">
      <ul className="contact-cards-list">
        {data.map((card, index) => {
          return (
            <li key={index} className="contact-card">
              <div className="card-icon">{card.icon}</div>
              <h1 className="card-title">{card.title}</h1>
              <p className="card-content">{card.content}</p>
              <p className="card-description">{card.description}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default ContactCards;
