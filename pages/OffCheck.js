import React, { useState } from 'react';
import styles from '@/styles/Headerbar.module.css'

const OffCheck = () => {
    // ประกาศตัวแปรสำหรับเก็บข้อมูลสถานะ
    const [status1, setStatus1] = useState('รออนุมัติ');
    const [status2, setStatus2] = useState('รออนุมัติ');
    const [status3, setStatus3] = useState('รออนุมัติ');
    const [status4, setStatus4] = useState('รออนุมัติ');
    const [status5, setStatus5] = useState('รออนุมัติ');
    const [status6, setStatus6] = useState('รออนุมัติ');

    // ฟังก์ชันที่เปลี่ยนแปลงข้อมูลสถานะ
    const handleChangeStatus1 = (e) => {
        setStatus1(e.target.value);
    };
    const handleChangeStatus2 = (e) => {
        setStatus2(e.target.value);
    };
    const handleChangeStatus3 = (e) => {
        setStatus3(e.target.value);
    };
    const handleChangeStatus4 = (e) => {
        setStatus4(e.target.value);
    };
    const handleChangeStatus5 = (e) => {
        setStatus5(e.target.value);
    };
    const handleChangeStatus6 = (e) => {
        setStatus6(e.target.value);
    };

    const onSubmit = () => {

    }

    return (
        <center style={{ marginTop: "2rem" }}>
            <div className={`${styles.content}`}>
                <h1>ตรวจสอบการจบการศึกษา</h1>
                <form style={{ overflowX: 'auto' }} onSubmit={onSubmit}>
                    <table className={`${styles.Table}`}>
                        {/* head */}
                        <thead>
                            <tr>
                                <th></th>
                                <th>Checklist</th>
                                <th>file</th>
                                <th>สถานะ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* row 1 */}
                            <tr>
                                <th>1</th>
                                <td>เอกสารแสดงผลการเรียน</td>
                                <td>none</td>
                                <td>
                                    <select value={status1} onChange={handleChangeStatus1}>
                                        <option value="รออนุมัติ">รออนุมัติ</option>
                                        <option value="ผ่าน">ผ่าน</option>
                                        <option value="ไม่ผ่าน">ไม่ผ่าน</option>
                                    </select>
                                </td>
                            </tr>
                            {/* row 2 */}
                            <tr>
                                <th>2</th>
                                <td>หนังสือรับรองการฝึกงาน</td>
                                <td>none</td>
                                <td>
                                    <select value={status2} onChange={handleChangeStatus2}>
                                        <option value="รออนุมัติ">รออนุมัติ</option>
                                        <option value="ผ่าน">ผ่าน</option>
                                        <option value="ไม่ผ่าน">ไม่ผ่าน</option>
                                    </select>
                                </td>
                            </tr>
                            {/* row 3 */}
                            <tr>
                                <th>3</th>
                                <td>English Proficiency Exam</td>
                                <td>none</td>
                                <td>
                                    <select value={status3} onChange={handleChangeStatus3}>
                                        <option value="รออนุมัติ">รออนุมัติ</option>
                                        <option value="ผ่าน">ผ่าน</option>
                                        <option value="ไม่ผ่าน">ไม่ผ่าน</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th>4</th>
                                <td>คะแนนทดสอบวัดความสามารถภาษาอังกฤษ</td>
                                <td>none</td>
                                <td>
                                    <select value={status4} onChange={handleChangeStatus4}>
                                        <option value="รออนุมัติ">รออนุมัติ</option>
                                        <option value="ผ่าน">ผ่าน</option>
                                        <option value="ไม่ผ่าน">ไม่ผ่าน</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th>5</th>
                                <td>ใบตรวจปริญญานิพนธ์</td>
                                <td>none</td>
                                <td>
                                    <select value={status5} onChange={handleChangeStatus5}>
                                        <option value="รออนุมัติ">รออนุมัติ</option>
                                        <option value="ผ่าน">ผ่าน</option>
                                        <option value="ไม่ผ่าน">ไม่ผ่าน</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th>6</th>
                                <td>ข้อมูล พ.ศ ขึ้นในระบบ</td>
                                <td>none</td>
                                <td>
                                    <select value={status6} onChange={handleChangeStatus6}>
                                        <option value="รออนุมัติ">รออนุมัติ</option>
                                        <option value="ผ่าน">ผ่าน</option>
                                        <option value="ไม่ผ่าน">ไม่ผ่าน</option>
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                        <br></br>
                    </table>
                    <input style={{alignItems: "center"}} type='submit' value={'Submit'} />
                </form>
            </div>
        </center>

    );
};



export default OffCheck;
