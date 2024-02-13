import styles from '@/styles/Home.module.css'
import { Button } from '@material-tailwind/react';

const Cal = () => {
    return (
        <div>
            <center className={`${styles.Cal}`}>
                <div className={`${styles.CalHead}`}>
                    <h1>ระบบคำนวณผลการเรียนล่วงหน้า</h1>
                    <h3>จำนวนวิชาภาษาอังกฤษที่เรียนแล้ว</h3>
                    <h3>ผลการเรียนรวมทั้งหมด</h3>
                    <form>
                        <div className={`${styles.CalBox}`}>
                            <div>
                                <label>จำนวนหน่วยกิจที่คิดเกรด (CG)</label><br></br>
                                <input></input>
                            </div>
                            <div className={`${styles.CalBox1}`}>
                                <label> ค่าคะแนน (GP)</label><br></br>
                                <input></input>
                            </div><br ></br>
                        </div>
                        <div style={{ color: 'red' }}>
                            <h5 >* จำนวนหน่วยกิจที่คิดเกรด(CG) และ ค่าคะแนน(GP) ให้ดูจากผลการเรียนภาคการศึกษาล่าสุด
                                ในระบบดูเกรดและประเมินการสอนของมหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ(Reg)</h5>
                        </div>
                        
                        <div className={`${styles.Calflex}`} >
                            <div className={`${styles.CalBox}`} style={{flexDirection: 'column'}} >
                                <label>ผลการเรียนในวิชาที่คาดว่าจะได้ในเทอมนี้</label><br />
                                <input></input>
                            </div>
                            <div className={`${styles.CalBox}`} style={{flexDirection: 'column'}} >
                                <label>จำนวนหน่วยกิตที่ลงสะสม</label><br />
                                <input></input>
                                <label>[GPA] คะแนนเฉลี่ยสะสม</label><br />
                                <input></input>
                            </div>
                        </div>
                        <Button>
                            Calculate
                        </Button>
                    </form>

                </div>
            </center>

        </div>
    )
}
export default Cal;