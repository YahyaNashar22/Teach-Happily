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
  Button,
} from "@mui/material";
import axios from "axios";
import IUser from "../interfaces/IUser";
import { MdAccountCircle } from "react-icons/md";

const UserList = () => {
  const backend = import.meta.env.VITE_BACKEND;
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${backend}/user/`);
        console.log(res);
        setUsers(res.data.payload);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [backend]);

  const exportToCSV = () => {
    if (users.length === 0) {
      alert("لا توجد بيانات للتصدير");
      return;
    }

    // Create CSV content
    const csvContent = [
      // Header row
      ["الاسم", "البريد الإلكتروني"],
      // Data rows
      ...users.map((user) => [user.fullName, user.email]),
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
      `list-users-${new Date().toISOString().split("T")[0]}.csv`
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
          المستخدمين
        </Typography>
      </div>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "#8f438c" }}>
                <TableCell style={{ color: "white" }}>الاسم</TableCell>
                <TableCell style={{ color: "white" }}>
                  البريد الإلكتروني
                </TableCell>
                <TableCell style={{ color: "white" }}>الملف</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <MdAccountCircle
                      style={{
                        color: "#8f438c",
                        fontSize: "28px",
                        cursor: "pointer",
                      }}
                    />
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

export default UserList;
