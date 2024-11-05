import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  LinearProgress,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import stylesHeader from "@/styles/Headerbar.module.css";
import styles from "@/styles/Off.module.css";


const AddSub = () => {
  const router = useRouter();
  const [numSubjects, setNumSubjects] = useState(1);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState([
    {
      en_code: "",
      en_name: "",
      en_section: "",
      en_year: "",
      en_semester: "",
      en_note: "",
    },
  ]);
  const [subjectNames, setSubjectNames] = useState([]);
  const [subjectCode, setSubjectCode] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const of_id = localStorage.getItem("of_id");

    if (!of_id) {
      router.push("/Login");
      return;
    }

    const fetchSubjectNames = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/english_subjects?of_id=${of_id}`
        );
        if (response.data && Array.isArray(response.data)) {
          const uniqueSubjectNames = [
            ...new Set(response.data.map((item) => item.en_name)),
          ].sort(); // เรียงตามตัวอักษร
          const uniqueSubjectCodes = [
            ...new Set(response.data.map((item) => item.en_code)),
          ].sort(); // เรียงตามตัวอักษร
          setSubjectNames(uniqueSubjectNames);
          setSubjectCode(uniqueSubjectCodes);
        }
      } catch (error) {
        console.error("Error fetching subject names:", error);
      }
    };

    setLoading(true);
    fetchSubjectNames();
    setLoading(false);
  }, []);

  const handleChange = (e, index) => {
    const updatedFormData = [...formData];
    updatedFormData[index][e.target.id] = e.target.value;
    setFormData(updatedFormData);
  };

  const handleAddSubject = () => {
    setFormData([
      ...formData,
      {
        en_code: "",
        en_name: "",
        en_section: "",
        en_year: "",
        en_semester: "",
        en_note: "",
      },
    ]);
    setNumSubjects(numSubjects + 1);
  };

  const handleRemoveSubject = (index) => {
    const updatedFormData = [...formData];
    updatedFormData.splice(index, 1);
    setFormData(updatedFormData);
    setNumSubjects(numSubjects - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true); // Show loading indicator
      const of_id = localStorage.getItem("of_id");
      const promises = formData.map((data) =>
        axios.post(
          `http://localhost:4000/english_subjects?of_id=${of_id}`,
          data
        )
      );
      await Promise.all(promises);
      alert("Subjects added successfully!");
      setFormData([
        {
          en_code: "",
          en_name: "",
          en_section: "",
          en_year: "",
          en_semester: "",
          en_note: "",
        },
      ]);
      setNumSubjects(1);
    } catch (error) {
      console.error("Error adding subjects:", error);
      alert("Failed to add subjects. Please try again later.");
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  const handleClickOpen = () => {
    const isValid = formData.every(
      (subject) =>
        subject.en_code &&
        subject.en_name &&
        subject.en_year &&
        subject.en_semester
    );
    if (isValid) {
      setOpen(true);
    } else {
      alert("กรุณากรอกข้อมูลให้ครบ!");
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = (e) => {
    handleSubmit(e);
    handleClose();
  };

  const options = subjectNames.map((name) => {
    // Check if name is defined and has at least one character
    if (name && name.length > 0) {
      const firstLetter = name[0].toUpperCase();
      const tenthChar = name.length > 10 ? name[10] : "";
      return {
        firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
        en_name: name,
        tenthChar: tenthChar.toUpperCase(),
      };
    }
  });

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
    <Container
      maxWidth="md"
      style={{ marginTop: "2rem" }}
      className={stylesHeader.content}
    >
      <div className={styles.EditSub}>
        <Typography
          variant="h4"
          gutterBottom
          style={{
            color: "#07AA9F",
            marginTop: "3vmax",
            textAlign: "center",
          }}
        >
          เพิ่มรายวิชาที่มีการสอนภาษาอังกฤษ
        </Typography>

        <form onSubmit={handleSubmit}>
          <TableContainer>
            <Table>
              <TableHead >
                <TableRow>
                  <TableCell sx={{ width: "25%" }}>รหัสวิชา</TableCell>
                  <TableCell sx={{ width: "30%" }}>ชื่อวิชา</TableCell>
                  <TableCell sx={{ width: "11%" }}>ตอนเรียน</TableCell>
                  <TableCell sx={{ width: "11%" }}>ปีการศึกษา</TableCell>
                  <TableCell sx={{ width: "11%" }}>ภาคเรียนที่</TableCell>
                  <TableCell sx={{ width: "25%" }}>หมายเหตุ</TableCell>
                  <TableCell sx={{ width: "10%" }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formData.map((subject, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Autocomplete
                        options={subjectCode}
                        getOptionLabel={(option) => option || ""}
                        value={formData[index].en_code || ""}
                        id="en_code"
                        freeSolo
                        inputValue={formData[index]?.en_code || ""}
                        onInputChange={(event, newInputValue) => {
                          const updatedFormData = [...formData];
                          updatedFormData[index].en_code = newInputValue;
                          setFormData(updatedFormData);
                        }}
                        renderInput={(params) => (
                          <TextField {...params} required fullWidth />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Autocomplete
                        options={options.sort((a, b) => {
                          if (a.tenthChar < b.tenthChar) return -1; // A-Z
                          if (a.tenthChar > b.tenthChar) return 1;
                          return 0; // ถ้าตัวอักษรที่ 10 เท่ากัน
                        })}
                        groupBy={(option) => option.firstLetter}
                        getOptionLabel={(option) => option.en_name || ""} // ตรวจสอบว่า en_name มีค่าอยู่
                        value={
                          formData[index].en_name
                            ? { en_name: formData[index].en_name }
                            : null
                        } // ใช้ค่า en_name จาก formData
                        id="en_name"
                        freeSolo
                        inputValue={formData[index].en_name}
                        onInputChange={(event, newInputValue) => {
                          const updatedFormData = [...formData];
                          updatedFormData[index].en_name = newInputValue;
                          setFormData(updatedFormData);
                        }}
                        renderInput={(params) => (
                          <TextField {...params} required fullWidth />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        id="en_section"
                        value={subject.en_section || ""}
                        onChange={(e) => handleChange(e, index)}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        id="en_year"
                        required
                        type="number"
                        value={subject.en_year || ""}
                        onChange={(e) => handleChange(e, index)}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        id="en_semester"
                        required
                        type="number"
                        value={subject.en_semester || ""}
                        onChange={(e) => handleChange(e, index)}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        id="en_note"
                        value={subject.en_note || ""}
                        onChange={(e) => handleChange(e, index)}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      {index > 0 && (
                        <Button
                          variant="contained"
                          onClick={() => handleRemoveSubject(index)}
                          sx={{
                            backgroundColor: "#EB6725",
                            color: "white",
                            "&:hover": { color: "#EB6725" },
                          }}
                        >
                          ลบ
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddSubject}
            >
              เพิ่มรายวิชา
            </Button>
            <b> | </b>
            <Button
              variant="contained"
              onClick={handleClickOpen}
              sx={{
                backgroundColor: "green",
                color: "white"
              }}
            >
              บันทึกข้อมูล
            </Button>
          </div>

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>ยืนยันการบันทึก</DialogTitle>
            <DialogContent>
              <DialogContentText>
                คุณต้องการบันทึกรายวิชาหรือไม่?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleClose}
                sx={{
                  backgroundColor: "#EB6725",
                  color: "white",
                  "&:hover": { color: "#EB6725" },
                }}
              >
                ยกเลิก
              </Button>
              <Button
                onClick={handleConfirm}
                sx={{
                  backgroundColor: "green",
                  color: "white",
                  "&:hover": { color: "green" },
                }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : "ยืนยัน"}
              </Button>
            </DialogActions>
          </Dialog>
        </form>
      </div>
    </Container>
  );
};

export default AddSub;
