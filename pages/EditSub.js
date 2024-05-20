import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
    Pagination
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import styles from '@/styles/Off.module.css';
import stylesHeader from '@/styles/Headerbar.module.css';

const EditSub = () => {
    const router = useRouter();

    const handleNextButtonClick = () => {
        console.log("Next button clicked!");
        router.push('/Hello');
    };

    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [subjectToDelete, setSubjectToDelete] = useState(null);
    const recordsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:4000/english_subjects');
                if (!response.ok) {
                    throw new Error('Failed to fetch subjects. Please try again later.');
                }
                const data = await response.json();
                setSubjects(data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch subjects. Please try again later.');
            }
        };

        fetchData();
    }, []);

    const handleEdit = (subject) => {
        setSelectedSubject(subject);
        setShowPopup(true);
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:4000/english_subjects/${subjectToDelete._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to delete subject');
            }
            setSubjects(subjects.filter(subject => subject._id !== subjectToDelete._id));
            setShowDeletePopup(false);
        } catch (error) {
            console.error('Error deleting subject:', error);
            setError('Failed to delete subject. Please try again later.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedSubject({
            ...selectedSubject,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:4000/english_subjects/${selectedSubject._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedSubject),
            });
            if (!response.ok) {
                throw new Error('Failed to update subject');
            }
            setShowPopup(false);
            router.reload();
        } catch (error) {
            console.error('Error updating subject:', error);
            setError('Failed to update subject. Please try again later.');
        }
    };

    const totalPages = Math.ceil(subjects.length / recordsPerPage);
    const currentSubjects = subjects.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

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
                    <Button startIcon={<ArrowBackIcon />} style={{borderColor: "unset", float: "left", display: "flex", margin: "1rem 0"}} onClick={handleNextButtonClick} variant="outlined">
                        Back
                    </Button><br />
                    <div style={{color: "#07AA9F", marginTop: "3vmax"}}>
                        <Typography variant="h4">แก้ไขรายวิชา ภาษาอังกฤษ</Typography>
                    </div><br />
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ปีการศึกษา</TableCell>
                                    <TableCell>ภาคเรียนที่</TableCell>
                                    <TableCell>วิชา</TableCell>
                                    <TableCell>หมายเหตุ</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {error ? (
                                    <TableRow>
                                        <TableCell colSpan="5">Error: {error}</TableCell>
                                    </TableRow>
                                ) : (
                                    currentSubjects.map(subject => (
                                        <TableRow key={subject._id}>
                                            <TableCell>{subject.en_year}</TableCell>
                                            <TableCell>{subject.en_semester}</TableCell>
                                            <TableCell>{subject.en_name}</TableCell>
                                            <TableCell>{subject.en_note}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    startIcon={<EditIcon />}
                                                    onClick={() => handleEdit(subject)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    startIcon={<DeleteIcon />}
                                                    onClick={() => openDeletePopup(subject)}
                                                    id='DeleteButton'
                                                    style={{marginLeft: '10px', backgroundColor: "#EB6725" , '&hover': { backgroundColor: '#e7e4e4'}}}
                                                >
                                                    Delete
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
                        style={{marginTop: '20px'}}
                    />
                </div>
            </Paper>

            <Dialog open={showPopup} onClose={() => setShowPopup(false)}>
                <DialogTitle>แก้ไขข้อมูลวิชา</DialogTitle>
                <DialogContent className={styles.PopUp}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="ปีการศึกษา"
                            name="en_year"
                            value={selectedSubject?.en_year || ''}
                            onChange={handleInputChange}
                            fullWidth
                            margin="dense"
                        />
                        <TextField
                            label="ภาคเรียนที่"
                            name="en_semester"
                            value={selectedSubject?.en_semester || ''}
                            onChange={handleInputChange}
                            fullWidth
                            margin="dense"
                        />
                        <TextField
                            label="หมายเหตุ"
                            name="en_note"
                            value={selectedSubject?.en_note || ''}
                            onChange={handleInputChange}
                            fullWidth
                            margin="dense"
                        />
                        <DialogActions>
                            <Button onClick={() => setShowPopup(false)} style={{backgroundColor: "#EB6725"}} >
                                Cancel
                            </Button>
                            <Button type="submit" style={{backgroundColor: "#07AA9F"}}>
                                Save
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog
                open={showDeletePopup}
                onClose={() => setShowDeletePopup(false)}
                className={styles.PopUp}
            >
                <DialogTitle>ยืนยันการลบ</DialogTitle>
                <DialogContent>
                    <Typography>คุณแน่ใจหรือไม่ว่าต้องการลบวิชา {subjectToDelete?.en_name} ?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowDeletePopup(false)} style={{backgroundColor: "#EB6725"}}>
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} style={{backgroundColor: "#07AA9F"}}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </center>
    );
};

export default EditSub;
