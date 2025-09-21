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
  IconButton,
  Button,
} from "@mui/material";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import INewsLetterEmail from "../interfaces/INewsLetterEmail";

const ListEmails = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const [emails, setEmails] = useState<INewsLetterEmail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchEmails = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${backend}/news-letter`);
        setEmails(res.data.emails);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [backend]);

  const handleDeleteEmail = async (emailId: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا البريد الإلكتروني؟")) {
      try {
        await axios.delete(`${backend}/news-letter/${emailId}`);
        // Refresh the emails list
        const res = await axios.get(`${backend}/news-letter`);
        setEmails(res.data.emails);
      } catch (error) {
        console.error("Error deleting email:", error);
        alert("حدث خطأ أثناء حذف البريد الإلكتروني");
      }
    }
  };

  const exportToCSV = () => {
    if (emails.length === 0) {
      alert("لا توجد بيانات للتصدير");
      return;
    }

    // Create CSV content
    const csvContent = [
      // Header row
      ["email"],
      // Data rows
      ...emails.map((email) => [email.email]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `newsletter-emails-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <Button
          variant="contained"
          onClick={exportToCSV}
          style={{
            backgroundColor: "var(--purple)",
            color: "white",
            fontSize: "1rem",
          }}
        >
          تصدير إلى CSV
        </Button>
        <Typography variant="h4" gutterBottom style={{ color: "#8f438c" }}>
          البريد الإلكتروني
        </Typography>
      </div>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "#8f438c" }}>
                <TableCell style={{ color: "white" }}>العدد </TableCell>
                <TableCell style={{ color: "white" }}>
                  البريد الإلكتروني
                </TableCell>
                <TableCell style={{ color: "white", width: "100px" }}>
                  الإجراءات
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {emails?.map((email, i) => (
                <TableRow key={email._id} hover>
                  <TableCell>{i}</TableCell>
                  <TableCell>{email.email}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleDeleteEmail(email._id)}
                      style={{ color: "#dc3545" }}
                      title="حذف البريد الإلكتروني"
                    >
                      <FaTrash />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default ListEmails;
