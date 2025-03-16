import AboutUsBlog from "../components/AboutUsBlog";
import AboutUsHero from "../components/AboutUsHero";
import EducationLevel from "../components/EducationLevel";
import HomeNumbers from "../components/HomeNumbers";
import SocialMedia from "../components/SocialMedia";
import Testimonials from "../components/Testimonials";

const AboutPage = () => {
  return (
    <main>
      <AboutUsHero />
      <AboutUsBlog />
      <EducationLevel />
      <HomeNumbers />
      <Testimonials />
      <SocialMedia />
    </main>
  );
};

export default AboutPage;
