import ICategory from "./ICategory";
import IContent from "./IContent";
import ITeacher from "./ITeacher";

interface ICourse {
  _id: string;
  image: string | File;
  title: string;
  description: string;
  level: string;
  duration: string;
  teacher: ITeacher;
  category: ICategory;
  price: number;
  enrolledStudents: string[];
  demo: string;
  content: IContent[];
  whatWillYouLearn: string;
  requirements: string;
  audience: string;
  createdAt: string;
  slug: string;
}

export default ICourse;
