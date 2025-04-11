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
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import TeacherForm from "./TeacherForm";
import ITeacher from "../interfaces/ITeacher";

const ListTeachers = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedTeacher, setSelectedTeacher] = useState<ITeacher | null>(null);
  const [newTeacherForm, setNewTeacherForm] = useState<boolean>(false);

  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${backend}/teacher`);
        setTeachers(res.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, [backend, open, newTeacherForm]);

  const handleOpen = (teacher: ITeacher) => {
    setSelectedTeacher(teacher);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTeacher(null);
  };

  const handleUpdate = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!selectedTeacher) return;
    try {
      const formData = new FormData();
      formData.append("fullname", selectedTeacher.fullname);
      formData.append("profession", selectedTeacher.profession);

      if (selectedTeacher.image) {
        formData.append("image", selectedTeacher.image);
      }

      await axios.patch(`${backend}/teacher/${selectedTeacher._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTeachers(
        teachers.map((teacher) =>
          teacher._id === selectedTeacher._id ? selectedTeacher : teacher
        )
      );
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="teacher-list"
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
          onClick={() => setNewTeacherForm(true)}
        >
          اضافة مدربة
        </Button>

        <Typography variant="h4" gutterBottom style={{ color: "#8f438c" }}>
          المدربات
        </Typography>
      </div>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper} style={{ direction: "rtl" }}>
          {newTeacherForm && (
            <TeacherForm setNewTeacherForm={setNewTeacherForm} />
          )}

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
                  الاختصاص
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
              {teachers.map((teacher) => (
                <TableRow
                  key={teacher._id}
                  style={{ cursor: "pointer", fontSize: "1.1rem" }}
                  hover
                  onClick={() => handleOpen(teacher)}
                >
                  <TableCell style={{ textAlign: "right", fontSize: "1.1rem" }}>
                    {teacher._id}
                  </TableCell>
                  <TableCell style={{ textAlign: "right", fontSize: "1.1rem" }}>
                    {teacher.fullname}
                  </TableCell>
                  <TableCell style={{ textAlign: "right", fontSize: "1.1rem" }}>
                    {teacher.profession}
                  </TableCell>

                  <TableCell>
                    <img
                      src={`${backend}/${teacher.image}`}
                      alt={teacher.fullname}
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
      {selectedTeacher && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>تعديل الفئة</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="dense"
              label="الاسم"
              value={selectedTeacher.fullname}
              onChange={(e) =>
                setSelectedTeacher({
                  ...selectedTeacher,
                  fullname: e.target.value,
                })
              }
            />
            <TextField
              fullWidth
              margin="dense"
              label="العنوان"
              value={selectedTeacher.profession}
              onChange={(e) =>
                setSelectedTeacher({
                  ...selectedTeacher,
                  profession: e.target.value,
                })
              }
            />
            <input
              type="file"
              onChange={(e) =>
                setSelectedTeacher({
                  ...selectedTeacher,
                  image: e.target.files?.[0] || selectedTeacher.image,
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
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default ListTeachers;
