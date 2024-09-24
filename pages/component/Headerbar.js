import { useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/Headerbar.module.css";
import Link from "next/link";
import { Button } from "@material-tailwind/react";
import { FaUserCircle, FaRegCheckCircle, FaRegFile } from "react-icons/fa";
import { CiCalculator2 } from "react-icons/ci";
import { FiLogOut } from "react-icons/fi";
import { IoPersonOutline } from "react-icons/io5";
import { AiOutlineMenu } from "react-icons/ai";
import Cookies from "js-cookie";
import axios from "axios";
import { parseCookies } from "nookies";

const HeaderBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfilePopupVisible, setIsProfilePopupVisible] = useState(false); // Add this state

  const router = useRouter();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLinkClick = () => {
    setIsSidebarOpen(false);
  };

  const handleClickProfile = () => {
    router.push("/Profile");
  };

  const handleClickHome = () => {
    router.push("/Hello");
  };

  const getCookieValue = (cookies, name) => {
    return cookies[name];
  };

  const handleClickLogout = async () => {
    const cookies = parseCookies();
    const username = getCookieValue(cookies, "username");
  
    console.log("Cookies:", cookies);
    console.log("Username from cookie:", username);
  
    if (!username) {
      console.error("No username found in cookies");
      return;
    }
  
    try {
      await axios.delete(`http://localhost:4000/students/${username}`);
      Cookies.remove("username");
      setIsSidebarOpen(false);
      router.push("/Login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  

  return (
    <div>
      <div className={`${styles.headerbar}`}>
        <div className={`${styles.left_content}`}>
          <span
            onClick={toggleSidebar}
            style={{ color: "#EB6725", cursor: "pointer" }}
          >
            <AiOutlineMenu size={25} />
          </span>
          <div onClick={handleClickHome}>
            <img src="/kmutnb.jpg" alt="Logo" />
          </div>
          <p onClick={handleClickHome}>
            ระบบตรวจสอบการจบการศึกษาโครงการพิเศษสองภาษา
          </p>
        </div>
        <div className={`${styles.right_content}`}>
          <div className={`${styles.profile}`} onClick={handleClickProfile}>
            <FaUserCircle size={35} />
            {isProfilePopupVisible && (
              <ProfileInfoPopup profileInfo={profileInfo} />
            )}
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
                onClick={handleLinkClick}
              >
                <FaRegFile size={23} className={`${styles.sidebaricon}`} />
                <span className={`${styles.sidebartext}`}>
                  ตรวจสอบการจบการศึกษา
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/Calculate"
                className={`${styles.item}`}
                onClick={handleLinkClick}
              >
                <CiCalculator2 size={23} className={`${styles.sidebaricon}`} />
                <span className={`${styles.sidebartext}`}>คำนวนเกรดเฉลี่ย</span>
              </Link>
            </li>
            <li>
              <Link
                href="/CheckStatus"
                className={`${styles.item}`}
                onClick={handleLinkClick}
              >
                <FaRegCheckCircle size={23} className={`${styles.sidebaricon}`} />
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

export default HeaderBar;
