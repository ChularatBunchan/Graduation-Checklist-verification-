import styles from '@/styles/Home.module.css'
import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import { FaArrowCircleRight,FaArrowCircleLeft } from "react-icons/fa";


const Check2= () => {

    const router = useRouter();

    const handleNextButtonClick = () => {
      console.log("Next button clicked!");
      router.push('/component/Upload/check3');
    //   เหลือใส่ layout
    };
    const handleBackButtonClick = () => {
        console.log("Next button clicked!");
        router.push('/component/Upload/check1');
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
            // ทำสิ่งที่คุณต้องการกับไฟล์ที่ถูกลากมา ส่งไปที่เซิร์ฟเวอร์
            console.log('Uploaded PDF file:', uploadedFile.name);
            console.log('File content:', fileContent);
        } else {
            alert('Please drop a PDF file to upload.');
        }
    };

    return (
        <center>
            <form className={`${styles.Check}`}>
                <div style={{ display:"flex" , marginLeft:"3rem"}}>
                    <h1>2. หนังสือรับรองผลการฝึกงาน </h1><br />
                </div>
                <div className={`${styles.Check1}`} {...getRootProps()}>
                    <h1>หนังสือรับรองผลการฝึกงาน</h1>
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p>Drop the PDF file here...</p>
                    ) : (
                        <h4 style={{color: "red"}}>PDF file Only</h4>
                        
                    )}
                    {uploadedFile && (
                        <div>
                            <p>Selected file: {uploadedFile.name}</p>
                        </div>
                    )}
                    <button onClick={handleUpload}>Upload</button>
                </div>
                <div style={{display:"flex" ,justifyContent: "space-around"}} >
                  <span onClick={handleBackButtonClick} style={{  float: "left" }} >
                  <FaArrowCircleLeft />
                </span><br></br>
                <span onClick={handleNextButtonClick} style={{  float: "right" }} >
                <FaArrowCircleRight />
                </span>  
                </div>
                <br></br>
            </form>
        </center>
    )
}
export default Check2;