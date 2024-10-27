import styles from '@/styles/Home.module.css';
import { Button } from '@material-tailwind/react';
import React, { useState, useEffect } from 'react';
import {
    LinearProgress,
    Typography
  } from "@mui/material";

const Cal = () => {
    const [NCredit, setNCredit] = useState(0.0);
    const [GPA, setGPA] = useState(0.0);
    const [loading, setLoading] = useState(true);
    const [subs, setSubs] = useState(Array.from({ length: 9 }, () => ({ cg: '', gp: '' })));

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000); // Loading time in milliseconds (e.g., 2000ms = 2 seconds)

        return () => clearTimeout(timer); 
    }, []);

    const handleChange = (index, type, value) => {
        setSubs(prevState => {
            const updatedSubs = [...prevState];
            updatedSubs[index][type] = value;
            return updatedSubs;
        });
    };

    const calculate = () => {
        let totalCG = parseFloat(document.getElementById('TotalCG').value) || 0;
        let totalGP = parseFloat(document.getElementById('TotalGP').value) || 0;

        subs.forEach(sub => {
            const cg = parseFloat(sub.cg) || 0;
            const gp = parseFloat(sub.gp) || 0;

            totalCG += cg;
            totalGP += gp * cg;
        });

        const gpa = totalCG > 0 ? totalGP / totalCG : 0;
        setNCredit(totalCG);
        setGPA(gpa.toFixed(2));
    };

    const limit = (e) => {
        const max_chars = 4;
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, max_chars);
    };

    if (loading) {
        return (
            <div>
                <LinearProgress
                    sx={{
                        backgroundColor: "#f1a27a",
                        "& .MuiLinearProgress-bar": { backgroundColor: "#EB6725" },
                    }}
                />
            </div>
        );
    }

    return (
        <div>

            <center className={styles.Cal}>
                <div className={styles.CalHead}>
                    <form>
                        <h1>ระบบคำนวณผลการเรียนล่วงหน้า</h1>
                        <h3>ผลการเรียนรวมทั้งหมด</h3>

                        <div className={styles.Calflex}>
                            <div style={{ flexDirection: 'column', width: "50%" }}>
                                <div className={styles.CalBox}>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ marginLeft: '60px' }}>
                                            <label>จำนวนหน่วยกิจที่คิดเกรด (CG)</label><br />
                                            <input 
                                                type='number' 
                                                id='TotalCG' 
                                                onKeyDown={limit} 
                                                onKeyUp={limit} 
                                                required 
                                            />
                                        </div>
                                        <div>
                                            <label>ค่าคะแนน (GP)</label><br />
                                            <input 
                                                type='number' 
                                                id='TotalGP' 
                                                onKeyDown={limit} 
                                                onKeyUp={limit} 
                                                required 
                                            />
                                        </div>
                                    </div>
                                </div>

                                <h3 style={{ color: "#07AA9F" }}>ผลการเรียนในวิชาที่คาดว่าจะได้ในเทอมนี้</h3>
                                <div className={styles.CalBox} style={{ gap: '2rem' }}>
                                    {subs.map((sub, index) => (
                                        <div key={index} className={styles.Sub}>
                                            <select 
                                                className={styles.select} 
                                                value={sub.cg} 
                                                onChange={e => handleChange(index, 'cg', e.target.value)}
                                            >
                                                <option value="">จำนวนหน่วยกิต</option>
                                                <option value="-">-</option> {/* ตัวเลือกสำหรับยกเลิก */}
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                            </select>

                                            <select 
                                                className={styles.select} 
                                                value={sub.gp} 
                                                onChange={e => handleChange(index, 'gp', e.target.value)}
                                            >
                                                <option value="">เกรดที่คาดว่าจะได้รับ</option>
                                                <option value="4">A</option>
                                                <option value="3.5">B+</option>
                                                <option value="3">B</option>
                                                <option value="2.5">C+</option>
                                                <option value="2">C</option>
                                                <option value="1.5">D+</option>
                                                <option value="1">D</option>
                                                <option value="0">F</option>
                                            </select>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.CalBox2} style={{ flexDirection: 'column' }}>
                                <label>จำนวนหน่วยกิตที่ลงสะสม</label><br />
                                <center>
                                    <input id='NCredit' value={NCredit} disabled />
                                </center><br />

                                <label>[GPA] คะแนนเฉลี่ยสะสม</label><br />
                                <center>
                                    <input id='GPA' value={GPA} disabled />
                                </center><br />

                                <center>
                                    <img src='/grade.png' width='85%' alt="GPA Chart" />
                                </center>
                            </div>
                        </div>

                        <Button onClick={calculate} color="lightBlue">
                            คำนวณ
                        </Button>
                    </form>
                </div>
            </center>
        </div>
    );
};

export default Cal;