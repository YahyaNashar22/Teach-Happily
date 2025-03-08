import ICategory from "./interfaces/ICategory";
import ICourse from "./interfaces/ICourse";

import pic from "./assets/dummy_data.jpg";

export const categories: ICategory[] = [
  {
    _id: "1",
    name: "as",
  },
];

export const courses: ICourse[] = [
  {
    _id: "1",
    image: pic,
    title: "string",
    level: "string",
    duration: "string",
    teacherName: "string",
    category: categories[0],
    price: 120,
    enrolledStudents: "string",
    content: ["string"],
    whatWillYouLearn: ["string"],
    requirements: ["string"],
    audience: ["string"],
  },
];
