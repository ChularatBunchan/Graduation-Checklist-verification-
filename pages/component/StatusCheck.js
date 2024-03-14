import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import styles from '@/styles/Headerbar.module.css';

const StatusCheck = () => {
    const [graduate, setGraduate] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:4000/graduate');
                setGraduate(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const checklistItems = [
        'เอกสารแสดงผลการเรียน',
        'หนังสือรับรองการฝึกงาน',
        'English Proficiency Exam',
        'คะแนนทดสอบวัดความสามารถภาษาอังกฤษ',
        'ใบตรวจปริญญานิพนธ์',
        'ข้อมูล พ.ศ ขึ้นในระบบ'
    ];

    return (
        <center style={{ marginTop: "2rem" }}>
            <div className={`${styles.content}`}>
                <h1>ตรวจสอบการจบการศึกษา</h1>
                <div style={{ overflowX: 'auto' }}>
                    <table className={`${styles.Table}`}>
                        {/* head */}
                        <thead>
                            <tr>
                                {checklistItems.map((item, index) => (
                                    <th key={index}>{item}</th>
                                ))}
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {graduate.map((graduated, index) => (
                                <tr key={index}>
                                    <td>{graduated.fi_id}</td>
                                    <td>{graduated.gd_status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </center>
    );
};

export default StatusCheck;
