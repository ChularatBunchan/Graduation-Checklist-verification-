import styles from '@/styles/Headerbar.module.css'

const Hello = () => {
    return (
        <center>
            <div >
                    <img src='/bannercsb.gif' alt="Example GIF" className={`${styles.gif}`} />
                </div>
            <div className={`${styles.content}`}>
                <div>
                    <h1> รายวิชาที่จัดการเรียนเป็นภาษาต่างประเทศโครงการพิเศษ (สองภาษา)</h1>
                    <h3>หลักสูตรวิทยาศาสตรบัณฑิต สาขาวิชาวิทยาการคอมพิวเตอร์ (CSB)</h3>
                    <h3>*SPECIAL PROJECT I และ II จัดการเรียนเป็นภาษาอังกฤษทุกภาคการศึกษา</h3>
                </div>
                <div className={`${styles.Table}`}>
                    <table>
                        <tr>
                            <th>รหัสวิชา</th>
                            <th>ชื่อวิชา</th>
                        </tr>
                        <tr>
                            <td>040313017</td>
                            <td>EXERCISE SKILL AND SPORT</td>
                        </tr>
                        <tr>
                            <td>040613103</td>
                            <td>DISCRETE MATHEMATICS FOR COMPUTER SCIENCE</td>
                        </tr>
                        <tr>
                            <td>040613201</td>
                            <td>COMPUTER PROGRAMMING I</td>
                        </tr>
                        <tr>
                            <td>040613105	</td>
                            <td>NUMERICAL METHOD</td>
                        </tr>
                    </table>
                </div>
            </div>
        </center>
    )
}
export default Hello