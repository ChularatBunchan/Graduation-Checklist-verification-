import styles from '@/styles/Home.module.css'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaArrowCircleRight,FaArrowCircleLeft } from "react-icons/fa";
import axios from 'axios';

const Check4 = () => {
    const router = useRouter();

    const handleNextButtonClick = () => {
        console.log("Next button clicked!");
        router.push('/component/Upload/check5');
      //   เหลือใส่ layout
      };
      const handleBackButtonClick = () => {
          console.log("Next button clicked!");
          router.push('/component/Upload/check3');
        //   เหลือใส่ layout
        }

        const [file, setFile] = useState(null);
        const [pdfData, setPdfData] = useState(null);
        const [uploadStatus, setUploadStatus] = useState(null);
        const [cefrLevel, setCefrLevel] = useState("TOEIC"); // Default value
    
        useEffect(() => {
            getPdf();
        }, []);
    
        const getPdf = async () => {
            try {
                const result = await axios.get("http://localhost:4000/uploadeng");
                setPdfData(result.data.data);
            } catch (error) {
                console.error("Error fetching PDF data: ", error.message);
            }
        };
    
        const onSubmit = async (e) => {
            e.preventDefault();
            if (!file) {
                alert("Please select a file.");
                return;
            }
            router.push('./check5');
    
            const formData = new FormData();
            formData.append("file", file);
            formData.append("cefrLevel", cefrLevel); // Add CEFR level to the formData
    
            try {
                const result = await axios.post("http://localhost:4000/uploadeng", formData);
                console.log(result);
                if (result.data.status === "ok") {
                    alert("Uploaded Successfully!!!");
                    setUploadStatus("success");
                    getPdf();
                }
            } catch (error) {
                console.error("Error uploading file: ", error.message);
                alert("Error uploading file. Please try again.");
                setUploadStatus("error");
            }
        };
    
        const handleChange = (e) => {
            const { value } = e.target;
            setCefrLevel(value);
        };

    return (
        <center>
            <form className={`${styles.Check}`} onSubmit={onSubmit}>
                <div style={{ display: "flex", marginLeft: "3rem" }}>
                    <h1>4. คะแนนภาษาอังกฤษ </h1><br />
                </div>
                <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                    <h2 style={{ marginRight: '10px' }}>สถานบันทดสอบทางภาษา :</h2><br />
                    <select
                        className={`${styles.Select}`}
                        defaultValue={"TOEIC "}
                        onChange={handleChange}
                    >
                        <option value="TOEIC ">TOEIC </option>
                        <option value="K-StEP-Test">K-StEP Test</option>
                        <option value="TOEFL">TOEFL</option>
                        <option value="IELTS ">IELTS </option>
                        <option value="IDP-Test">IDP-Test</option>
                        <option value="TU-GET">TU-GET</option>
                        <option value="CU-GET">CU-GET</option>
                        <option value="CEFR">CEFR</option>
                    </select>
                    <h2 style={{ color: "red" }}> * </h2>
                </div>
                <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                    <h2 style={{ marginRight: '10px' }}>คะแนนสอบ :</h2><br />
                    <input
                        className={`${styles.Select}`}
                    ></input>
                    <h2 style={{ color: "red" }}> * </h2>
                </div>


                <div className={`${styles.Check1}`} onSubmit={onSubmit}>
                    <h1> คะแนนภาษาอังกฤษ</h1>
                    <input
                        type="file"
                        name="file"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    <input type="submit" value="Upload" />
                </div>
                <div style={{ display: "flex", justifyContent: "space-around" }} >
                    <span onClick={handleBackButtonClick} style={{ float: "left" }} >
                    <FaArrowCircleLeft />
                    </span><br></br>
                    <span onClick={handleNextButtonClick} style={{ float: "right" }} >
                    <FaArrowCircleRight />
                    </span>
                </div>
                <br></br>
            </form>
        </center>
    )
}

export default Check4;