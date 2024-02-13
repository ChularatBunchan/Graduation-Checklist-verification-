import styles from '@/styles/Home.module.css'
import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import { FaArrowCircleRight,FaArrowCircleLeft } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";

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

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/jpeg, image/png' });

    const handleUpload = () => {
        if (uploadedFile) {
            console.log('Uploaded file:', uploadedFile.name);
            console.log('File content:', fileContent);
        } else {
            alert('Please drop a JPEG or PNG file to upload.');
        }
    };

    return (
        <center>
            <form className={`${styles.Check}`} >
                <div style={{ display: "flex", marginLeft: "3rem" }}>
                    <h1>6. ระบบบริการตรวจสอบผู้สำเร็จการศึกษา </h1><br />
                </div>

                <div className={`${styles.Check1}`} {...getRootProps()}>
                    <h1>ระบบบริการตรวจสอบผู้สำเร็จการศึกษา</h1>
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p>Drop the JPEG or PNG file here...</p>
                    ) : (
                        <h4 style={{ color: "red" }}>JPEG, PNG file Only</h4>
                    )}
                    {uploadedFile && (
                        <div>
                            <p>Selected file: {uploadedFile.name}</p>
                        </div>
                    )}
                    <button onClick={handleUpload}>Upload</button>
                </div>
                <div style={{ display: "flex", justifyContent: "space-around" }} >
                    <span onClick={handleBackButtonClick} style={{ float: "left" }} >
                    <FaArrowCircleLeft />
                    </span><br></br>
                    <span onClick={handleNextButtonClick} style={{ float: "right" }} >
                    <AiFillHome />
                    </span>
                </div>
                <br></br>
            </form>
        </center>
    )
}

export default Check6;
