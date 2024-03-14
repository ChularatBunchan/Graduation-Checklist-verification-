import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import styles from '@/styles/Headerbar.module.css';

const Profile = () => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:4000/students');
                setStudents(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
    // เดี๋ยวเช็คตอนล็อคอินอีกที

    return (
        <center style={{ marginTop: "2rem" }}>
            <div className={`${styles.content}`}>
                {students.map((student, index) => (
                    <div key={index}>
                        <p>Name: {student.st_firstname} {student.st_lastname}</p>
                        <p>Email: {student.st_email}</p>
                        <p>Phone: {student.st_phone}</p>
                    </div>
                ))}
            </div>
        </center>
    );
};

export default Profile;
