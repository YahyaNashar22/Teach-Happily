import SocialMedia from "../components/SocialMedia";
import Testimonials from "../components/Testimonials";
import TutorCards from "../components/TutorCards";
import TutorsHero from "../components/TutorsHero";
import TutorsMeet from "../components/TutorsMeet";

const TutorsPage = () => {
  return (
    <main>
      <TutorsHero />
      <TutorsMeet />
      <TutorCards />
      <Testimonials />
      <SocialMedia />
    </main>
  );
};

export default TutorsPage;
