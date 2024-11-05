import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "@/styles/Home.module.css";
import axios from "axios";

const Login = ({ onLogin }) => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [staffNames, setStaffNames] = useState([]);

  // Fetch staff names from the database on component mount
  useEffect(() => {
    const fetchStaffNames = async () => {
      try {
        const response = await axios.get("http://localhost:4000/officers");
        setStaffNames(response.data.map(officer => officer.of_id)); // Extract only of_id values
        console.log("staffNames", response.data.map(officer => officer.of_id)); // Log to confirm array values
      } catch (error) {
        console.error("Error fetching staff names:", error);
      }
    };
    fetchStaffNames();
  }, []);
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post("http://localhost:4000/auth/login", {
        username,
        password,
      });

      if (response && response.data) {
        const { api_status, api_message, userInfo } = response.data;

        if (api_status === "success") {

          if (userInfo.account_type === "students") {
            const studentPayload = {
              st_id: userInfo.username,
              st_name: userInfo.displayname,
              st_firstname_en: userInfo.firstname_en,
              st_lastname_en: userInfo.lastname_en,
              st_email: userInfo.email,
              st_account_type: userInfo.account_type,
            };
            await axios.post("http://localhost:4000/students", studentPayload);
            localStorage.clear(); 
            localStorage.setItem("st_id", userInfo.username);
            router.push("/Hello");
          } else if (staffNames.includes(userInfo.username)) {
            localStorage.clear(); 
          localStorage.setItem("of_id", userInfo.username);
          router.push("/HelloStaffs");
          }
          if (typeof onLogin === 'function') {
            onLogin(true, userInfo.account_type);
          } else {
            console.error("onLogin is not a function");
          }
        } else {
          setError(api_message);
        }
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Invalid username or password");
    }
  };

  return (
    <center>
      <div className={styles.Login}>
        <form onSubmit={onSubmit}>
          <label>ICIT Account</label>
          <br />
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <label>Password</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <Link
            href="https://account.kmutnb.ac.th/web/recovery/index"
            target="_blank"
            style={{ color: "#EB6725", fontWeight: "bold" }}
          >
            Forgot ICIT Account Password
          </Link>
          <br />
          <button type="submit">Sign in</button>
          {error && <p>{error}</p>}
        </form>
      </div>
    </center>
  );
};

export default Login;
