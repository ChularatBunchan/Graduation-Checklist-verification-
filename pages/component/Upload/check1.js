import React, { useState, useEffect } from "react";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  Modal,
  LinearProgress,
  Box,
  Typography,
  Alert,
  Snackbar,
  Button,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Link from "@mui/material/Link";
import { MdCloudUpload } from "react-icons/md";

function Check1() {
  const router = useRouter();
  const [uploadStatus, setUploadStatus] = useState(null);
  const [files, setFiles] = useState(Array(6).fill(null));
  const [student, setStudent] = useState(null);
  const [times, setTimes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const st_id = localStorage.getItem("st_id");
    if (!st_id) {
      console.error("No st_id found in localStorage. Redirecting to login...");
      return;
    }

    const modified_st_id = st_id.substring(1);
    console.log("modified code: ", modified_st_id);

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:4000/students?st_id=${modified_st_id}`
        );
        const response2 = await axios.get(
          `http://localhost:4000/files?st_id=${modified_st_id}`
        );
        setStudent(response.data);
        setTimes(response2.data);
        console.log("res student", response.data); // Log response to check data
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleFileChange = (index) => (e) => {
    const newFiles = [...files];
    const file = e.target.files[0];

    // Check if the file type is PDF
    if (file && file.type !== "application/pdf") {
      setUploadStatus("PDF");
      setSnackbarOpen(true); // Show alert popup for error
      console.error("Only PDF files are allowed.");
      return;
    }

    // Update files array and URL for preview
    newFiles[index] = file;
    setFiles(newFiles);
    setSelectedFile(file); // Store the selected file
    setFileURL(URL.createObjectURL(file)); // Create a URL to view the file
  };

  const UploadClick = async () => {
    if (!student) {
      setUploadStatus("error");
      setSnackbarOpen(true); // Show alert popup for error
      return;
    }

    const formData = new FormData();
    let allFilesUploaded = true;

    files.forEach((file, index) => {
      if (file) {
        formData.append(`files[]`, file);
        formData.append("order", index + 1);
      } else {
        setUploadStatus("warning"); // Warning if any file is missing
        setSnackbarOpen(true); // Show alert popup for warning
        allFilesUploaded = false;
      }
    });

    if (!allFilesUploaded) return;
    const now = new Date();
    const uploadTime = now.toLocaleDateString("en-GB");
    formData.append("std", student[0].st_id);
    formData.append("stdName", student[0].st_name);
    formData.append("fi_time", uploadTime);

    console.log("Form data entries:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      setProgress(0); // Reset progress
      setShowPopup(true); // Show the popup
      const response = await axios.post(
        "http://localhost:4000/files",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            if (total) {
              setProgress(Math.round((loaded * 100) / total)); // Simplified progress calculation
            }
          },
        }
      );
      setUploadStatus("success");
      setSnackbarOpen(true);
      await handleFileUpload(student[0].st_id);
    } catch (error) {
      console.error("Error uploading file: ", error.message);
      setUploadStatus("error");
      setSnackbarOpen(true);
    } finally {
      setShowPopup(false); // Hide the popup when upload is done
    }
  };

  const handleFileUpload = async (fi_id, e) => {
    try {
      // Update file status via API
      await axios.patch(`http://localhost:4000/files/${fi_id}`, {
        fi_status: "ยังไม่ได้ตรวจสอบ",
      });
    } catch (error) {
      console.error("Error updating file status:", error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false); // Close the Snackbar
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

  if (!student || student.length === 0) {
    return <div>ไม่พบข้อมูลนักศึกษา กรุณาเข้าสู่ระบบอีกครั้ง</div>;
  }

  const titles = [
    "เอกสารแสดงผลการเรียน",
    "หนังสือรับรองผลการฝึกงาน",
    "ทดสอบวัดความสามารถภาษาอังกฤษ (KMUTNB-TEPC)",
    "คะแนนภาษาอังกฤษ",
    "ใบปะหน้าปริญญานิพนธ์",
    "ระบบบริการตรวจสอบผู้สำเร็จการศึกษา",
    "การทดสอบสมรรถภาพทางดิจิทัล (Digital Literacy Test)",
  ];

  const details = [
    <>
      นักศึกษาต้องเรียนรายวิชาที่จัดการเรียนเป็นภาษาอังกฤษตลอดหลักสูตรรวมแล้วไม่น้อยกว่าร้อยละ
      50
      <br />- เกณฑ์การนับหน่วยกิตรายวิชาภาษาอังกฤษ หลักสูตร 59 (135 หน่วยกิต)
      <br />- เกณฑ์การนับหน่วยกิตรายวิชาภาษาอังกฤษ หลักสูตร 64 (128 หน่วยกิต)
      <br />
      โดยเอกสารใบรับรองผลการศึกษา (Transcript) หรือ บันทึกไฟล์ ผลการศึกษา จาก
      Reg Kmutnb
      <br />
      เอกสารใบรับรองผลการศึกษา (Transcript) สามารถยื่นคำร้องได้ในระบบ Reg Kmutnb
      <br />
      ผลการศึกษา สามารถ Ctrl + p และเลือก Printer เป็น Microsoft Print to PDF
      และบันทึกไฟล์ได้
    </>,

    <>
      ใบรับรองการผ่านการฝึกงาน โดยต้องผ่านการฝึกงานในสถานประกอบการ อย่างน้อย 240
      ชั่วโมง
    </>,

    <>
      ด้วยนักศึกษาระดับปริญญาตรีจะต้องเข้ารับการทดสอบวัดสมิทธิภาพทางภาษาอังกฤษก่อนสำเร็จการศึกษา
      (English Proficiency Exam/ KMUTNB-TEPC)
      <br />
      โดยสามารถใช้การทดสอบความสามารถทางภาษาอังกฤษที่จัดโดยศูนย์ทดสอบของมหาวิทยาลัย
      <br />
      ทั้งนี้สามารถนำผลการวัดระดับภาษาอังกฤษจากสถาบันทดสอบต่างๆ ที่มีอายุไม่เกิน
      2 ปี นับตั้งแต่วันประกาศผลการทดสอบจากสถาบันทดสอบ
      <br />
      จนถึงวันที่แสดงผลการวัดระดับภาษาอังกฤษ
      ยื่นแทนการทดสอบวัดสมิทธิภาพทางภาษาอังกฤษก่อนสำเร็จการศึกษาของมหาวิทยาลัยได้
    </>,

    <>
      เพื่อเป็นการประกันคุณภาพนักศึกษาด้านการใช้ภาษาอังกฤษ
      <Button
        variant="text"
        onClick={handleClickOpen}
        sx={{ color: "#077c74" }}
      >
        เกรณ์คะแนน
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <img
            src="/Eng.png"
            alt="English Proficiency"
            width={500}
            height={300}
          />
        </DialogContent>
      </Dialog>
    </>,

    <>กรุณาแนบใบปะหน้าสำหรับปริญญานิพนธ์ในรูปแบบ PDF</>,

    <>
      <Link href="http://202.28.17.14/stdcheck/" underline="hover">
        ระบบบริการตรวจสอบผู้สำเร็จการศึกษา
      </Link>
    </>,

    <>
      แนบผลการทดสอบสมรรถภาพทางดิจิทัล (Digital Literacy Test) ในรูปแบบ PDF
      <Link
        sx={{ marginLeft: 1 }}
        href="https://dl.kmutnb.ac.th/"
        underline="hover"
      >
        รายละเอียดการสอบเพิ่มเติม
      </Link>
    </>,
  ];
  return (
    <div
      className={styles.Check}
      style={{
        width: "60%",
        margin: "0 auto",
        textAlign: "center",
        marginTop: "2rem",
      }}
    >
      <center>
        <h1>
          สวัสดี{" "}
          {student && student.length > 0
            ? student[0].st_name
            : "ไม่พบข้อมูลนักศึกษา"}
        </h1>
        <h3 style={{ color: "red" }}>*โปรดแนบเฉพาะไฟล์ PDF เท่านั้น*</h3>
        {titles.map((title, index) => (
          <Accordion key={index} style={{ color: "#07AA9F", width: "80%" }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <h2>
                {index + 1}. {title}
              </h2>
            </AccordionSummary>
            <AccordionDetails>
              <p style={{ color: "black" }}> {details[index]} </p>
              <Button
                variant="contained"
                component="label"
                sx={{
                  backgroundColor: "#07AA9F",
                  color: "white",
                  gap: 1,
                  border: "2px solid transparent",
                  "&:hover": {
                    backgroundColor: "white",
                    color: "#07AA9F",
                    border: "2px solid #07AA9F",
                  },
                }}
              >
                <MdCloudUpload size={25} />
                แนบไฟล์
                <input type="file" hidden onChange={handleFileChange(index)} />
              </Button>
              {files[index] && (
                <div style={{ marginTop: "10px" }}>
                  <Typography variant="body1">
                    <strong>ไฟล์ที่เลือก: </strong> {files[index].name}
                  </Typography>
                  <Button
                    variant="outlined"
                    sx={{
                      marginTop: 1,
                      borderColor: "#07AA9F",
                      color: "#07AA9F",
                      "&:hover": {
                        borderColor: "#07AA9F",
                        backgroundColor: "rgba(7, 170, 159, 0.1)",
                      },
                    }}
                    onClick={() =>
                      window.open(URL.createObjectURL(files[index]))
                    }
                  >
                    เปิดไฟล์
                  </Button>
                </div>
              )}
            </AccordionDetails>
          </Accordion>
        ))}

        <div className={styles.button}>
          <button onClick={UploadClick}>upload</button>
        </div>
        {uploadStatus && (
          <div>
            {uploadStatus === "success"
              ? "สำเร็จ"
              : "เกิดข้อผิดพลาดในการแนบไฟล์"}
          </div>
        )}
      </center>

      {/* Popup with Progress Bar */}
      <Modal open={showPopup}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography>uploading... {progress}%</Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: "#E0E0E0",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#07AA9F",
              },
            }}
          />
        </Box>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={
            uploadStatus === "success"
              ? "success"
              : uploadStatus === "warning"
              ? "warning"
              : "error"
          }
          sx={{ width: 350, height: 40, fontSize: 15, fontWeight: 5 }}
        >
          {uploadStatus === "success" && "แนบไฟล์สำเร็จ!"}
          {uploadStatus === "warning" && "กรุณาแนบไฟล์ให้ครบถ้วน!"}
          {uploadStatus === "error" &&
            "เกิดข้อผิดพลาดในการแนบไฟล์ กรุณาลองใหม่อีกครั้ง!"}
          {uploadStatus === "PDF" && "โปรดแนบเฉพาะไฟล์ PDF เท่านั้น!!"}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Check1;
