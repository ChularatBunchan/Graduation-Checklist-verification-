import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
                {students.map((students, index) => (
                    <div key={index}>
                        <p>รหัสนักศึกษา: {students.username.slice(1)}</p>
                        <p>ชื่อ: {students.displayname} </p>
                        <p>Email: {students.email}</p>
                    </div>
                ))}
            </div>
        </center>
    );
};

export default Profile;