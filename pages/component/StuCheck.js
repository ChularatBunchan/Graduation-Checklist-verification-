import React from 'react';
import styles from '@/styles/Headerbar.module.css'

const StuCheck = () => {
    return (
        <center style={{marginTop:"2rem"}}>
            <div className={`${styles.content}`}>
            <h1>ตรวจสอบการจบการศึกษา</h1>
            <div style={{overflowX:'auto'}}>
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
                            <td>รออนุมัติ</td>
                        </tr>
                        {/* row 2 */}
                        <tr>
                            <th>2</th>
                            <td>หนังสือรับรองการฝึกงาน</td>
                            <td>none</td>
                            <td>รออนุมัติ</td>
                        </tr>
                        {/* row 3 */}
                        <tr>
                            <th>3</th>
                            <td>English Proficiency Exam</td>
                            <td>none</td>
                            <td>รออนุมัติ</td>
                        </tr>
                        <tr>
                            <th>4</th>
                            <td>คะแนนทดสอบวัดความสามารถภาษาอังกฤษ</td>
                            <td>none</td>
                            <td>รออนุมัติ</td>
                        </tr>
                        <tr>
                            <th>5</th>
                            <td>ใบตรวจปริญญานิพนธ์</td>
                            <td>none</td>
                            <td>รออนุมัติ</td>
                        </tr>
                        <tr>
                            <th>6</th>
                            <td>ข้อมูล พ.ศ ขึ้นในระบบ</td>
                            <td>none</td>
                            <td>รออนุมัติ</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {/* <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.firstName}</td>
              <td>{student.lastName}</td>
              <td>{student.grade}</td>
              <td>{student.subject}</td>
            </tr>
          ))}
        </tbody> */}
        </div>
        </center>
        
    );
};

// export async function getServerSideProps() {
//     try {
//         await mongoose.connect(process.env.MONGODB_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log('Connected to MongoDB');
//     } catch (err) {
//         console.error(err.message);
//         process.exit(1);
//     }

//     const students = await Student.find();

//     return {
//         props: {
//             students: JSON.parse(JSON.stringify(students)),
//         },
//     };
// }

export default StuCheck;
