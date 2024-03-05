// import styles from '@/styles/Headerbar.module.css'

// const Hello = () => {
//     return (
//         <center>
//             <img src='/bannercsb.gif' alt="Example GIF" className={`${styles.gif}`} />
//             <div className={`${styles.content}`}>
//                 <div>
//                     <h1> รายวิชาที่จัดการเรียนเป็นภาษาต่างประเทศโครงการพิเศษ (สองภาษา)</h1>
//                     <h3>หลักสูตรวิทยาศาสตรบัณฑิต สาขาวิชาวิทยาการคอมพิวเตอร์ (CSB)</h3>
//                     <h3>*SPECIAL PROJECT I และ II จัดการเรียนเป็นภาษาอังกฤษทุกภาคการศึกษา</h3>
//                 </div>
//                 <div className={`${styles.Table}`}>
//                     <table>
//                         <thead>
//                             <tr>
//                                 <th>รหัสวิชา</th>
//                                 <th>ชื่อวิชา</th>
//                                 <th>ปีการศึกษา</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             <tr>
//                                 <td>040313017</td>
//                                 <td>EXERCISE SKILL AND SPORT</td>
//                             </tr>
//                             <tr>
//                                 <td>040613103</td>
//                                 <td>DISCRETE MATHEMATICS FOR COMPUTER SCIENCE</td>
//                             </tr>
//                             <tr>
//                                 <td>040613201</td>
//                                 <td>COMPUTER PROGRAMMING I</td>
//                             </tr>
//                             <tr>
//                                 <td>040613105</td>
//                                 <td>NUMERICAL METHOD</td>
//                             </tr>
//                         </tbody>
//                     </table>
//                 </div>

//             </div>

//         </center>
//     )
// }
// export default Hello

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
                                <th>รหัสวิชา</th>
                                <th>ชื่อวิชา</th>
                                <th>ปีการศึกษา</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map(subject => (
                                <tr key={subject.en_code}>
                                    <td>{subject.en_code}</td>
                                    <td>{subject.en_name}</td>
                                    <td>{subject.en_year}</td>
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

