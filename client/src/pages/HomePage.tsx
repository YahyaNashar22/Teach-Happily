import HomeCategories from "../components/HomeCategories";
import HomeContactInfo from "../components/HomeContactInfo";
import HomeHero from "../components/HomeHero";
import HomeNumbers from "../components/HomeNumbers";
import HomeTutorsBlock from "../components/HomeTutorsBlock";
import LatestCourses from "../components/LatestCourses";
import Testimonials from "../components/Testimonials";

const HomePage = () => {
  return (
    <main>
      <HomeHero />
      <HomeTutorsBlock />
      <LatestCourses />
      <HomeNumbers />
      <HomeContactInfo />
      <HomeCategories />
      <Testimonials />
    </main>
  );
};

export default HomePage;
