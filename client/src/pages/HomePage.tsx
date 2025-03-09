import HomeHero from "../components/HomeHero";
import HomeNumbers from "../components/HomeNumbers";
import HomeTutorsBlock from "../components/HomeTutorsBlock";
import LatestCourses from "../components/LatestCourses";

const HomePage = () => {
  return (
    <main>
      <HomeHero />
      <HomeTutorsBlock />
      <LatestCourses />
      <HomeNumbers />
    </main>
  );
};

export default HomePage;
