import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "@/styles/Home.module.css";
import { Button } from "@material-tailwind/react";
import axios from "axios";
import { setCookie } from 'nookies';

const Login = () => {
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
      let playload = {
        username: response.data.userInfo.username,
        displayname: response.data.userInfo.displayname,
        email: response.data.userInfo.email,
        account_type: response.data.userInfo.account_type,
      };
      const res = await axios.post("http://localhost:4000/students", playload);
      //console.log("student:", res.data);
      //console.log("student:", res.data.username);
      router.push("/Hello");

      setCookie(null, "username", res.data.username, {
        maxAge: 30 * 24 * 60 * 60, 
        path: "/", 
      });
      //   if (response.data.userInfo.account_type=="student")
      //   {
      //     router.push("/Hello");
      //   }
      //   else if (response.data.userInfo.account_type=="personel")
      //   {
      //     router.push("/AddSub");
      //   }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Invalid username or password");
    }
  };

  return (
    <center>
      <div className={`${styles.Login}`}>
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
          <Link href="https://account.kmutnb.ac.th/web/recovery/index" target="_blank" style={{color:"#EB6725", fontWeight:"bold"}}>
          Forgot ICIT Account Password
          </Link>{" "}
          <br />
          <Button type="submit">Sign in</Button>
          {error && <p>{error}</p>}
        </form>
      </div>
    </center>
  );
};

export default Login;