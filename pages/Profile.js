import React, { useState, useEffect } from "react";
import axios from "axios";
// import { Slider } from "@mui/material";
import { LinearProgress, Typography, Box } from "@mui/material";
import styles from "@/styles/Headerbar.module.css";

const Profile = () => {
  const [students, setStudents] = useState([]);
  const [timeupload, setTimeUpload] = useState([]);
  const [timeverified, setTimeVerified] = useState([]);
  const [fiCredits, setFiCredits] = useState(0);
  const [sliderMax, setSliderMax] = useState(150);
  const [error, setError] = useState(null);

  useEffect(() => {
    const st_id = localStorage.getItem("st_id");
    if (!st_id) {
      console.error("No st_id found in localStorage. Redirecting to login...");
      return;
    }

    const modified_st_id = st_id.substring(1);

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/students?st_id=${modified_st_id}`
        );
        const response2 = await axios.get(
          `http://localhost:4000/graduate_checkings?st_id=${modified_st_id}`
        );
        const response3 = await axios.get(
          `http://localhost:4000/files?st_id=${modified_st_id}`
        );

        console.log("API Response:", response.data);

        const uniqueStudents = response.data.reduce((acc, current) => {
          const x = acc.find((item) => item.st_id === current.st_id);
          if (!x) {
            acc.push(current);
          }
          return acc;
        }, []);

        setStudents(uniqueStudents);
        setTimeUpload(response2.data);
        setTimeVerified(response3.data);

        if (response3.data.length > 0 && response3.data[0].fi_credit) {
          setFiCredits(parseInt(response3.data[0].fi_credit, 10));
        }

        if (uniqueStudents.length > 0) {
          const st_id_prefix = parseInt(
            uniqueStudents[0].st_id.substring(0, 2),
            10
          );
          if (st_id_prefix > 64) {
            setSliderMax(128);
          } else if ([63, 62, 61, 60, 59, 58].includes(st_id_prefix)) {
            setSliderMax(135);
          }
        }

        if (response.data.length === 0) {
          setError("No student data found.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch student data.");
      }
    };

    fetchData();
  }, []);

  return (
    <center style={{ marginTop: "2rem" }}>
      <div className={`${styles.content}`}>
        {students.map((student, index) => (
          <div key={index}>
            <p>รหัสนักศึกษา: {student.st_id}</p>
            <p>
              ชื่อ: {student.st_name} | {student.st_firstname_en}{" "}
              {student.st_lastname_en}
            </p>
            <p>อีเมล์: {student.st_email}</p>
          </div>
        ))}
        {timeverified.map((time, index) => (
          <div key={index}>
            <p>อัปโหลดล่าสุด: {time.fi_time}</p>
          </div>
        ))}
        {timeupload.map((data, index) => (
          <div key={index}>
            <p>ตรวจสอบล่าสุด: {data.gr_time}</p>
          </div>
        ))}

        {/* Slider พร้อม marks */}
        <div style={{ marginTop: "30px", width: "100%" }}>
          <p>หน่วยกิตวิชาที่มีการสอนเป็นภาษาอังกฤษ: {fiCredits} หน่วยกิต</p>
          <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
              <LinearProgress
                variant="determinate"
                value={(fiCredits / sliderMax) * 100}
                sx={{
                  height: 10, // ความสูงของ LinearProgress
                  borderRadius: 5, // ความโค้งมุม
                  bgcolor: "#e0e0e0", // สีพื้นหลังของ Progress
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#4caf50", // สีของแถบ Progress
                  },
                }}
              />
            </Box>
            <Box minWidth={35}>
              <Typography variant="body2" color="textSecondary">
                {`${Math.round((fiCredits / sliderMax) * 100)}%`}
              </Typography>
            </Box>
          </Box>
        </div>
      </div>
    </center>
  );
};

export default Profile;
