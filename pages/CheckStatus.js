import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import styles from "@/styles/Headerbar.module.css";
import Link from "@mui/material/Link";
import axios from "axios";
import { BiSolidPrinter } from "react-icons/bi";

const CheckStatus = () => {
  const [timecheck, setTimeCheck] = useState([]);
  const [graduate, setGraduate] = useState([]);
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grTime, setGrTime] = useState(null);
  const [grTimeUpload, setGrTimeUpload] = useState(null);
  const [grName, setGrName] = useState(null);
  const [grResult, setGrResult] = useState(null);
  const [grId, setGrId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const st_id = localStorage.getItem("st_id");

    if (!st_id) {
      console.error("No st_id found in localStorage. Redirecting to login...");
      router.push("/Login");
      return;
    }
    const modified_st_id = st_id.substring(1);
    console.log("modified code: ", modified_st_id);

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:4000/files?st_id=${modified_st_id}`
        );
        const response2 = await axios.get(
          `http://localhost:4000/graduate_checkings?st_id=${modified_st_id}`
        );
        const Response3 = await axios.get(
          `http://localhost:4000/graduate_checkings/`
        );
        setTimeCheck(Response3.data);
        console.log("Files Response:", response.data); 
        console.log("Graduate Checkings Response:", response2.data); 

        setGraduate(response.data);
        setResult(response2.data);
        const matchingGraduate = response2.data.find(
          (res) => res.gr_id === modified_st_id
        );
        if (matchingGraduate) {
          setGrTime(matchingGraduate.gr_time);
  
        }
        const matchingGraduate2 = response.data.find(
          (res) => res.fi_id === modified_st_id
        );
        if (matchingGraduate2) {
          setGrName(matchingGraduate2.fi_name);
          setGrId(matchingGraduate2.fi_id);
          setGrTimeUpload(matchingGraduate2.fi_time);
          setGrResult(matchingGraduate2.fi_result);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]); // Consider adding st_id here if necessary

  const checklistItems = [
    "เอกสารแสดงผลการเรียน",
    "หนังสือรับรองการฝึกงาน",
    "English Proficiency Exam",
    "คะแนนทดสอบวัดความสามารถภาษาอังกฤษ",
    "ใบตรวจปริญญานิพนธ์",
    "ข้อมูล พ.ศ ขึ้นในระบบ",
    "การทดสอบสมรรถภาพทางดิจิทัล (Digital Literacy Test)",
    "เอกสารแสดงผลการเรียน (CSB08)",
  ];

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div>
        <LinearProgress
          sx={{
            backgroundColor: "#f1a27a",
            "& .MuiLinearProgress-bar": { backgroundColor: "#EB6725" },
          }}
        />
      </div>
    );
  }

  return (
    <center style={{ marginTop: "2rem" }}>
      <div className={`${styles.content}`}>
        <h1 style={{ color: "#07AA9F" }} className={styles.title}>
          ตรวจสอบการจบการศึกษา
        </h1>
        <div style={{ display: "flex", gap: "15rem" }}>
          {grId && <p>รหัสนักศึกษา: {grId}</p>}
          {grTimeUpload && <p>แนบไฟล์ล่าสุด: {grTimeUpload}</p>}
        </div>
        <div style={{ display: "flex", gap: "15rem" }}>
          {" "}
          {grName && <p>ชื่อนักศึกษา: {grName}</p>}{" "}
          {grTime && <p>ตรวจสอบล่าสุด: {grTime}</p>}
        </div>

        <Paper style={{ marginTop: "1rem" }}>
          {/* <Typography>{timecheck.gr_time}</Typography> */}
          {loading ? (
            <Typography>...</Typography>
          ) : graduate.length === 0 || result.length === 0 ? (
            <Typography>ยังไม่ได้ตรวจสอบการจบการศึกษา</Typography> // Display a message if no data is found
          ) : (
            <>
              <Table sx={{ color: "#07AA9F" }}>
                <TableHead>
                  <TableRow>
                    <TableCell>ชื่อเอกสาร</TableCell>
                    <TableCell>สถานะ</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {graduate.map((graduated, index) => {
                    const matchingResult = result.find(
                      (res) => res.gr_id === graduated.fi_id
                    );

                    return checklistItems.map((item, checklistIndex) => (
                      <TableRow key={checklistIndex}>
                        <TableCell>{item}</TableCell>
                        <TableCell
                          style={{
                            color: matchingResult
                              ? matchingResult.gr_result[checklistIndex] ===
                                "ผ่าน"
                                ? "green" // Green for "ผ่าน"
                                : matchingResult.gr_result[checklistIndex] ===
                                  "ไม่ผ่าน"
                                ? "#EB6725" // Red for "ไม่ผ่าน"
                                : "black" // Black for "รอการตรวจสอบ"
                              : "black", // Default to black for "รอการตรวจ"
                          }}
                        >
                          {matchingResult &&
                          matchingResult.gr_result[checklistIndex]
                            ? matchingResult.gr_result[checklistIndex]
                            : "รอผลการตรวจ"}
                        </TableCell>
                        <TableCell>
                          {graduated.fi_file &&
                          graduated.fi_file[checklistIndex] ? (
                            <Link
                              href={`/upload/${graduated.fi_file[checklistIndex]
                                .split("/")
                                .slice(3)
                                .join("/")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              underline="hover"
                              sx={{ color: "#07AA9F" }}
                            >
                              ตรวจสอบไฟล์
                            </Link>
                          ) : (
                            "ไม่มีไฟล์"
                          )}
                        </TableCell>
                      </TableRow>
                    ));
                  })}
                </TableBody>
              </Table>
            </>
          )}
        </Paper>
          <h4>result: {grResult}</h4>
        <Button
          variant="contained"
          onClick={handlePrint}
          className="printButton"
          sx={{
            marginTop: 2,
            backgroundColor: "#07AA9F",
            color: "white",
            gap: 1,
            border: "2px solid transparent",
            "&:hover": {
              borderColor: "#07AA9F",
              color: "#07AA9F",
              backgroundColor: "rgba(7, 170, 159, 0.1)",
            },
          }}
        >
          <BiSolidPrinter size={23} />
          พิมพ์ข้อมูล
        </Button>
        <h4 style={{ marginTop: "1rem", color: "red" }}>
          {" "}
          * กรุณาพิมพ์ข้อมูลเพื่อนำไปประกอบการยื่นใบลาออกที่สำนักงาน{" "}
        </h4>
        <h5 style={{ marginTop: "1rem", color: "#edede9" }}>
          {" "}
          © 2024 Department of Computer and Information Sciences, Faculty of
          Applied Science (KMUTNB){" "}
        </h5>
      </div>
    </center>
  );
};

export default CheckStatus;
