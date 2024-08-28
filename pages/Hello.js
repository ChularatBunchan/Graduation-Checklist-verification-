import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Pagination
} from '@mui/material';
import { useRouter } from 'next/router';
import styles from '@/styles/Headerbar.module.css';
import stylesHeader from '@/styles/Headerbar.module.css';

const Hello = () => {
    const [subjects, setSubjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const subjectsPerPage = 10;
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:4000/english_subjects');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setSubjects(data);
                setTotalPages(Math.ceil(data.length / subjectsPerPage));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const currentSubjects = subjects.slice(
        (currentPage - 1) * subjectsPerPage,
        currentPage * subjectsPerPage
    );

    return (
        <center>
            <img src='/bannercsb.gif' alt="Example GIF" className={styles.gif} />
            <div className={styles.content}>
                <Paper >
                    <div className={styles.EditSub}>
                        <div style={{ color: "#07AA9F", marginTop: "3vmax" }}>
                            <Typography variant="h4">รายวิชาภาษาอังกฤษ</Typography>
                        </div><br />
                        {loading ? (
                            <Typography>Loading...</Typography>
                        ) : (
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ปีการศึกษา</TableCell>
                                            <TableCell>ภาคเรียนที่</TableCell>
                                            <TableCell>วิชา</TableCell>
                                            <TableCell>หมายเหตุ</TableCell>
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
                                                    
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            style={{ marginTop: '20px' }}
                        />
                    </div>
                </Paper>
            </div>
        </center>
    );
};

export default Hello;
