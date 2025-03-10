import ICategory from "./ICategory";
import ITeacher from "./ITeacher";

interface ICourse {
  _id: string;
  image: string;
  title: string;
  level: string;
  duration: string;
  teacher: ITeacher;
  category: ICategory;
  price: number;
  enrolledStudents: string[];
  content: string[];
  whatWillYouLearn: string[];
  requirements: string[];
  audience: string[];
}

export default ICourse;
