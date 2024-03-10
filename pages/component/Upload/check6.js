import styles from '@/styles/Home.module.css'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaArrowCircleLeft } from "react-icons/fa";
import axios from 'axios';

const Check6 = () => {
    const router = useRouter();

    const handleNextButtonClick = () => {
        console.log("Next button clicked!");
        router.push('/component/Hello');
    };
    const handleBackButtonClick = () => {
        console.log("Back button clicked!");
        router.push('/component/Upload/check5');
    };

    const [file, setFile] = useState(null);
    const [pdfData, setPdfData] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(null);

    useEffect(() => {
        getPdf();
    }, []);

    const getPdf = async () => {
        try {
            const result = await axios.get("http://localhost:8001/uploadgra");
            setPdfData(result.data.data);
        } catch (error) {
            console.error("Error fetching PDF data: ", error.message);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            alert("Please select a PICTURE!!!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const result = await axios.post("http://localhost:8001/uploadgra", formData);
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

    {/* ปุ่มบันทึก เชื่อมกับดาต้าเบส */ }
    const ToDatabase = async (e) => {
        e.preventDefault();

        const dataToSave = {
            file,
            pdfData
        };

        try {
            const response = await axios.post("http://localhost:8001/save-to-database", dataToSave);
            console.log(response.data);
            // alert("Data saved to the database successfully!");
        } catch (error) {
            console.error("Error saving data to the database: ", error.message);
            // alert("Error saving data to the database. Please try again.");
        }
    }


    return (
        <center>
            <form className={`${styles.Check}`} onSubmit={onSubmit} >
                <div style={{ display: "flex", marginLeft: "3rem" }}>
                    <h1>6. ระบบบริการตรวจสอบผู้สำเร็จการศึกษา </h1><br />
                </div>

                <div className={`${styles.Check1}`}>
                    <h1>ระบบบริการตรวจสอบผู้สำเร็จการศึกษา</h1>
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
                        <button onClick={ToDatabase}>save</button>
                    </span>
                </div>
                <br></br>
            </form>
        </center>
    )
}

export default Check6;
