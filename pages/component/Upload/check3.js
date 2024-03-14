import styles from '@/styles/Home.module.css'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaArrowCircleRight, FaArrowCircleLeft } from "react-icons/fa";
import axios from 'axios';

const Check3 = () => {
    const router = useRouter();

    const handleNextButtonClick = () => {
        console.log("Next button clicked!");
        router.push('/component/Upload/check4');
    };
    const handleBackButtonClick = () => {
        console.log("Next button clicked!");
        router.push('/component/Upload/check2');
    }

    const [file, setFile] = useState(null);
    const [pdfData, setPdfData] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(null);
    const [cefrLevel, setCefrLevel] = useState("A1"); // Default value

    useEffect(() => {
        getPdf();
    }, []);

    const getPdf = async () => {
        try {
            const result = await axios.get("http://localhost:4000/uploadtepc");
            setPdfData(result.data.data);
        } catch (error) {
            console.error("Error fetching PDF data: ", error.message);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        if (!file) {
            alert("Please select a file.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("cefrLevel", cefrLevel); // Add CEFR level to the formData

        try {
            const result = await axios.post("http://localhost:4000/uploadtepc", formData);
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
            <form className={`${styles.Check}`} onSubmit={onSubmit} >
                <div style={{ display: "flex", marginLeft: "3rem" }}>
                    <h1>3. ทดสอบวัดความสามารถภาษาอังกฤษ(KMUTNB-TEPC) </h1><br />
                </div>
                <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                    <h2 style={{ marginRight: '10px' }}>CEFR Level Achievement :</h2><br />
                    <select
                        className={`${styles.Select}`}
                        value={cefrLevel}
                        onChange={handleChange}
                    >
                        <option value="A1">A1</option>
                        <option value="A2">A2</option>
                        <option value="B1">B1</option>
                        <option value="B2">B2</option>
                        <option value="C1">C1</option>
                    </select>
                    <h2 style={{ color: "red" }}> * </h2>
                </div>

                <div className={`${styles.Check1}`}>
                    <h1>ทดสอบวัดความสามารถภาษาอังกฤษ</h1>
                    <input
                        type="file"
                        name="file"
                        onChange={(e) => setFile(e.target.files[0])} // Use e.target.files[0] to get the selected file
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
export default Check3;
