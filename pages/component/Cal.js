import styles from '@/styles/Home.module.css'
import { Button } from '@material-tailwind/react';
import React, { useState, useCallback } from 'react';


const Cal = () => {
    const [NCredit, setNCredit] = useState('0.0');
    const [GPA, setGPA] = useState('0.0');

    const calculate = () => {
        // Your calculation logic here
        // For example, you can set NCredit and GPA based on the inputs
        setNCredit('Your calculated NCredit value');
        setGPA('Your calculated GPA value');
    };

    return (
        <div>
            <center className={`${styles.Cal}`}>
                <div className={`${styles.CalHead}`}>

                    <form>
                        <h1>ระบบคำนวณผลการเรียนล่วงหน้า</h1>
                        <h3>จำนวนวิชาภาษาอังกฤษที่เรียนแล้ว</h3>
                        <input style={{ width: "40rem" }} type='range' min={0} max={100} value={80} id='Nsub' name='Nsub' readOnly></input>
                        <h3>ผลการเรียนรวมทั้งหมด</h3>
                        <div className={`${styles.Calflex}`} >
                            <div style={{width: "40%"}}>
                               <div className={`${styles.CalBox}`}>
                                <div>
                                    <label>จำนวนหน่วยกิจที่คิดเกรด (CG)</label><br></br>
                                    <input type='number' min={'0.00'} id='CG' name='CG' required></input><br />
                                    <label> ค่าคะแนน (GP)</label><br></br>
                                    <input type='number' min={'0.00'} id='GP' name='GP' required></input>
                                </div><br ></br>
                            </div>
                            <div className={`${styles.CalBox0}`}>
                                    <h5 >* จำนวนหน่วยกิจที่คิดเกรด(CG) และ ค่าคะแนน(GP) ให้ดูจากผลการเรียนภาคการศึกษาล่าสุด
                                        ในระบบดูเกรดและประเมินการสอนของมหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ(Reg)</h5>
                                </div>

                            <div className={`${styles.CalBox}`} style={{ flexDirection: 'column' }} >
                                <label>ผลการเรียนในวิชาที่คาดว่าจะได้ในเทอมนี้</label><br />
                                <label>รายวิชาที่ 1 จำนวนหน่วยกิต</label>
                                <input type='number' id='Sub1' min={1} max={9} pattern={1}></input>
                                <label>รายวิชาที่ 2 จำนวนหน่วยกิต</label>
                                <input type='number' id='Sub2' min={1} max={9} pattern={1} ></input>
                                <label>รายวิชาที่ 3 จำนวนหน่วยกิต</label>
                                <input type='number' id='Sub3' min={1} max={9} pattern={1}></input>
                                <label>รายวิชาที่ 4 จำนวนหน่วยกิต</label>
                                <input type='number' id='Sub4' min={1} max={9} pattern={1} ></input>
                                <label>รายวิชาที่ 5 จำนวนหน่วยกิต</label>
                                <input type='number' id='Sub5' min={1} max={9} pattern={1} ></input>
                            </div> 
                            </div>
                            
                            <div className={`${styles.CalBox2}`} style={{ flexDirection: 'column' }} >
                                <label>จำนวนหน่วยกิตที่ลงสะสม</label><br />
                                <center><input id='NCredit' name='NCredit' value={'0.0'} disabled></input></center><br />
                                <label>[GPA] คะแนนเฉลี่ยสะสม</label><br />
                                <center><input id='GPA' name='GPA' value={'0.0'} disabled></input></center><br />
                                <img src='/grade.png'></img>
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