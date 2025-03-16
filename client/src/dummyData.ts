import ITestimonial from "./interfaces/ITestimonial";
import ITeacher from "./interfaces/ITeacher";

import tutor from "./assets/Tutor1.jpg";

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
  {
    _id: "4",
    studentName: "محمد",
    content:
      "شكرا لك أختي منيرة على هذا اللقاء الؤائع و المميز , كان حواؤا ممتعا و مليئا بالمعلومات القيمة و المثرية, أسعدني طرحك و اثراؤك للنقاش بكل ما هو مفيد و ملهم",
  },
  {
    _id: "5",
    studentName: "محمد",
    content: "التنظيم رائع و المدربة مميزة"
  },
  {
    _id: "6",
    studentName: "محمد",
    content: "كل الشكر و التقدير على هذه الورشة الممتعة"
  },
];

export const tutors: ITeacher[] = [
  {
    _id: "1",
    fullname: "منيرة المنيخر",
    image: tutor,
    profession: "مصمم الويب والتطبيقات",
  },
  {
    _id: "2",
    fullname: "ناديا غادر",
    image: tutor,
    profession: "الرياضيات والهندسة",
  },
  {
    _id: "3",
    fullname: "فاطمة محمد الشروقي",
    image: tutor,
    profession: "اللغات",
  },
  {
    _id: "4",
    fullname: "أميرة اليافعي",
    image: tutor,
    profession: "مصمم الويب والتطبيقات",
  },
  {
    _id: "5",
    fullname: "ميثا الرمزاني",
    image: tutor,
    profession: "الرياضيات والهندسة",
  },
  {
    _id: "6",
    fullname: "عائشة سعود التميمي",
    image: tutor,
    profession: "اللغات",
  },
  {
    _id: "7",
    fullname: "آسيا البوعينين",
    image: tutor,
    profession: "اللغات",
  },
];
