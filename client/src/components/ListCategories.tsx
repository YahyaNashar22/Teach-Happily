import { useEffect, useState } from "react";
import "../css/ListCategories.css";
import ICategory from "../interfaces/ICategory";
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
import CategoryForm from "./CategoryForm";

const ListCategories = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );
  const [newCategoryFrom, setNewCategoryForm] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${backend}/category`);
        setCategories(res.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [backend, open, newCategoryFrom]);

  const handleOpen = (category: ICategory) => {
    setSelectedCategory(category);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCategory(null);
  };

  const handleUpdate = async () => {
    if (!selectedCategory) return;
    try {
      const formData = new FormData();
      formData.append("name", selectedCategory.name);
      formData.append("description", selectedCategory.description);
      formData.append("title", selectedCategory.title);

      if (selectedCategory.image) {
        formData.append("image", selectedCategory.image);
      }

      await axios.patch(
        `${backend}/category/${selectedCategory._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setCategories(
        categories.map((cat) =>
          cat._id === selectedCategory._id ? selectedCategory : cat
        )
      );
      handleClose();
    } catch (error) {
      console.log(error);
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
          onClick={() => setNewCategoryForm(true)}
        >
          اضافة خانة
        </Button>

        <Typography variant="h4" gutterBottom style={{ color: "#8f438c" }}>
          الفئات
        </Typography>
      </div>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper} style={{ direction: "rtl" }}>
          {newCategoryFrom && (
            <CategoryForm setNewCategoryForm={setNewCategoryForm} />
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
                >العدد</TableCell>
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
                  العنوان
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
              {categories.map((category, i) => (
                <TableRow
                  key={category._id}
                  style={{ cursor: "pointer", fontSize: "1.1rem" }}
                  hover
                  onClick={() => handleOpen(category)}
                >
                  <TableCell style={{ textAlign: "right", fontSize: "1.1rem" }}>
                    {i}
                  </TableCell>
                  <TableCell style={{ textAlign: "right", fontSize: "1.1rem" }}>
                    {category._id}
                  </TableCell>
                  <TableCell style={{ textAlign: "right", fontSize: "1.1rem" }}>
                    {category.name}
                  </TableCell>
                  <TableCell style={{ textAlign: "right", fontSize: "1.1rem" }}>
                    {category.title}
                  </TableCell>
                  <TableCell style={{ textAlign: "right", fontSize: "1.1rem" }}>
                    {category.description}
                  </TableCell>
                  <TableCell>
                    <img
                      src={`${backend}/${category.image}`}
                      alt={category.name}
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
      {selectedCategory && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>تعديل الفئة</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="dense"
              label="الاسم"
              value={selectedCategory.name}
              onChange={(e) =>
                setSelectedCategory({
                  ...selectedCategory,
                  name: e.target.value,
                })
              }
            />
            <TextField
              fullWidth
              margin="dense"
              label="العنوان"
              value={selectedCategory.title}
              onChange={(e) =>
                setSelectedCategory({
                  ...selectedCategory,
                  title: e.target.value,
                })
              }
            />
            <TextField
              fullWidth
              margin="dense"
              label="الوصف"
              value={selectedCategory.description}
              onChange={(e) =>
                setSelectedCategory({
                  ...selectedCategory,
                  description: e.target.value,
                })
              }
            />
            <input
              type="file"
              onChange={(e) =>
                setSelectedCategory({
                  ...selectedCategory,
                  image: e.target.files?.[0] || selectedCategory.image,
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

export default ListCategories;
