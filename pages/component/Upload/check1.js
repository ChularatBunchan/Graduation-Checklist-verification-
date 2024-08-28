import styles from "@/styles/Home.module.css";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

function Check1() {
  const router = useRouter();
  const [uploadStatus, setUploadStatus] = useState(null);
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [file3, setFile3] = useState(null);
  const [file4, setFile4] = useState(null);
  const [file5, setFile5] = useState(null);
  const [file6, setFile6] = useState(null);
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

  const UploadClick = async () => {
    console.log("file1 =", file1);
    console.log("file2 =", file2);
    console.log("file3 =", file3);
    console.log("file4 =", file4);
    console.log("file5 =", file5);
    console.log("file6 =", file6);

    let user = students.map((students, index) => students.st_id);

    const formData = new FormData();
    if (file1 != null) {
      formData.append("files[]", file1);
    }
    if (file2 == null || file3 == null || file4 == null || file5 == null || file6 == null) {
      alert("Uploaded file ไม่ครบ");
      return;
    }

    formData.append("files[]", file2);
    formData.append("files[]", file3);
    formData.append("files[]", file4);
    formData.append("files[]", file5);
    formData.append("files[]", file6);
    formData.append("std", user);

    try {
      const result = await axios.post("http://localhost:4000/files", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(result);
      alert("Uploaded Successfully!!!");
      setUploadStatus("success");
      router.reload();
    } catch (error) {
      console.error("Error uploading file: ", error.message);
      alert("Error uploading file. Please try again.");
      setUploadStatus("error");
    }
  };

  return (
    <div className={styles.Check}>
      <center className="grid grid-cols-1 divide-y border border-gray-200/2">
        <div>
          <div>
            <h1>1. เอกสารแสดงผลการเรียน </h1>
          </div>
          <div className={styles.Check1}>
            <input
              type="file"
              name="file"
              onChange={(e) => setFile1(e.target.files[0])}
            />
          </div>
        </div>

        <div>
          <div>
            <h1>2. หนังสือรับรองผลการฝึกงาน </h1>
          </div>
          <div className={styles.Check1}>
            <input
              type="file"
              name="file"
              onChange={(e) => setFile2(e.target.files[0])}
            />
          </div>
        </div>

        <div>
          <div>
            <h1>3. ทดสอบวัดความสามารถภาษาอังกฤษ(KMUTNB-TEPC) </h1>
          </div>
          <div className={styles.Check1}>
            <input
              type="file"
              name="file"
              onChange={(e) => setFile3(e.target.files[0])}
            />
          </div>
        </div>

        <div>
          <div>
            <h1>4. คะแนนภาษาอังกฤษ </h1>
          </div>
          <div className={styles.Check1}>
            <input
              type="file"
              name="file"
              onChange={(e) => setFile4(e.target.files[0])}
            />
          </div>
        </div>

        <div>
          <div>
            <h1>5. ใบประหน้าปริญญานิพนธ์ </h1>
          </div>
          <div className={styles.Check1}>
            <input
              type="file"
              name="file"
              onChange={(e) => setFile5(e.target.files[0])}
            />
          </div>
        </div>

        <div>
          <div>
            <h1>6. ระบบบริการตรวจสอบผู้สำเร็จการศึกษา </h1>
          </div>
          <div className={styles.Check1}>
            <input
              type="file"
              name="file"
              onChange={(e) => setFile6(e.target.files[0])}
            />
          </div>
        </div>

        <div className={styles.button}>
          <button onClick={UploadClick}>Upload</button>
          {uploadStatus && <div>{uploadStatus}</div>}
        </div>
      </center>
    </div>
  );
}

export default Check1;
