import styles from '@/styles/Home.module.css'
import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import { FaArrowCircleRight,FaArrowCircleLeft } from "react-icons/fa";


const Check3 = () => {

    const router = useRouter();

    const handleNextButtonClick = () => {
        console.log("Next button clicked!");
        router.push('/component/Upload/check4');
      //   เหลือใส่ layout
      };
      const handleBackButtonClick = () => {
          console.log("Next button clicked!");
          router.push('/component/Upload/check2');
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
            // ทำสิ่งที่คุณต้องการกับไฟล์ที่ถูกลากมา ส่งไปที่เซิร์ฟเวอร์
            console.log('Uploaded PDF file:', uploadedFile.name);
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
            <form className={`${styles.Check}`} >
                <div style={{ display: "flex", marginLeft: "3rem" }}>
                    <h1>3. ทดสอบวัดความสามารถภาษาอังกฤษ(KMUTNB-TEPC) </h1><br />
                </div>
                <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                    <h2 style={{ marginRight: '10px' }}>CEFR Level Achievement :</h2><br />
                    <select
                        className={`${styles.Select}`}
                        defaultValue={"A1"}
                        onChange={handleChange}
                    >
                        <option value="A1">A1</option>
                        <option value="A2">A2</option>
                        <option value="B1">B1</option>
                        <option value="B2">B2</option>
                        <option value="C1">C1</option>
                    </select>
                    <h2 style={{color:"red"}}> * </h2>
                </div>


                <div className={`${styles.Check1}`} {...getRootProps()}>
                    <h1>ทดสอบวัดความสามารถภาษาอังกฤษ</h1>
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
export default Check3;
