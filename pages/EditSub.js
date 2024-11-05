import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Pagination,
} from "@mui/material";
import { IoSearch } from "react-icons/io5";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import styles from "@/styles/Off.module.css";
import stylesHeader from "@/styles/Headerbar.module.css";

const EditSub = () => {
  const router = useRouter();
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showDeleteAllPopup, setShowDeleteAllPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const recordsPerPage = 10;
  const [searchYear, setSearchYear] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false); // New loading state for button feedback

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/english_subjects");
        
        const data = response.data;
      
        const sortedData = data.sort((a, b) => b.en_year - a.en_year);
  
        setSubjects(sortedData);
        setFilteredSubjects(sortedData);
        
        setTotalPages(Math.ceil(data.length / recordsPerPage));
  
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch subjects. Please try again later.");
      }
    };
  
    fetchData();
  }, []); 
  
  const handleEdit = (subject) => {
    setSelectedSubject(subject);
    setShowPopup(true);
  };

  const handleDelete = async () => {
    if (!subjectToDelete) return;

    try {
      await axios.delete(
        `http://localhost:4000/english_subjects/${subjectToDelete._id}`
      );
      setSubjects((prev) =>
        prev.filter((subject) => subject._id !== subjectToDelete._id)
      );
      setFilteredSubjects((prev) =>
        prev.filter((subject) => subject._id !== subjectToDelete._id)
      );
      setShowDeletePopup(false);
    } catch (error) {
      console.error("Error deleting subject:", error);
      setError("Failed to delete subject. Please try again later.");
    }
  };

  const handleDeleteAll = async () => {
    try {
      await Promise.all(
        filteredSubjects.map((subject) =>
          axios.delete(`http://localhost:4000/english_subjects/${subject._id}`)
        )
      );
      setSubjects([]);
      setFilteredSubjects([]);
      setShowDeleteAllPopup(false);
    } catch (error) {
      console.error("Error deleting all subjects:", error);
      setError("Failed to delete all subjects. Please try again later.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedSubject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    const filtered = subjects.filter((subject) =>
      subject.en_year.toString().includes(searchYear)
    );
    setFilteredSubjects(filtered);
    setTotalPages(Math.ceil(filtered.length / recordsPerPage));
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading state
    try {
      await axios.put(
        `http://localhost:4000/english_subjects/${selectedSubject._id}`,
        selectedSubject // Include updated subject data
      );
      setShowPopup(false);
    } catch (error) {
      console.error("Error updating subject:", error);
      setError("Failed to update subject. Please try again later.");
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  const currentSubjects = filteredSubjects.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const openDeletePopup = (subject) => {
    setSubjectToDelete(subject);
    setShowDeletePopup(true);
  };

  return (
    <center>
      <br />
      <Paper className={stylesHeader.content}>
        <div className={styles.EditSub}>
          <div style={{ color: "#07AA9F", marginTop: "3vmax" }}>
            <Typography variant="h4">
              แก้ไขรายวิชาที่มีการสอนภาษาอังกฤษ
            </Typography>
          </div>
          <br />
          <div >
                        <TextField
                            label="ปีการศึกษา"
                            variant="standard"
                            value={searchYear}
                            onChange={(e) => setSearchYear(e.target.value)}
                            style={{ marginBottom: '20px', width: '40%', height: '10%' }}
                        />
                        <Button onClick={handleSearch} variant="contained">
                            <IoSearch size={20} />
                        </Button> 
                       
          <Button
            variant="contained"
            color="secondary"
            style={{ marginLeft: "10px", backgroundColor: "#EB6725" }}
            onClick={() => setShowDeleteAllPopup(true)}
          >
           ลบทั้งหมด
          </Button> </div>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{backgroundColor: "#07AA9F", color: "white"}}>
                <TableRow>
                  <TableCell sx={{ color: "white"}}>ปีการศึกษา</TableCell>
                  <TableCell sx={{ color: "white"}}>ภาคเรียนที่</TableCell>
                  <TableCell sx={{ color: "white"}}>รหัสวิชาวิชา</TableCell>
                  <TableCell sx={{ color: "white"}}>ชื่อวิชา</TableCell>
                  <TableCell sx={{ color: "white"}}>ตอนเรียน</TableCell>
                  <TableCell sx={{ color: "white"}}>หมายเหตุ</TableCell>
                  <TableCell sx={{ color: "white"}}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {error ? (
                  <TableRow>
                    <TableCell colSpan="7">Error: {error}</TableCell>
                  </TableRow>
                ) : (
                  currentSubjects.map((subject) => (
                    <TableRow key={subject._id}>
                      <TableCell>{subject.en_year}</TableCell>
                      <TableCell>{subject.en_semester}</TableCell>
                      <TableCell>{subject.en_code}</TableCell>
                      <TableCell>{subject.en_name}</TableCell>
                      <TableCell>{subject.en_section}</TableCell>
                      <TableCell>{subject.en_note}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<EditIcon />}
                          onClick={() => handleEdit(subject)}
                        >
                          แก้ไข
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          startIcon={<DeleteIcon />}
                          onClick={() => openDeletePopup(subject)}
                          style={{
                            marginLeft: "10px",
                            backgroundColor: "#EB6725",
                          }}
                        >
                          ลบ
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            style={{ marginTop: "20px" }}
          />
        </div>
      </Paper>

      {/* Edit Popup */}
      <Dialog open={showPopup} onClose={() => setShowPopup(false)}>
        <DialogTitle>แก้ไขข้อมูลวิชา</DialogTitle>
        <DialogContent className={styles.PopUp}>
          <form onSubmit={handleSubmit}>
            <TextField
              label="ปีการศึกษา"
              name="en_year"
              value={selectedSubject?.en_year || ""}
              onChange={handleInputChange}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              label="ภาคเรียนที่"
              name="en_semester"
              value={selectedSubject?.en_semester || ""}
              onChange={handleInputChange}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              label="รหัสวิชา"
              name="en_code"
              value={selectedSubject?.en_code || ""}
              onChange={handleInputChange}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              label="ชื่อวิชา"
              name="en_name"
              value={selectedSubject?.en_name || ""}
              onChange={handleInputChange}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              label="ตอนเรียน"
              name="en_section"
              value={selectedSubject?.en_section || ""}
              onChange={handleInputChange}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              label="หมายเหตุ"
              name="en_note"
              value={selectedSubject?.en_note || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <DialogActions>
              <Button onClick={() => setShowPopup(false)} color="secondary">
                Cancel
              </Button>
              <Button type="submit" color="primary" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Popup */}
      <Dialog open={showDeletePopup} onClose={() => setShowDeletePopup(false)}>
        <DialogTitle>Delete Subject</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this subject?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeletePopup(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete All Popup */}
      <Dialog
        open={showDeleteAllPopup}
        onClose={() => setShowDeleteAllPopup(false)}
      >
        <DialogTitle>Delete All Subjects</DialogTitle>
        <DialogContent>
          Are you sure you want to delete all subjects?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteAllPopup(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteAll} color="primary">
            Delete All
          </Button>
        </DialogActions>
      </Dialog>
    </center>
  );
};

export default EditSub;
