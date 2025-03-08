import ICategory from "./interfaces/ICategory";
import ICourse from "./interfaces/ICourse";

import pic from "./assets/dummy_data.jpg";

export const categories: ICategory[] = [
  {
    _id: "1",
    name: "تطوير ويب",
  },
];

export const courses: ICourse[] = [
  {
    _id: "1",
    image: pic,
    title: "كيف تصنع موقع احترافي",
    level: "ابتدائي",
    duration: "4 ساعات",
    teacherName: "أستاذ",
    category: categories[0],
    price: 120,
    enrolledStudents: ["string"],
    content: ["string"],
    whatWillYouLearn: ["كيف تصنع موقع", "كيف تفعل التجاوب مع البحث"],
    requirements: ["معرفة html css", "معرفة javascript"],
    audience: ["من يريدون الوصول للاحترافية", "من يريد انشاء مواقع"],
  },
  {
    _id: "2",
    image: pic,
    title: "كيف تصنع ذكاء اصطناعي باستخدام ollamas",
    level: "ابتدائي",
    duration: "12 ساعة",
    teacherName: "أستاذ",
    category: categories[0],
    price: 120,
    enrolledStudents: ["string"],
    content: ["string"],
    whatWillYouLearn: ["كيف تصنع موقع", "كيف تفعل التجاوب مع البحث"],
    requirements: ["معرفة html css", "معرفة javascript"],
    audience: ["من يريدون الوصول للاحترافية", "من يريد انشاء مواقع"],
  },
];
