import { useEffect, useState } from "react";
import "../css/ListCategories.css";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import CourseForm from "./CourseForm";
import ICourse from "../interfaces/ICourse";

const ListCourses = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [newCourseForm, setNewCourseForm] = useState<boolean>(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await axios.post(`${backend}/course/get-all`);
        setCourses(res.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [backend, open, newCourseForm]);

  const handleOpen = async (course: ICourse) => {
    setLoading(true);
    try {
      // Fetch full course details by ID or slug
      const res = await axios.get(`${backend}/course/get/${course.slug}`);
      setSelectedCourse(res.data.payload);
      setOpen(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCourse(null);
  };

  return (
    <div
      className="category-list"
      style={{ direction: "ltr", textAlign: "right" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          marginBottom: "10px",
        }}
      >
        <Button
          style={{
            backgroundColor: "var(--purple)",
            color: "var(--white)",
            fontSize: "1.1rem",
          }}
          onClick={() => setNewCourseForm(true)}
        >
          اضافة دورة
        </Button>

        <Typography variant="h4" gutterBottom style={{ color: "#8f438c" }}>
          الدورات
        </Typography>
      </div>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper} style={{ direction: "rtl" }}>
          {newCourseForm && <CourseForm setNewCourseForm={setNewCourseForm} />}

          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "#8f438c", color: "white" }}>
                <TableCell
                  style={{
                    textAlign: "right",
                    color: "white",
                    fontSize: "1.2rem",
                  }}
                >
                  الرقم التعريفي
                </TableCell>
                <TableCell
                  style={{
                    textAlign: "right",
                    color: "white",
                    fontSize: "1.2rem",
                  }}
                >
                  الاسم
                </TableCell>

                <TableCell
                  style={{
                    textAlign: "right",
                    color: "white",
                    fontSize: "1.2rem",
                  }}
                >
                  الوصف
                </TableCell>
                <TableCell
                  style={{
                    textAlign: "right",
                    color: "white",
                    fontSize: "1.2rem",
                  }}
                >
                  المرحلة
                </TableCell>
                <TableCell
                  style={{
                    textAlign: "right",
                    color: "white",
                    fontSize: "1.2rem",
                  }}
                >
                  المدة
                </TableCell>
                <TableCell
                  style={{
                    textAlign: "right",
                    color: "white",
                    fontSize: "1.2rem",
                  }}
                >
                  السعر
                </TableCell>
                <TableCell
                  style={{
                    textAlign: "right",
                    color: "white",
                    fontSize: "1.2rem",
                  }}
                >
                  ماذا ستتعلم
                </TableCell>
                <TableCell
                  style={{
                    textAlign: "right",
                    color: "white",
                    fontSize: "1.2rem",
                  }}
                >
                  المتطلبات
                </TableCell>
                <TableCell
                  style={{
                    textAlign: "right",
                    color: "white",
                    fontSize: "1.2rem",
                  }}
                >
                  الجمهور
                </TableCell>
                <TableCell
                  style={{
                    textAlign: "right",
                    color: "white",
                    fontSize: "1.2rem",
                  }}
                >
                  الصورة
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <TableRow
                  key={course._id}
                  style={{ cursor: "pointer", fontSize: "1.1rem" }}
                  hover
                  onClick={() => handleOpen(course)}
                >
                  <TableCell style={{ textAlign: "right", fontSize: "1.1rem" }}>
                    {course._id}
                  </TableCell>
                  <TableCell style={{ textAlign: "right", fontSize: "1.1rem" }}>
                    {course.title}
                  </TableCell>

                  <TableCell style={{ textAlign: "right", fontSize: "1.1rem" }}>
                    {course.description}
                  </TableCell>
                  <TableCell style={{ textAlign: "right", fontSize: "1.1rem" }}>
                    {course.level}
                  </TableCell>
                  <TableCell style={{ textAlign: "right", fontSize: "1.1rem" }}>
                    {course.duration}
                  </TableCell>

                  <TableCell style={{ textAlign: "right", fontSize: "1.1rem" }}>
                    {course.price}
                  </TableCell>

                  <TableCell style={{ textAlign: "right", fontSize: "1.1rem" }}>
                    {course.whatWillYouLearn}
                  </TableCell>

                  <TableCell style={{ textAlign: "right", fontSize: "1.1rem" }}>
                    {course.requirements}
                  </TableCell>

                  <TableCell style={{ textAlign: "right", fontSize: "1.1rem" }}>
                    {course.audience}
                  </TableCell>

                  <TableCell>
                    <img
                      src={`${backend}/${course.image}`}
                      alt={course.title}
                      width={50}
                      height={50}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {selectedCourse && (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>تعديل الدورة</DialogTitle>
          <DialogContent>
            <CourseForm setNewCourseForm={setOpen} course={selectedCourse} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ListCourses;
