import styles from "@/styles/Home.module.css";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaArrowCircleRight, FaArrowCircleLeft } from "react-icons/fa";
import axios from "axios";

const Check2 = () => {
  const router = useRouter();

  const handleNextButtonClick = () => {
    console.log("Next button clicked!");
    router.push("/component/Upload/check3");
    //   เหลือใส่ layout
  };
  const handleBackButtonClick = () => {
    console.log("Next button clicked!");
    router.push("/component/Upload/check1");
    //   เหลือใส่ layout
  };
  const [selectedFileName, setSelectedFileName] = useState('');
  const handleFileChange = (event) => {
    const fileInput = event.target;
    if (fileInput.files.length > 0) {
      const fileName = fileInput.files[0].name;
      console.log("file", fileName);
    } else {
      setSelectedFileName('');
    }    
    setFile(event.target.files[0])
  };

  const [file, setFile] = useState(null);
  const [pdfData, setPdfData] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  useEffect(() => {
    getPdf();
  }, []);

    const getPdf = async () => {
        try {
<<<<<<< HEAD
            const result = await axios.get("http://localhost:4000/file");
=======
            const result = await axios.get("http://localhost:4000/uploadintern");
>>>>>>> c132dab050b034e1e677927f9bf64bb7d9f6272d
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

    const formData = new FormData();
    formData.append("file", file);

        try {
<<<<<<< HEAD
            const result = await axios.post("http://localhost:4000/file", formData);
=======
            const result = await axios.post("http://localhost:4000/uploadintern", formData);
>>>>>>> c132dab050b034e1e677927f9bf64bb7d9f6272d
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
          <h1>2. หนังสือรับรองผลการฝึกงาน </h1>
          <br />
        </div>
        <div className={`${styles.Check1}`}>
          <h1>หนังสือรับรองผลการฝึกงาน</h1>
          <input type="file" name="file" onChange={handleFileChange}/>
          <input type="submit" value="Upload" />
        </div>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <span onClick={handleBackButtonClick} style={{ float: "left" }}>
            <FaArrowCircleLeft />
          </span>
          <br></br>
          <span onClick={handleNextButtonClick} style={{ float: "right" }}>
            <FaArrowCircleRight />
          </span>
        </div>
        <br></br>
      </form>
    </center>
  );
};
export default Check2;