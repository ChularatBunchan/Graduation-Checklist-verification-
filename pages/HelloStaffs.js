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
    Pagination,
    LinearProgress,
    TextField,
    Button
} from '@mui/material';
import { IoSearch } from "react-icons/io5";
import { useRouter } from 'next/router';
import styles from '@/styles/Headerbar.module.css';

const HelloStaffs = () => {
    const [subjects, setSubjects] = useState([]);
    const [filteredSubjects, setFilteredSubjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState(null);
    const [searchYear, setSearchYear] = useState('');
    const [sortDirection, setSortDirection] = useState('desc');
    const subjectsPerPage = 10;
  const [loading, setLoading] = useState(true);
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
                const sortedData = data.sort((a, b) => b.en_year - a.en_year);

                setSubjects(sortedData);
                setFilteredSubjects(sortedData);
                setTotalPages(Math.ceil(sortedData.length / subjectsPerPage));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
                setLoading(false);
            }
        };
        setLoading(true);

        fetchData();
    setLoading(false);

    }, []);

    const handleSearch = () => {
        const filtered = subjects.filter(subject => 
            subject.en_year.toString().includes(searchYear)
        );
        setFilteredSubjects(filtered);
        setTotalPages(Math.ceil(filtered.length / subjectsPerPage));
        setCurrentPage(1);  // Reset to first page when search changes
    };

    const handleSort = () => {
        const sorted = [...filteredSubjects].sort((a, b) => {
            return sortDirection === 'desc' 
                ? b.en_year - a.en_year 
                : a.en_year - b.en_year;
        });
        setFilteredSubjects(sorted);
        setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const currentSubjects = filteredSubjects.slice(
        (currentPage - 1) * subjectsPerPage,
        currentPage * subjectsPerPage
    );

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
        <center>
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;700&display=swap');
                body {
                    font-family: 'Noto Sans Thai', sans-serif;
                }
            `}</style>
            <img src='/csbForofficers.png' className={styles.gif} style={{ width: "60%", borderRadius: "12px" }} />
            <div className={styles.content}>
                <Paper>
                    <div className={styles.EditSub}>
                        <div style={{ color: "#07AA9F", marginTop: "3vmax" }}>
                            <Typography variant="h4">รายวิชาภาษาอังกฤษ</Typography>
                        </div><br />
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
                        </div>
                        <br /><br />
                        {loading ? (
                            <Typography>Loading...</Typography>
                        ) : (
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ปีการศึกษา</TableCell>
                                            <TableCell>ภาคเรียนที่</TableCell>
                                            <TableCell>รหัสวิชา</TableCell>
                                            <TableCell>ชื่อวิชา</TableCell>
                                            <TableCell>ตอนเรียน</TableCell>
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
                                                    <TableCell>{subject.en_code}</TableCell>
                                                    <TableCell>{subject.en_name}</TableCell>
                                                    <TableCell>{subject.en_section}</TableCell>
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

export default HelloStaffs;
