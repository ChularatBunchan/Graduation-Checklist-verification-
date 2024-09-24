import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "@/styles/Home.module.css";
import axios from "axios";

const Login = ({ onLogin }) => {  // Accept onLogin as a prop
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
          console.log("Login successful:", userInfo);

          const payload = {
            st_id: userInfo.username,
            st_name: userInfo.displayname,
            st_firstname_en: userInfo.firstname_en,
            st_lastname_en: userInfo.lastname_en,
            st_email: userInfo.email,
            st_account_type: userInfo.account_type,
            st_status: true, // Assuming status is true when login is successful
          };

          await axios.post("http://localhost:4000/students", payload);

          // Notify the parent component of login and pass account type
          onLogin(true, userInfo.account_type);  // Call onLogin with parameters

          router.push("/Hello");
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
