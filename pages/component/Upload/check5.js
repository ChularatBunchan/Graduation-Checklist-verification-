import styles from '@/styles/Home.module.css'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaArrowCircleRight,FaArrowCircleLeft } from "react-icons/fa";
import axios from 'axios';

const Check5 = () => {
    const router = useRouter();

    const handleNextButtonClick = () => {
        console.log("Next button clicked!");
        router.push('/component/Upload/check6');
    };
    const handleBackButtonClick = () => {
        console.log("Back button clicked!");
        router.push('/component/Upload/check4');
    };

    const [file, setFile] = useState(null);
    const [pdfData, setPdfData] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(null);
    const [cefrLevel, setCefrLevel] = useState("A1"); // Default value

    useEffect(() => {
        getPdf();
    }, []);

    const getPdf = async () => {
        try {
            const result = await axios.get("http://localhost:4000/uploadcer");
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
        router.push('./check6');

        const formData = new FormData();
        formData.append("file", file);

        try {
            const result = await axios.post("http://localhost:4000/uploadcer", formData);
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

    return (
        <center>
            <form className={`${styles.Check}`} onSubmit={onSubmit}>
                <div style={{ display: "flex", marginLeft: "3rem" }}>
                    <h1>5. ใบประหน้าปริญญานิพนธ์ </h1><br />
                </div>

                <div className={`${styles.Check1}`} >
                    <h1>ใบประหน้าปริญญานิพนธ์</h1>
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

export default Check5;
