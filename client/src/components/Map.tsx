import "../css/Map.css";

const Map = () => {
  return (
    <section className="map-section">
      <iframe
        title="Google Map - Qatar"
        className="map-frame"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28973.95494843082!2d51.51227577679674!3d25.28544730689705!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e45c5dc04ea5f1d%3A0xf24de59b6530ebfa!2sDoha%2C%20Qatar!5e0!3m2!1sen!2s!4v1614731947164!5m2!1sen!2s"
        allowFullScreen={false}
        loading="lazy"
      ></iframe>
    </section>
  );
};

export default Map;
