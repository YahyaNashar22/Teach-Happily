import CategoryForm from "../components/CategoryForm";
import CourseForm from "../components/CourseForm";
import TeacherForm from "../components/TeacherForm";

const Dashboard = () => {
  return (
    <main>
      <CategoryForm />
      <TeacherForm />
      <CourseForm />
    </main>
  );
};

export default Dashboard;
