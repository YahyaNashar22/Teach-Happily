import "../css/DigitalProductsHero.css";

import magnifier from "../assets/Website design-07.png";

const DigitalProductsHero = () => {
  return (
    <section className="digital-products-hero">
      <div className="digital-products-content">
        <h1 className="digital-products-title">المنتجات الرقمية</h1>

        <p className="digital-products-purple-text">
          لأنّ التّعليم رحلة ممتعة، نقدّم لك منصّة و خبرة تعليميّة
        </p>

        <p className="digital-products-yellow-text"> تفوق 10 سنوات</p>

        <p className="digital-products-purple-text">
          لجعل التّدريس متعة لك ولطلّابك.
        </p>
      </div>
      <img
        src={magnifier}
        alt="magnifier"
        loading="lazy"
        className="digital-products-magnifier"
        width={500}
      />
    </section>
  );
};

export default DigitalProductsHero;
