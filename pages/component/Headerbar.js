import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "@/styles/Headerbar.module.css";
import { FaUserCircle, FaRegCheckCircle, FaRegFile } from "react-icons/fa";
import { CiCalculator2 } from "react-icons/ci";
import { FiLogOut } from "react-icons/fi";
import { AiOutlineMenu } from "react-icons/ai";
import { MdCloudUpload , MdOutlineCloudUpload} from "react-icons/md";
import axios from "axios";

const Headerbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [username, setUsername] = useState(null);
  const router = useRouter();

  const debounce = (func, delay) => {
    let debounceTimer;
    return (...args) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func(...args), delay);
    };
  };
  const debouncedPush = debounce((path) => router.push(path), 1000);  

  useEffect(() => {
    const st_id = localStorage.getItem("st_id");
    if (!st_id) {
      debouncedPush('/Login');
    }
    const modified_st_id =
      st_id && st_id.startsWith("s") ? st_id.substring(1) : st_id;
    // console.log("modified code: ", modified_st_id);

    // Set the username based on st_id
    setUsername(modified_st_id);

    // console.log("Username from localStorage:", modified_st_id); // Log for debugging
  }, [router]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClickHome = () => {
    router.push("/Hello");
  };

  const handleClickProfile = () => {
    router.push("/Profile");
  };

  const handleClickLogout = async () => {
    try {
      const st_id = localStorage.getItem("st_id");
      if (!st_id) {
        console.error("No st_id found in localStorage");
        router.push("/Login");
        router.reload();
        return;
      }

      await axios.delete(`http://localhost:4000/students/${st_id}`);
      localStorage.removeItem("st_id");
      setIsSidebarOpen(false);
      router.push("/Login");
      router.reload();
    } catch (error) {
      console.error(
        "Logout error:",
        error.response ? error.response.data : error.message
      );
      alert("Error logging out or deleting user. Please try again.");
    }
  };

  return (
    <div>
      <div className={`${styles.headerbar}`}>
        <div className={`${styles.left_content}`}>
          <span
            onClick={toggleSidebar}
            style={{ color: "#EB6725", cursor: "pointer", cursor: "pointer" }}
          >
            <AiOutlineMenu size={25} />
          </span>
          <div onClick={handleClickHome}
          style={{ color: "#EB6725", cursor: "pointer", cursor: "pointer" }}
          >
            <img src="/kmutnb.jpg" alt="Logo" />
          </div>
          <p onClick={handleClickHome}>
            ระบบตรวจสอบการจบการศึกษาโครงการพิเศษสองภาษา
          </p>
        </div>
        <div className={`${styles.right_content}`}>
          <div className={`${styles.profile}`} onClick={handleClickProfile}>
            <FaUserCircle size={35} />
          </div>
        </div>
      </div>

      <nav
        className={`${styles.sidebar}`}
        style={{ display: isSidebarOpen ? "flex" : "none" }}
      >
        <div className={`${styles.menucontent}`}>
          <ul className={`${styles.menuitem}`}>
            <li>
              <Link
                href="/Check"
                className={`${styles.item}`}
                onClick={toggleSidebar}
              >
                <MdOutlineCloudUpload size={23} className={`${styles.sidebaricon}`} />
                <span className={`${styles.sidebartext}`}>
                  ตรวจสอบการจบการศึกษา
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/Calculate"
                className={`${styles.item}`}
                onClick={toggleSidebar}
              >
                <CiCalculator2 size={23} className={`${styles.sidebaricon}`} />
                <span className={`${styles.sidebartext}`}>คำนวนเกรดเฉลี่ย</span>
              </Link>
            </li>
            <li>
              <Link
                href="/CheckStatus"
                className={`${styles.item}`}
                onClick={toggleSidebar}
              >
                <FaRegCheckCircle
                  size={23}
                  className={`${styles.sidebaricon}`}
                />
                <span className={`${styles.sidebartext}`}>
                  ตรวจสอบสถานะการจบการศึกษา
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className={`${styles.item}`}
                onClick={handleClickLogout}
              >
                <FiLogOut size={23} className={`${styles.sidebaricon}`} />
                <span className={`${styles.sidebartext}`}>ออกจากระบบ</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Headerbar;
