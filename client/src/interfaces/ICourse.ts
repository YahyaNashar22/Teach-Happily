import ICategory from "./ICategory";
import ITeacher from "./ITeacher";

interface ICourse {
  _id: string;
  image: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  teacher: ITeacher;
  category: ICategory;
  price: number;
  enrolledStudents: string[];
  content: [
    {
      title: string;
      url: string;
    }
  ];
  whatWillYouLearn: string;
  requirements: string;
  audience: string;
  createdAt: string;
  slug: string;
}

export default ICourse;
