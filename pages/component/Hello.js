import { useState, useEffect } from 'react';
import styles from '@/styles/Headerbar.module.css';

const Hello = () => {
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:4000/english-subjects');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                    console.log(
                        "res", response
                    );
                }
                const data = await response.json();
                setSubjects(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    console.log(subjects);

    return (
        <center>
            <img src='/bannercsb.gif' alt="Example GIF" className={`${styles.gif}`} />
            <div className={`${styles.content}`}>
                <div>
                    <h1> รายวิชาที่จัดการเรียนเป็นภาษาต่างประเทศโครงการพิเศษ (สองภาษา)</h1>
                    <h3>หลักสูตรวิทยาศาสตรบัณฑิต สาขาวิชาวิทยาการคอมพิวเตอร์ (CSB)</h3>
                    <h3>*SPECIAL PROJECT I และ II จัดการเรียนเป็นภาษาอังกฤษทุกภาคการศึกษา</h3>
                </div>
                <div className={`${styles.Table}`}>
                    <table>
                        <thead>
                            <tr>
                                <th>ปีการศึกษา</th>
                                <th>ภาคเรียนที่</th>
                                <th>รหัสวิชา</th>
                                <th>ชื่อวิชา</th>
                                <th>หมายเหตุ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map(subject => (
                                <tr key={subject.en_code}>
                                    <td>{subject.en_year}</td>
                                    <td>{subject.en_semester}</td>
                                    <td>{subject.en_code}</td>
                                    <td>{subject.en_name}</td>
                                    <td>{subject.en_note}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </center>
    );
};

export default Hello;