import styles from "@/styles/Home.module.css";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

function Check1() {
  const router = useRouter();
  const [uploadStatus, setUploadStatus] = useState(null);
  const [files, setFiles] = useState(Array(6).fill(null)); // Use an array to manage file inputs
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/students");
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (index) => (e) => {
    const newFiles = [...files];
    newFiles[index] = e.target.files[0];
    setFiles(newFiles);
  };

  const UploadClick = async () => {
    const user = students.map((student) => student.st_id);
    const name = students.map((student) => student.st_name);

    const formData = new FormData();
    files.forEach((file, index) => {
      if (file) {
        formData.append(`files[]`, file);
      } else {
        alert(`Uploaded file ${index + 1} ไม่ครบ`);
        return;
      }
    });

    formData.append("std", user[0]); // Assuming single user
    formData.append("stdName", name[0]); // Assuming single user

    try {
      const result = await axios.post("http://localhost:4000/files", formData);
      setUploadStatus("success");
      alert("Uploaded Successfully!!!");
      await handleFileUpload(user[0]);
    } catch (error) {
      console.error("Error uploading file: ", error.message);
      alert("Error uploading file. Please try again.");
      setUploadStatus("error");
    }
  };

  const handleFileUpload = async (fi_id) => {
    try {
      await axios.patch(`http://localhost:4000/files/${fi_id}`, {
        fi_status: "ยังไม่ได้ตรวจสอบ",
      });
    } catch (error) {
      console.error("Error updating file status:", error);
    }
  };

  return (
    <div className={styles.Check}>
      <center>
        {["เอกสารแสดงผลการเรียน", "หนังสือรับรองผลการฝึกงาน", "ทดสอบวัดความสามารถภาษาอังกฤษ(KMUTNB-TEPC)", "คะแนนภาษาอังกฤษ", "ใบประหน้าปริญญานิพนธ์", "ระบบบริการตรวจสอบผู้สำเร็จการศึกษา"].map((title, index) => (
          <div key={index}>
            <h1>{index + 1}. {title}</h1>
            <div className={styles.Check1}>
              <input type="file" onChange={handleFileChange(index)} />
            </div>
          </div>
        ))}
        <div className={styles.button}>
          <button onClick={UploadClick}>Upload</button>
          {uploadStatus && <div>{uploadStatus}</div>}
        </div>
      </center>
    </div>
  );
}

export default Check1;
