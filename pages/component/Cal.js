import styles from '@/styles/Home.module.css'
import { Button } from '@material-tailwind/react';
import React, { useState} from 'react';

const Cal = () => {
    const [NCredit, setNCredit] = useState('0.0');
    const [GPA, setGPA] = useState('0.0');

    const [subs, setSubs] = useState(Array.from({ length: 9 }, () => ({ cg: '', gp: '' })));

    const handleChange = (index, type, value) => {
        setSubs(prevState => {
            const updatedSubs = [...prevState];
            updatedSubs[index][type] = value;
            return updatedSubs;
        });
        if (type === 'cg') {
            setNCredit(value);
        } else if (type === 'gp') {
            setGPA(value);
        }
    };
    console.log('subs =',subs)
    console.log('NCredit =',NCredit)
    console.log('GPA =',GPA)
    

    const calculate = () => {
        let totalCG = parseFloat(document.getElementById('TotalCG').value) || 0; // Initialize totalCG
        let totalGP = parseFloat(document.getElementById('TotalGP').value) || 0; // Initialize totalGP
    
        // Loop through Sub1 to Sub9 to calculate totalCG and totalGP
        for (let i = 0; i < subs.length; i++) {
            var cg = parseFloat(subs[i].cg) || 0; // Ensure cg is a number, or default to 0
            console.log('cg=',cg)
            var gp = parseFloat(subs[i].gp) || 0; // Ensure gp is a number, or default to 0
            console.log('gp=',gp)
            totalCG += cg;
            console.log('totalCG=',totalCG)
            totalGP += gp;
            console.log('totalGP=',totalGP)
        }
        const gpa = totalCG === 0 ? 0 : totalGP / totalCG; // Prevent division by zero
        setNCredit(totalCG); // setNCredit to totalCG
        setGPA(gpa.toFixed(2)); // setGPA to gpa
        console.log('gpa =',gpa)
        console.log('totalCG =',totalCG)
    };

    const limit = (element) => {
        const max_chars = 4;
        const value = element.target.value.replace(/\D/g, ''); // เอาเฉพาะตัวเลขโดยไม่รวมจุดทศนิยม
        if (value.length > max_chars) {
            element.target.value = value.substr(0, max_chars);
        }
    };
    

    return (
        <div>
            <center className={`${styles.Cal}`}>
                <div className={`${styles.CalHead}`}>
                    <form>
                        <h1>ระบบคำนวณผลการเรียนล่วงหน้า</h1>
                        <h3>ผลการเรียนรวมทั้งหมด</h3>
                        <div className={`${styles.Calflex}`}>
                            <div style={{ flexDirection: 'column', width: "50%" }}>
                                <div className={`${styles.CalBox}`}>
                                    <center>
                                        <div>
                                            <label>จำนวนหน่วยกิจที่คิดเกรด (CG)</label><br></br>
                                            <input type='number' id='TotalCG' name='CG' onKeyDown={limit} onKeyUp={limit} required></input><br />
                                        </div>
                                        <div>
                                            <label> ค่าคะแนน (GP)</label><br></br>
                                            <input type='number' id='TotalGP' name='GP' onKeyDown={limit} onKeyUp={limit} required></input>
                                        </div>
                                    </center><br ></br>
                                </div>
                                <div className={`${styles.CalBox0}`}>
                                    <h5 >* จำนวนหน่วยกิจที่คิดเกรด(CG) และ ค่าคะแนน(GP) ให้ดูจากผลการเรียนภาคการศึกษาล่าสุด
                                        ในระบบดูเกรดและประเมินการสอนของมหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ(Reg)</h5>
                                </div><br />
                                <h3 style={{ color: "#07AA9F" }}>ผลการเรียนในวิชาที่คาดว่าจะได้ในเทอมนี้</h3>
                                <div className={`${styles.CalBox}`} style={{ gap: '2rem' }} >
                                    {subs.map((sub, index) => (
                                        <div key={index} className={`${styles.Sub}`}>
                                            <select className={`${styles.select}`} value={sub.cg} onChange={e => handleChange(index, 'cg', e.target.value)}>
                                                <option disabled value=''>จำนวนหน่วยกิต </option>
                                                <option value='none'>-</option>
                                                <option value='1'>1</option>
                                                <option value='2'>2</option>
                                                <option value='3'>3</option>
                                            </select>
                                            <select className={`${styles.select}`} value={sub.gp} onChange={e => handleChange(index, 'gp', e.target.value)}>
                                                <option disabled value=''>เกรดที่คาดว่าจะได้รับ</option>
                                                <option value='none'>-</option>
                                                <option value='4'>A</option>
                                                <option value='3.5'>B+</option>
                                                <option value='3'>B</option>
                                                <option value='2.5'>C+</option>
                                                <option value='2'>C</option>
                                                <option value='1.5'>D+</option>
                                                <option value='1'>D</option>
                                                <option value='0'>F</option>
                                                <option value='0'>FA</option>
                                                <option value='0'>FE</option>
                                                <option value='0'>W</option>
                                                <option value='0'>I</option>
                                            </select>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={`${styles.CalBox2}`} style={{ flexDirection: 'column' }} >
                                <label>จำนวนหน่วยกิตที่ลงสะสม</label><br />
                                <center><input id='NCredit' name='NCredit' value={NCredit} disabled></input></center><br />
                                <label>[GPA] คะแนนเฉลี่ยสะสม</label><br />
                                <center><input id='GPA' name='GPA' value={GPA} disabled></input></center><br />
                                <center>
                                    <img src='/grade.png' width={'90%'}></img>
                                </center>
                            </div>
                        </div>
                        <Button onClick={calculate}>
                            Calculate
                        </Button>
                    </form>
                </div>
            </center>
        </div>
    )
}

export default Cal;