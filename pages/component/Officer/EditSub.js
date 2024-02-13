import styles from '@/styles/Off.module.css'
import React from 'react';
import { useRouter } from 'next/router';

const EditSub = () => {

    const router = useRouter();

    const handleNextButtonClick = () => {
        console.log("Next button clicked!");
        router.push('/component/Hello');
        //   เหลือใส่ layout
    };

    return (
        <center className={`${styles.Basic}`}>
            <form>
                <span onClick={handleNextButtonClick}>
                    <i className="fa-solid fa-circle-chevron-left"></i>
                </span><br></br>
                <div style={{ display: "flex" }}>
                    <h1>เพิ่มรายวิชา ภาษาอังกฤษ</h1><br />
                </div>
                <div>
                     {/* ตารางดึงจากดาต้าเบสแล้วขึ้นวิชารหัสวิชาทั้งหมด ข้างล่างถึงเป็นส่วนที่ให้แก้ */}
                     <table>
                        <tr>
                            <th>รหัสวิชา</th>
                            <th>ชื่อวิชา</th>
                            <th>ตอนเรียน</th>
                        </tr>
                        <tr>
                            <td><input id='code'></input></td>
                            <td><input id='name'></input></td>
                            <td><input id='sec'></input></td>
                        </tr>

                    </table><br />
                    <button>Add</button>
                    <br />
                </div>
            </form>
        </center>
    )
}
export default EditSub