import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Modal,
  Box,
} from "@mui/material";
import styles from "@/styles/Headerbar.module.css";
import axios from "axios";

const OffCheck = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statuses, setStatuses] = useState({});
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [submittedFiles, setSubmittedFiles] = useState({});

  const checklistTitles = [
    "เอกสารแสดงผลการเรียน",
    "หนังสือรับรองการฝึกงาน",
    "English Proficiency Exam",
    "คะแนนทดสอบวัดความสามารถภาษาอังกฤษ",
    "ใบตรวจปริญญานิพนธ์",
    "ข้อมูล พ.ศ ขึ้นในระบบ",
  ];

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:4000/files");
        setFiles(response.data);
        const initialStatuses = response.data.reduce((acc, file) => {
          acc[file.fi_id] = Array(6).fill("รอผลการตรวจ");
          return acc;
        }, {});
        setStatuses(initialStatuses);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching files:", error);
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  const handleSubmit = async (fi_id) => {
    const selectedFile = files.find((file) => file.fi_id === fi_id);
    const resultStatuses = statuses[fi_id];

    if (!resultStatuses || resultStatuses.length === 0) {
      alert("Status results are not properly set.");
      return;
    }

    try {
      await axios.post("http://localhost:4000/graduate_checkings", {
        gr_result: resultStatuses,
        gr_id: selectedFile.fi_id,
        gr_name: selectedFile.fi_name,
      });

      alert("Checked Successfully!!!");
      setSubmittedFiles((prev) => ({ ...prev, [fi_id]: true }));
      setOpen(false);
    } catch (error) {
      console.error("Error submitting status:", error.message);
    }
  };

  const handleOpen = (file) => {
    setSelectedFile(file);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <center style={{ marginTop: "2rem" }}>
      <div className={`${styles.content}`}>
        <h1 style={{ color: "#07AA9F" }}>ตรวจสอบการจบการศึกษา</h1>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student ID</TableCell>
                  <TableCell>Student Name</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.fi_id}>
                    <TableCell>{file.fi_id}</TableCell>
                    <TableCell>{file.fi_name}</TableCell>
                    <TableCell>
                      {file.fi_status === "ได้รับการตรวจสอบแล้ว" ? (
                        <Typography>ได้รับการตรวจสอบแล้ว</Typography>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpen(file)}
                          disabled={submittedFiles[file.fi_id]} // Disable if already submitted
                        >
                          ตรวจสอบ
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 600,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            {selectedFile && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(selectedFile.fi_id);
                }}
              >
                <Paper>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell>Checklist</TableCell>
                          <TableCell>File</TableCell>
                          <TableCell>สถานะ</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {checklistTitles.map((title, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{title}</TableCell>
                            <TableCell>
                              {Array.isArray(selectedFile.fi_file) &&
                              selectedFile.fi_file[index] ? (
                                <a
                                  href={`/upload/${selectedFile.fi_file[index]
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
                              <select
                                value={statuses[selectedFile.fi_id][index]}
                                onChange={(e) => {
                                  const newStatuses = { ...statuses };
                                  newStatuses[selectedFile.fi_id][index] = e.target.value;
                                  setStatuses(newStatuses);
                                }}
                              >
                                <option value="รอผลการตรวจ">รอผลการตรวจ</option>
                                <option value="ผ่าน">ผ่าน</option>
                                <option value="ไม่ผ่าน">ไม่ผ่าน</option>
                              </select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </form>
            )}
          </Box>
        </Modal>
      </div>
    </center>
  );
};

export default OffCheck;
