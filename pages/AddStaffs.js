import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
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
  DialogTitle,
  FormControl,
  Paper,
} from "@mui/material";
import stylesHeader from "@/styles/Headerbar.module.css";
import styles from "@/styles/Off.module.css";

const AddStaffs = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffID, setNewStaffID] = useState("");

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:4000/officers");
      setStaffList(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching staff:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaff = async () => {
    try {
      const response = await axios.post("http://localhost:4000/officers", {
        of_id: newStaffID,
      });
      setStaffList([...staffList, response.data]);
      setNewStaffName("");
      setNewStaffID("");
    } catch (error) {
      console.error("Error adding staff:", error);
    }
  };

  const handleEditStaff = async () => {
    try {
      await axios.put(`http://localhost:4000/officers/${currentStaff.of_id}`, {
        of_id: currentStaff.of_id,
      });
      setStaffList(
        staffList.map((staff) =>
          staff.of_id === currentStaff.of_id ? currentStaff : staff
        )
      );
      setOpenEdit(false);
    } catch (error) {
      console.error("Error editing staff:", error);
    }
  };

  const handleDeleteStaff = async () => {
    try {
      await axios.delete(
        `http://localhost:4000/officers/${currentStaff.of_id}`
      );
      setStaffList(
        staffList.filter((staff) => staff.of_id !== currentStaff.of_id)
      );
      setOpenDelete(false);
    } catch (error) {
      console.error("Error deleting staff:", error);
    }
  };

  const handleOpenEditDialog = (staff) => {
    setCurrentStaff(staff);
    setOpenEdit(true);
  };

  const handleOpenDeleteDialog = (staff) => {
    setCurrentStaff(staff);
    setOpenDelete(true);
  };

  const handleCloseDialogs = () => {
    setOpenEdit(false);
    setOpenDelete(false);
  };

  return (
    <Container
      maxWidth="md"
      style={{ marginTop: "2rem", padding: "4rem", color: "#07AA9F" }}
      className={stylesHeader.content}
    >
      <center>
        <h1>เพิ่ม/แก้ไขเจ้าหน้าที่</h1>
        <div style={{ display: "flex" }}>
          <TableContainer sx={{ width: "50%" }} component={Paper}>
            {/* <h3 style={{ color: "#07AA9F" }}>แก้ไข</h3> */}
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#EB6725" }}>
                  <TableCell sx={{ color: "white" }}>username</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {staffList.map((staff, index) => (
                  <TableRow key={index}>
                    <TableCell>{staff.of_id}</TableCell>
                    <TableCell>
                      <Button sx={{color: "#07AA9F"}} onClick={() => handleOpenEditDialog(staff)}>
                        แก้ไข
                      </Button>
                      <Button sx={{color: "#EB6725"}}  onClick={() => handleOpenDeleteDialog(staff)}>
                        ลบ
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <center style={{ marginLeft: "6rem" }}>
            {/* <h3>เพิ่ม</h3> */}
            <FormControl variant="outlined">
              <TextField
                label="username"
                value={newStaffID}
                onChange={(e) => setNewStaffID(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#EB6725", // Normal state border color
                    },
                    "&:hover fieldset": {
                      borderColor: "#EB6725", // Hover state border color
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#EB6725", // Focus state border color
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#EB6725", // Normal label color
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#EB6725", // Focused label color
                  },
                }}
              />
            </FormControl>
            <br />
            <Button onClick={handleAddStaff} sx={{
                  backgroundColor: "green",
                  marginTop: "1rem",
                  color: "white",
                  "&:hover": { color: "green" },
                }}>เพิ่มเจ้าหน้าที่</Button>
          </center>
        </div>
        {/* Edit Dialog */}
        <Dialog open={openEdit} onClose={handleCloseDialogs} >
          <DialogTitle>แก้ไข</DialogTitle>
          <DialogContent sx={{padding: "2rem", marginTop: "1rem"}}>
            <TextField
              label="username"
              variant="filled"
              value={currentStaff ? currentStaff.of_id : ""}
              onChange={(e) =>
                setCurrentStaff({ ...currentStaff, of_id: e.target.value })
              }
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogs}>ยกเลิก</Button>
            <Button onClick={handleEditStaff} sx={{
                  backgroundColor: "green",
                  color: "white",
                  "&:hover": { color: "green" },
                }} >บันทึก</Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={openDelete} onClose={handleCloseDialogs}>
          <DialogTitle>ยืนยันการลบ</DialogTitle>
          <DialogContent>ต้องการลบ {currentStaff?.of_id} ?</DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogs}>ยกเลิก</Button>
            <Button onClick={handleDeleteStaff} sx={{
                  backgroundColor: "#EB6725",
                  color: "white",
                  "&:hover": { color: "#EB6725" },
                }} >
              ลบ
            </Button>
          </DialogActions>
        </Dialog>
      </center>
    </Container>
  );
};

export default AddStaffs;
