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

  const UploadClick = () => {
    alert("click");
    console.log("file1 =", file1);
    console.log("file2 =", file2);
    console.log("file3 =", file3);
    console.log("file4 =", file4);
    console.log("file5 =", file5);
    console.log("file6 =", file6);
    
    let user=students.map((students, index) => students.username);
    
    const formData = new FormData();
    if (file1 != null) {
      formData.append("isfile1",true)
    }
    if (file2 == null || file3 == null || file4 == null|| file5 == null || file6 == null){
      alert("Uploaded file ไม่ครบ")
      return 
    }

    formData.append("files[]", file1);
    formData.append("files[]", file2);
    formData.append("files[]", file3);
    formData.append("files[]", file4);
    formData.append("files[]", file5);
    formData.append("files[]", file6);
    formData.append("std", user);
    try {
      //ถ้าอัพไฟล์ได้
      const result = axios.post("http://localhost:8000/files", formData);
      console.log(result);
      // if (result.data.status === "ok") {
      alert("Uploaded Successfully!!!");
      // setUploadStatus("success");
      // }
    } catch (error) {
      console.error("Error uploading file: ", error.message);
      alert("Error uploading file. Please try again.");
      // setUploadStatus("error");
    }
  };

  return (
    <div>
      {/* <HeaderBar /> */}
      <div
        class="grid grid-cols-1 divide-y border border-gray-200/2"
        style={{ textAlign: "center", margin: "auto" }}
      >
        <div>
          <div style={{ display: "flex" }}>
            <h1>1. เอกสารแสดงผลการเรียน </h1>
          </div>
          <div className={styles.Check1}>
            <input
              type="file"
              name="file"
              onChange={(e) => setFile1(e.target.files[0])}
            />
            {/* <input type="button" value="Upload" /> */}
          </div>
        </div>

        <div>
          <div style={{ display: "flex" }}>
            <h1>2. หนังสือรับรองผลการฝึกงาน </h1>
          </div>
          <div className={styles.Check1}>
            <input
              type="file"
              name="file"
              onChange={(e) => setFile2(e.target.files[0])}
            />
            {/* <input type="button" value="Upload" /> */}
          </div>
        </div>

        <div>
          <div style={{ display: "flex" }}>
            <h1>3. ทดสอบวัดความสามารถภาษาอังกฤษ(KMUTNB-TEPC) </h1>
          </div>
          <div className={styles.Check1}>
            <input
              type="file"
              name="file"
              onChange={(e) => setFile3(e.target.files[0])}
            />
            {/* <input type="button" value="Upload" /> */}
          </div>
        </div>

        <div>
          <div style={{ display: "flex" }}>
            <h1>4. คะแนนภาษาอังกฤษ </h1>
          </div>
          <div className={styles.Check1}>
            <input
              type="file"
              name="file"
              onChange={(e) => setFile4(e.target.files[0])}
            />
            {/* <input type="button" value="Upload" /> */}
          </div>
        </div>

        <div>
          <div style={{ display: "flex" }}>
            <h1>5. ใบประหน้าปริญญานิพนธ์ </h1>
          </div>
          <div className={styles.Check1}>
            <input
              type="file"
              name="file"
              onChange={(e) => setFile5(e.target.files[0])}
            />
            {/* <input type="button" value="Upload" /> */}
          </div>
        </div>

        <div>
          <div style={{ display: "flex" }}>
            <h1>6. ระบบบริการตรวจสอบผู้สำเร็จการศึกษา </h1>
          </div>
          <div className={styles.Check1}>
            <input
              type="file"
              name="file"
              onChange={(e) => setFile6(e.target.files[0])}
            />
            {/* <input type="button" value="Upload"  /> */}
          </div>
        </div>

        <div>
          <input type="button" value="Upload" onClick={UploadClick} />
        </div>
      </div>
    </div>
  );
}

export default Check1;