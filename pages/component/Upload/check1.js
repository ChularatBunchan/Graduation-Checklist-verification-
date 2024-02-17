import styles from '@/styles/Home.module.css'
import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import { FaArrowCircleRight,FaArrowCircleLeft } from "react-icons/fa";

const Check1 = () => {

    const router = useRouter();

    const handleNextButtonClick = () => {
      console.log("Next button clicked!");
      router.push('/component/Upload/check2');
    //   เหลือใส่ layout
    };
    const handleBackButtonClick = () => {
        console.log("Next button clicked!");
        router.push('/component/Hello');
      //   เหลือใส่ layout
      }

    const [uploadedFile, setUploadedFile] = useState(null);
    const [fileContent, setFileContent] = useState('');

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        setUploadedFile(file);

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;
            setFileContent(content);
        };
        reader.readAsText(file);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: '.pdf' });

    const handleUpload = () => {
        if (uploadedFile) {
            // Send the PDF file to the server
            const formData = new FormData();
            formData.append('file', uploadedFile);
    
            fetch('http://localhost:5000/extract', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Handle the extracted data here
                console.log('Extracted data:', data);
            })
            .catch(error => console.error('Error:', error));
        } else {
            alert('Please drop a PDF file to upload.');
        }
    };
    

    return (
        <center>
            <form className={`${styles.Check}`}>
                <span onClick={handleBackButtonClick}>
                <FaArrowCircleLeft />
                </span><br></br>
                <div style={{ display: "flex" }}>
                    <h1>1. เอกสารแสดงผลการเรียน </h1><br />
                </div>
                <div className={`${styles.Check1}`} {...getRootProps()}>
                    <h1>เอกสารแสดงผลการเรียน </h1>
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p>Drop the PDF file here...</p>
                    ) : (
                        <p style={{color: "red"}}>PDF file Only</p>
                        
                    )}
                    {uploadedFile && (
                        <div>
                            <p>Selected file: {uploadedFile.name}</p>
                        </div>
                    )}
                    <button onClick={handleUpload}>Upload</button>
                </div>
                <div style={{ display: "flex", justifyContent: "space-around" }} >
                    <br></br>
                    <span onClick={handleNextButtonClick} style={{  float: "right" }} >
                        <FaArrowCircleRight />
                    </span>
                </div>
            </form>
        </center>
    )
}
export default Check1;