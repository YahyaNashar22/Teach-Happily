import ICategory from "./interfaces/ICategory";
import ICourse from "./interfaces/ICourse";

import pic from "./assets/dummy_data.jpg";
import ITestimonial from "./interfaces/ITestimonial";

export const categories: ICategory[] = [
  {
    _id: "1",
    name: "تطوير ويب",
    image: pic,
  },
  {
    _id: "2",
    name: "تطوير ويب",
    image: pic,
  },
  {
    _id: "3",
    name: "تطوير ويب",
    image: pic,
  },
  {
    _id: "4",
    name: "تطوير ويب",
    image: pic,
  },
  {
    _id: "5",
    name: "تطوير ويب",
    image: pic,
  },
  {
    _id: "6",
    name: "تطوير ويب",
    image: pic,
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

export const testimonials: ITestimonial[] = [
  {
    _id: "1",
    studentName: "أحمد",
    content:
      "منصّة رائعة! أسلوب التدريس ممتع وتفاعلي، مما يجعل التعلم سهلاً ومشوقًا. لاحظت تحسنًا كبيرًا في فهمي للمحتوى بفضل الدروس المبسّطة والأنشطة التفاعلية",
  },
  {
    _id: "2",
    studentName: "لبلى",
    content:
      "أفضل تجربة تعليمية مررت بها! المحتوى منظم بشكل ممتاز، والمدرسون محترفون ويقدمون المعلومات بأسلوب واضح. أنصح بها لأي شخص يريد تعلّم بطريقة ممتعة!",
  },
  {
    _id: "3",
    studentName: "محمد",
    content:
      "أحببت طريقة تقديم الدروس والاختبارات التفاعلية التي تساعد على تثبيت المعلومات. Teach Happily جعلت عملية التعلّم أكثر متعة وسهولة",
  },
];
