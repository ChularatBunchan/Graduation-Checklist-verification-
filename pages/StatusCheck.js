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
                    <div className={`${styles.Table}`}>
                        {/* head */}
                        <table>
                            <thead>
                                <tr>
                                    <th>Checklist</th>
                                    <th>file</th>
                                    <th>status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {checklistItems.map((item, index) => (

                                    <tr key={index}>
                                        <td key={index}>{item}</td>
                                        <td>{item.fi_id}</td>
                                        <td>{item.gd_status}</td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
        </center>
    );
};

export default StatusCheck;