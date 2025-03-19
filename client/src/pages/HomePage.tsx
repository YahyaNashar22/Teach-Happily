import HomeCategories from "../components/HomeCategories";
import HomeContactInfo from "../components/HomeContactInfo";
import HomeHeroNew from "../components/HomeHeroNew";
import HomeNumbers from "../components/HomeNumbers";
import HomeTutorsBlock from "../components/HomeTutorsBlock";
import LatestCourses from "../components/LatestCourses";
import Testimonials from "../components/Testimonials";

const HomePage = () => {
  return (
    <main>
      <HomeHeroNew />
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
