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
  Select,
  MenuItem,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import styles from "@/styles/Headerbar.module.css";
import Link from "@mui/material/Link";
import axios from "axios";

const SnackbarFeedback = ({ open, handleClose, severity, message }) => (
  <Snackbar
    open={open}
    autoHideDuration={6000}
    onClose={handleClose}
    anchorOrigin={{ vertical: "top", horizontal: "center" }}
  >
    <Alert onClose={handleClose} severity={severity}>
      {message}
    </Alert>
  </Snackbar>
);

const OffCheck = () => {
  const [files, setFiles] = useState([]);
  const [timecheck, setTimeCheck] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statuses, setStatuses] = useState({});
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [submittedFiles, setSubmittedFiles] = useState({});


  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const checklistTitles = [
    "เอกสารแสดงผลการเรียน",
    "หนังสือรับรองการฝึกงาน",
    "English Proficiency Exam",
    "คะแนนทดสอบวัดความสามารถภาษาอังกฤษ",
    "ใบตรวจปริญญานิพนธ์",
    "ข้อมูล พ.ศ ขึ้นในระบบ",
    "การทดสอบสมรรถภาพทางดิจิทัล (Digital Literacy Test)",
    "เอกสารแสดงผลการเรียน (CSB08)",
  ];

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:4000/files");
        setFiles(response.data);
        const Response2 = await axios.get(
          `http://localhost:4000/graduate_checkings/`
        );
        setTimeCheck(Response2.data);
        const initialStatuses = response.data.reduce((acc, file) => {
          acc[file.fi_id] = Array(8).fill("รอผลการตรวจ");
          return acc;
        }, {});
        setStatuses(initialStatuses);
      } catch (error) {
        console.error("Error fetching files:", error);
        handleSnackbar(
          "Error fetching files. Please try again later.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  const handleSnackbar = (message, severity) => {
    setSnackbarState({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbarState({ ...snackbarState, open: false });
  };

  const handleSubmit = async (fi_id) => {
    const selectedFile = files.find((file) => file.fi_id === fi_id);
    const resultStatuses = statuses[fi_id];

    if (!resultStatuses || resultStatuses.length === 0) {
      handleSnackbar("Status results are not properly set.", "error");
      return;
    }

    try {
      const now = new Date();
      const uploadTime = now.toLocaleDateString("en-GB");
      const existingResponse = await axios.get(
        `http://localhost:4000/graduate_checkings/${fi_id}`
      );

      if (existingResponse.data) {
        await axios.put(`http://localhost:4000/graduate_checkings/${fi_id}`, {
          gr_result: resultStatuses,
          gr_id: selectedFile.fi_id,
          gr_name: selectedFile.fi_name,
          gr_files: selectedFile.fi_file,
          gr_time: uploadTime,
        });
        handleSnackbar("อัปเดตสำเร็จ!!!", "success");
        console.log("timecheck", timecheck);
      } else {
        await axios.post("http://localhost:4000/graduate_checkings", {
          gr_result: resultStatuses,
          gr_id: selectedFile.fi_id,
          gr_name: selectedFile.fi_name,
          gr_files: selectedFile.fi_file,
          gr_time: uploadTime,
        });
        handleSnackbar("ตรวจสอบสำเร็จ!!!", "success");
        console.log("timecheck", timecheck);
      }

      await axios.patch(`http://localhost:4000/files/${fi_id}`, {
        fi_status: "ได้รับการตรวจสอบแล้ว",
      });

      setSubmittedFiles((prev) => ({ ...prev, [fi_id]: true }));
      setOpen(false);
    } catch (error) {
      console.error("Full error:", error);
      handleSnackbar(
        error.response?.data?.message || "Error submitting status.",
        "error"
      );
    }
  };

  const handleOpen = (file) => {
    setSelectedFile(file);

    if (file.fi_status === "ได้รับการตรวจสอบแล้ว") {
      const matchingRecord = timecheck.find((time) => time.gr_id === file.fi_id);
      if (matchingRecord && matchingRecord.gr_result) {
        const newStatuses = { ...statuses };
        newStatuses[file.fi_id] = matchingRecord.gr_result;
        setStatuses(newStatuses);
      }
    }
    
    setOpen(true);
  };
  const handleOpen2 = (file) => {
    setSelectedFile(file);
    setOpen2(true);
  };

  const handleClose = () => setOpen(false);
  const handleClose2 = () => setOpen2(false);

  return (
    <center style={{ marginTop: "2rem" }}>
      <div className={`${styles.content}`}>
        <h1 style={{ color: "#07AA9F" }}>ตรวจสอบการจบการศึกษา</h1>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{backgroundColor: "#07AA9F", color: "white"}}>
                <TableRow >
                  <TableCell sx={{ color: "white" }}>รหัสนักศึกษา</TableCell>
                  <TableCell sx={{ color: "white" }}>ชื่อนักศึกษา</TableCell>
                  {/* เวลาที่upload file */}
                  <TableCell sx={{ color: "white" }}>อัปโหลดล่าสุด</TableCell>
                  {/* สถานะ */}
                  <TableCell sx={{ color: "white" }}></TableCell>
                  {/* เวลาที่กดตรวจสอบ */}
                  <TableCell  sx={{ color: "white" }}>ตรวจสอบล่าสุด</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.fi_id}>
                    <TableCell>{file.fi_id}</TableCell>
                    <TableCell>{file.fi_name}</TableCell>
                    <TableCell>{file.fi_time}</TableCell>
                    <TableCell>
                      {file.fi_status === "ได้รับการตรวจสอบแล้ว" ? (
                        <><Typography>ตรวจสอบแล้ว</Typography>
                        <Button
                          variant="contained"
                          onClick={() => handleOpen(file)}
                          disabled={submittedFiles[file.fi_id]}
                          sx={{
                            backgroundColor: "#EB6725",
                            color: "white",
                            "&:hover": { color: "#EB6725" , backgroundColor: "white" },
                          }}
                        >
                          แก้ไข
                        </Button>
                        </>
                        
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpen(file)}
                          disabled={submittedFiles[file.fi_id]}
                        >
                          ตรวจสอบ
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      {Array.isArray(timecheck) && timecheck.length > 0 ? (
                        timecheck
                          .filter((time) => time.gr_id === file.fi_id) // Filter for matching gr_id
                          .map((time, index) => (
                            <Typography key={index}> {time.gr_time}</Typography>
                          ))
                      ) : (
                        <Typography>ยังไม่ได้ตรวจสอบ</Typography>
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
          width: 800,
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
                  <TableHead >
                    <TableRow >
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell>ไฟล์</TableCell>
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
                            <Link
                              href={`/upload/${selectedFile.fi_file[index]
                                .split("/")
                                .slice(3)
                                .join("/")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{ color: "#07AA9F" }}
                              underline="hover"
                            
                            >
                              ตรวจสอบไฟล์
                            </Link>
                          ) : (
                            "ไม่มีไฟล์"
                          )}
                           <br />
                      <br />
                      {/* Check previous upload file */}
                      {timecheck.some((time) => time.gr_id === selectedFile.fi_id) ? (
                        timecheck
                          .filter((time) => time.gr_id === selectedFile.fi_id)
                          .map((data, idx) => (
                            Array.isArray(data.gr_files) && data.gr_files[index] ? (
                              <Link
                                key={idx}
                                href={`/upload/${data.gr_files[index]
                                  .split("/")
                                  .slice(3)
                                  .join("/")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ color: "#07AA9F" }}
                                underline="hover"
                              >
                                ตรวจสอบไฟล์ก่อนหน้า
                              </Link>
                            ) : (
                              "แนบไฟล์ครั้งแรก"
                            )
                          ))
                      ) : (
                        "แนบไฟล์ครั้งแรก"
                      )}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={statuses[selectedFile.fi_id][index]}
                            onChange={(e) => {
                              const newStatuses = { ...statuses };
                              newStatuses[selectedFile.fi_id][index] =
                                e.target.value;
                              setStatuses(newStatuses);
                            }}
                            aria-label={`Status for ${title}`} // Accessibility label
                            fullWidth
                          >
                            <MenuItem value="รอผลการตรวจ">รอผลการตรวจ</MenuItem>
                            <MenuItem value="ผ่าน">ผ่าน</MenuItem>
                            <MenuItem value="ไม่ผ่าน">ไม่ผ่าน</MenuItem>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
            </Paper>
            <div style={{margin: 2}}>
                <h4>Result form OCR:</h4>
                {selectedFile.fi_result &&
                  selectedFile.fi_result
                    .split(";")
                    .filter((result) => result.trim() !== "None")
                    .map((result, index) => (
                      <p key={index}>{result.trim()}</p>
                    ))}
              </div>
            <Button type="submit" variant="contained"  sx={{
            marginTop: 2,
            backgroundColor: "green",
            color: "white",
            "&:hover": {
              borderColor: "green",
              color: "green",
              backgroundColor: "white",
            },
          }}>
              บันทึก
            </Button>
          </form>
        )}
      </Box>
    </Modal>

    
        <SnackbarFeedback
          open={snackbarState.open}
          handleClose={handleCloseSnackbar}
          severity={snackbarState.severity}
          message={snackbarState.message}
        />
      </div>
    </center>
  );
};

export default OffCheck;
