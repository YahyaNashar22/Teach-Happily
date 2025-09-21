import { useEffect, useState } from "react";
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
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";
import ProductForm from "./ProductForm";
import IProduct from "../interfaces/IProduct";

const ListProducts = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [newProductForm, setNewProductForm] = useState<boolean>(false);

  const [open, setOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.post(`${backend}/digital-product/get-all`);
        setProducts(res.data.payload);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [backend, open]);

  const handleOpen = (product: IProduct) => {
    setSelectedProduct({ ...product });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  const handleUpdate = async () => {
    if (!selectedProduct) return;
    try {
      const formData = new FormData();
      formData.append("title", selectedProduct.title);
      formData.append("description", selectedProduct.description);
      formData.append("price", selectedProduct.price.toString());
      formData.append("product", selectedProduct.product);
      formData.append("teacher", selectedProduct.teacher._id);
      formData.append("category", selectedProduct.category._id);

      if (selectedProduct.image instanceof File) {
        formData.append("image", selectedProduct.image);
      }

      await axios.patch(
        `${backend}/digital-product/${selectedProduct._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${backend}/digital-product/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "1rem", direction: "rtl" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          marginBottom: "10px",
        }}
      >
        <Typography variant="h4" gutterBottom style={{ color: "#8f438c" }}>
          المنتجات الرقمية
        </Typography>

        <Button
          style={{
            backgroundColor: "var(--purple)",
            color: "var(--white)",
            fontSize: "1.1rem",
          }}
          onClick={() => setNewProductForm(true)}
        >
          اضافة منتج
        </Button>
      </div>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          {newProductForm && (
            <ProductForm setNewProductForm={setNewProductForm} />
          )}
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "#8f438c" }}>
                <TableCell style={{ color: "white" }}>العدد</TableCell>
                <TableCell style={{ color: "white" }}>الاسم</TableCell>
                <TableCell style={{ color: "white" }}>الوصف</TableCell>
                <TableCell style={{ color: "white" }}>السعر</TableCell>
                <TableCell style={{ color: "white" }}>رابط المنتج</TableCell>
                <TableCell style={{ color: "white" }}>الصورة</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, i) => (
                <TableRow
                  key={product._id}
                  hover
                  onClick={() => handleOpen(product)}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell>{i}</TableCell>
                  <TableCell>{product.title}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>
                    <a
                      href={`${backend}/${product.product}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "black" }}
                    >
                      عرض
                    </a>
                  </TableCell>
                  <TableCell>
                    <img
                      src={
                        typeof product.image === "string"
                          ? `${backend}/${product.image}`
                          : URL.createObjectURL(product.image)
                      }
                      alt="صورة المنتج"
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

      {selectedProduct && (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>تعديل المنتج</DialogTitle>
          <DialogContent>
            {[
              { label: "الاسم", key: "title" },
              { label: "الوصف", key: "description", multiline: true },
              { label: "السعر", key: "price" },
            ].map(({ label, key, multiline }) => (
              <TextField
                key={key}
                fullWidth
                label={label}
                margin="dense"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                value={(selectedProduct as any)[key]}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    [key]:
                      key === "price" ? Number(e.target.value) : e.target.value,
                  })
                }
                multiline={multiline}
                rows={multiline ? 4 : undefined}
              />
            ))}

            <label
              style={{
                marginTop: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              ملف المنتج
              <input
                type="file"
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    product: e.target.files?.[0] || selectedProduct.product,
                  })
                }
              />
            </label>

            <label
              style={{
                marginTop: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              صورة المنتج
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    image: e.target.files?.[0] || selectedProduct.image,
                  })
                }
              />
            </label>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>إلغاء</Button>
            <Button
              onClick={() => handleDelete(selectedProduct._id)}
              color="error"
            >
              حذف
            </Button>
            <Button onClick={handleUpdate} variant="contained" color="primary">
              حفظ
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default ListProducts;
