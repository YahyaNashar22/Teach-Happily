import { useParams } from "react-router-dom";

const CoursePage = () => {
  const { slug } = useParams();
  return <main>{slug}</main>;
};

export default CoursePage;
