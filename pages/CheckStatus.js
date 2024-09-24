import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import styles from "@/styles/Headerbar.module.css";
import axios from "axios";

const CheckStatus = () => {
  const [graduate, setGraduate] = useState([]);
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const st_id = localStorage.getItem("st_id");

    if (!st_id) {
      console.error("No st_id found in localStorage. Redirecting to login...");
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/files?st_id=${st_id}`);
        const response2 = await axios.get(`http://localhost:4000/graduate_checkings?st_id=${st_id}`);
        setGraduate(response.data);
        setResult(response2.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const checklistItems = [
    "เอกสารแสดงผลการเรียน",
    "หนังสือรับรองการฝึกงาน",
    "English Proficiency Exam",
    "คะแนนทดสอบวัดความสามารถภาษาอังกฤษ",
    "ใบตรวจปริญญานิพนธ์",
    "ข้อมูล พ.ศ ขึ้นในระบบ",
  ];

  return (
    <center style={{ marginTop: "2rem" }}>
      <div className={`${styles.content}`}>
        <h1 style={{ color: "#07AA9F" }}>ตรวจสอบการจบการศึกษา</h1>
        <Paper>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Checklist</TableCell>
                  <TableCell>File</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              {graduate.map((graduated, index) => {
                const matchingResult = result.find(
                  (res) => res.gr_id === graduated.fi_id
                );

                return (
                  <TableBody key={index}>
                    {checklistItems.map((item, checklistIndex) => (
                      <TableRow key={checklistIndex}>
                        <TableCell>{item}</TableCell>
                        <TableCell>
                          {graduated.fi_file && graduated.fi_file[checklistIndex] ? (
                            <a
                              href={`/upload/${graduated.fi_file[checklistIndex]
                                .split("/")
                                .slice(3)
                                .join("/")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              เปิดไฟล์ PDF
                            </a>
                          ) : (
                            "ไม่มีไฟล์"
                          )}
                        </TableCell>
                        <TableCell>
                          {matchingResult && matchingResult.gr_result[checklistIndex]
                            ? matchingResult.gr_result[checklistIndex]
                            : "รอผลการตรวจ"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                );
              })}
            </Table>
          )}
        </Paper>
      </div>
    </center>
  );
};

export default CheckStatus;
