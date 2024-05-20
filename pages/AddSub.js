import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
    TextField,
    Button,
    Typography,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import stylesHeader from '@/styles/Headerbar.module.css';
import styles from '@/styles/Off.module.css';

const theme = createTheme({
    palette: {
        primary: {
            main: '#07AA9F',
        },
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#07AA9F',
                        },
                        '&:hover fieldset': {
                            borderColor: '#07AA9F',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#07AA9F',
                        },
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    '&.MuiButton-containedPrimary': {
                        backgroundColor: '#07AA9F',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#e7e4e4',
                            color: '#000000'
                        },
                    },
                },
            },
        },
    },
});

const AddSub = () => {
    const router = useRouter();

    const handleNextButtonClick = () => {
        console.log("Next button clicked!");
        router.push('/Hello');
    };

    // State for form data
    const [formData, setFormData] = useState({
        en_name: '',
        en_year: '',
        en_semester: '',
        en_note: ''
    });

    // State for subject names fetched from the database
    const [subjectNames, setSubjectNames] = useState([]);

    // State for confirmation dialog
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchSubjectNames = async () => {
            try {
                const response = await axios.get('http://localhost:4000/english_subjects');
                if (response.data && Array.isArray(response.data)) {
                    setSubjectNames(response.data.map(item => item.en_name));
                }
            } catch (error) {
                console.error('Error fetching subject names:', error);
            }
        };

        fetchSubjectNames();
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/english_subjects', formData);
            console.log('Subject added:', response.data);
            alert("Subject added successfully!");
            // Reset form after successful submission
            setFormData({
                en_name: '',
                en_year: '',
                en_semester: '',
                en_note: ''
            });
        } catch (error) {
            console.error('Error adding subject:', error);
            alert("Failed to add subject. Please try again later.");
        }
    };

    // Open confirmation dialog
    const handleClickOpen = () => {
        setOpen(true);
    };

    // Close confirmation dialog
    const handleClose = () => {
        setOpen(false);
    };

    // Confirm form submission
    const handleConfirm = (e) => {
        handleSubmit(e);
        handleClose();
    };

    return (
        <ThemeProvider theme={theme}>
            <br />
            <Container maxWidth="md" className={stylesHeader.content}>
                <div style={{ marginTop: '2rem' }}  className={styles.EditSub}>
                    <Button startIcon={<ArrowBackIcon />} style={{ borderColor: "unset", float: "left", display: "flex", margin: "1rem 0" }} onClick={handleNextButtonClick} variant="outlined">
                        Back
                    </Button><br />
                    <div style={{ color: "#07AA9F", marginTop: "3vmax" ,display:'flex',justifyContent:'center'}}>
                        <Typography variant="h4" gutterBottom >
                            เพิ่มรายวิชา ภาษาอังกฤษ
                        </Typography>
                    </div>

                    <form onSubmit={handleClickOpen}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            <TextField
                                                fullWidth
                                                select
                                                label="วิชา"
                                                id="en_name"
                                                value={formData.en_name}
                                                onChange={handleChange}
                                                SelectProps={{
                                                    native: true,
                                                }}
                                                required
                                            >
                                                <option value=""></option>
                                                {subjectNames.map((subject, index) => (
                                                    <option key={index} value={subject}>{subject}</option>
                                                ))}
                                            </TextField>
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                fullWidth
                                                label="ปีการศึกษา"
                                                id="en_year"
                                                value={formData.en_year}
                                                onChange={handleChange}
                                                required
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                fullWidth
                                                label="ภาคเรียนที่"
                                                id="en_semester"
                                                value={formData.en_semester}
                                                onChange={handleChange}
                                                required
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                fullWidth
                                                label="หมายเหตุ"
                                                id="en_note"
                                                value={formData.en_note}
                                                onChange={handleChange}
                                                required
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Button
                                type="button"
                                variant="contained"
                                color="primary"
                                style={{ marginTop: '1rem' }}
                                onClick={handleClickOpen}
                            >
                                Add
                            </Button>
                        </div>
                    </form>
                </div>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Confirm Submission"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to add this subject?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleConfirm} color="primary" autoFocus>
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </ThemeProvider>
    );
};

export default AddSub;
