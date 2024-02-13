import styles from '@/styles/Home.module.css'
import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import { FaArrowCircleRight,FaArrowCircleLeft } from "react-icons/fa";


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

    const handleChange = (value) => {
        console.log('selected ' + value);
    };

    return (
        <center>
            <form className={`${styles.Check}`}>
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


                <div className={`${styles.Check1}`} {...getRootProps()}>
                    <h1> คะแนนภาษาอังกฤษ</h1>
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
                    <FaArrowCircleRight />
                    </span>
                </div>
                <br></br>
            </form>
        </center>
    )
}

export default Check4;
