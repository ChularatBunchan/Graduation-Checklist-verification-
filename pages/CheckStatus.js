import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import styles from '@/styles/Headerbar.module.css';

const CheckStatus = () => {
    const [graduate, setGraduate] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8001/graduate');
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
                                <th>Checklist</th>
                                <th>File</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        {graduate.map((graduated, index) => (
                            <tbody key={index}>
                                {checklistItems.map((item, index) => (
                                    <tr>
                                        <td key={index}>{item}</td>
                                        <td>{graduated.fi_id}</td>
                                        <td>{graduated.gd_status}</td>
                                    </tr>
                                ))}

                            </tbody>
                        ))}
                    </table>
                </div>
            </div>
        </center>
    );
};

export default CheckStatus;
