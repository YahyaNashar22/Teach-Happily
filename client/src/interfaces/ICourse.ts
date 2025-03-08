import ICategory from "./ICategory";

interface ICourse {
  _id: string;
  image: string;
  title: string;
  level: string;
  duration: string;
  teacherName: string;
  category: ICategory;
  price: number;
  enrolledStudents: string[];
  content: string[];
  whatWillYouLearn: string[];
  requirements: string[];
  audience: string[];
}

export default ICourse;
