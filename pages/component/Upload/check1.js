import styles from '@/styles/Home.module.css';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaArrowCircleRight, FaArrowCircleLeft } from 'react-icons/fa';
import axios from 'axios';

function Check1() {
  const router = useRouter();
  const [englishSubjects, setEnglishSubjects] = useState([]);
  const [file, setFile] = useState(null);
  const [pdfData, setPdfData] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [studentCode, setStudentCode] = useState('');

  const handleNextButtonClick = () => {
    console.log('Next button clicked!');
    router.push('/component/Upload/check2');
  };

  const handleBackButtonClick = () => {
    console.log('Back button clicked!');
    router.push('/component/Hello');
  };

  const getPdf = async () => {
    try {
      const result = await axios.get("http://localhost:4000/upload");
      setPdfData(result.data.data);
    } catch (error) {
      console.error("Error fetching PDF data: ", error.message);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file || !studentCode) {
      alert("Please select a file and enter student code.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("studentCode", studentCode);

    try {
      const result = await axios.post("http://localhost:4000/upload", formData);
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

      <form className={styles.Check} onSubmit={onSubmit}>
        <span onClick={handleBackButtonClick}>
          <FaArrowCircleLeft />
        </span>
        <div style={{ display: 'flex' }}>
          <h1>1. เอกสารแสดงผลการเรียน </h1>
        </div>

        <div className={styles.Check1}>
          <div>
            <label>รหัสนักศึกษา : </label>
            <input
              id="StudentCode"
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value)}
            />
          </div>
          <h1>เอกสารแสดงผลการเรียน </h1>
          <input
            type="file"
            name="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <input type="submit" value="Upload" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <span onClick={handleNextButtonClick} style={{ float: 'right' }}>
            <FaArrowCircleRight />
          </span>
        </div>
      </form>
    </center>
  );
}

export default Check1;