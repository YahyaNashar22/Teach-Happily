import { useEffect, useState } from "react";
import "../css/ListCategories.css";
import axios, { AxiosError } from "axios";
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
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
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

  const handleOpen = (category: ICourse) => {
    setSelectedCourse(category);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCourse(null);
  };

  const handleUpdate = async () => {
    if (!selectedCourse) return;
    try {
      const formData = new FormData();
      formData.append("title", selectedCourse.title);
      formData.append("description", selectedCourse.description);
      formData.append("level", selectedCourse.level);
      formData.append("duration", selectedCourse.duration);
      formData.append("price", selectedCourse.price.toString());
      formData.append("whatWillYouLearn", selectedCourse.whatWillYouLearn);
      formData.append("requirements", selectedCourse.requirements);
      formData.append("audience", selectedCourse.audience);

      if (selectedCourse.image) {
        formData.append("image", selectedCourse.image);
      }

      await axios.patch(`${backend}/course/${selectedCourse._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setCourses(
        courses.map((course) =>
          course._id === selectedCourse._id ? selectedCourse : course
        )
      );
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (courseId: string) => {
    try {
      await axios.delete(`${backend}/course/${courseId}`);

      handleClose();
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        alert(error.response?.data.message);
      }
    }
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
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>تعديل الدورة</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="dense"
              label="الاسم"
              value={selectedCourse.title}
              onChange={(e) =>
                setSelectedCourse({
                  ...selectedCourse,
                  title: e.target.value,
                })
              }
            />
            <TextField
              fullWidth
              margin="dense"
              label="الوصف"
              value={selectedCourse.description}
              onChange={(e) =>
                setSelectedCourse({
                  ...selectedCourse,
                  description: e.target.value,
                })
              }
            />
            <TextField
              fullWidth
              margin="dense"
              label="المرحلة"
              value={selectedCourse.level}
              onChange={(e) =>
                setSelectedCourse({
                  ...selectedCourse,
                  level: e.target.value,
                })
              }
            />
            <TextField
              fullWidth
              margin="dense"
              label="المدة"
              value={selectedCourse.duration}
              onChange={(e) =>
                setSelectedCourse({
                  ...selectedCourse,
                  duration: e.target.value,
                })
              }
            />
            <TextField
              fullWidth
              margin="dense"
              label="السعر"
              value={selectedCourse.price}
              onChange={(e) =>
                setSelectedCourse({
                  ...selectedCourse,
                  price: Number(e.target.value),
                })
              }
            />
            <TextField
              fullWidth
              margin="dense"
              label=" ماذا ستتعلم"
              value={selectedCourse.whatWillYouLearn}
              onChange={(e) =>
                setSelectedCourse({
                  ...selectedCourse,
                  whatWillYouLearn: e.target.value,
                })
              }
              multiline
              rows={4}
            />
            <TextField
              fullWidth
              margin="dense"
              label="المتطلبات"
              value={selectedCourse.requirements}
              onChange={(e) =>
                setSelectedCourse({
                  ...selectedCourse,
                  requirements: e.target.value,
                })
              }
              multiline
              rows={4}
            />

            <TextField
              fullWidth
              margin="dense"
              label="الجمهور"
              value={selectedCourse.audience}
              onChange={(e) =>
                setSelectedCourse({
                  ...selectedCourse,
                  audience: e.target.value,
                })
              }
              multiline
              rows={4}
            />
            <input
              type="file"
              onChange={(e) =>
                setSelectedCourse({
                  ...selectedCourse,
                  image: e.target.files?.[0] || selectedCourse.image,
                })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              إلغاء
            </Button>
            <Button onClick={handleUpdate} color="primary">
              حفظ
            </Button>

            <Button
              onClick={() => handleDelete(selectedCourse._id)}
              color="error"
            >
              حذف الدورة
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default ListCourses;
