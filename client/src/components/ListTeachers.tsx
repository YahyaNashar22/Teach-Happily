import { useEffect, useState } from "react";
import "../css/ListCategories.css";
import "../css/TeacherForm.css";
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
  Button,
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
      formData.append("description", selectedTeacher.description || "");

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
          اضافة مدرب
        </Button>

        <Typography variant="h4" gutterBottom style={{ color: "#8f438c" }}>
          المدربون
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
                  الوصف
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
                  <TableCell style={{ textAlign: "right", fontSize: "1.1rem" }}>
                    {teacher.description || "لا يوجد وصف"}
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
      {selectedTeacher && open && (
        <>
          {/* Dark overlay */}
          <div 
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              backgroundColor: 'rgba(0, 0, 0, 0.5)', 
              zIndex: 999 
            }}
            onClick={handleClose}
          />
          {/* Edit form */}
          <div className="category-form-container" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000, maxHeight: '90vh', overflowY: 'auto' }}>
          <h1 className="form-title">تعديل المدربة</h1>
          <form className="category-form">
            <label htmlFor="edit-name" className="dash-cat-label">
              اسم المدربة
            </label>
            <input
              type="text"
              id="edit-name"
              value={selectedTeacher.fullname}
              onChange={(e) =>
                setSelectedTeacher({
                  ...selectedTeacher,
                  fullname: e.target.value,
                })
              }
              required
              placeholder="أدخل اسم المدربة"
              className="dash-cat-inp"
            />

            <label htmlFor="edit-profession" className="dash-cat-label">
              اختصاص المدربة
            </label>
            <input
              type="text"
              id="edit-profession"
              value={selectedTeacher.profession}
              onChange={(e) =>
                setSelectedTeacher({
                  ...selectedTeacher,
                  profession: e.target.value,
                })
              }
              required
              placeholder="أدخل اختصاص المدربة"
              className="dash-cat-inp"
            />

            <label htmlFor="edit-description" className="dash-cat-label">
              وصف المدربة
            </label>
            <textarea
              id="edit-description"
              value={selectedTeacher.description || ""}
              onChange={(e) =>
                setSelectedTeacher({
                  ...selectedTeacher,
                  description: e.target.value,
                })
              }
              placeholder="أدخل وصف المدربة"
              className="dash-cat-inp"
              rows={4}
            />

            <label htmlFor="edit-image" className="dash-cat-label">
              صورة المدربة
            </label>
            <input
              type="file"
              id="edit-image"
              accept="image/*"
              onChange={(e) =>
                setSelectedTeacher({
                  ...selectedTeacher,
                  image: e.target.files?.[0] || selectedTeacher.image,
                })
              }
              className="dash-cat-inp"
            />

            <button type="button" onClick={handleUpdate} className="submit-btn">
              حفظ التعديلات
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="cancel-btn"
              style={{
                padding: "12px",
                fontSize: "1.1rem",
                fontWeight: "bold",
                color: "var(--accent-black)",
                backgroundColor: "var(--bg-grey)",
                border: "1px solid var(--divider-card)",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
            >
              إلغاء
            </button>
          </form>
        </div>
        </>
      )}
    </div>
  );
};

export default ListTeachers;
