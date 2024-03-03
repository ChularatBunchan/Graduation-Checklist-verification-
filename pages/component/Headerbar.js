import styles from '@/styles/Headerbar.module.css';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { AiFillCalculator, AiOutlineMenu } from "react-icons/ai";
import { FaUserCircle, FaRegCheckCircle, FaRegFile } from "react-icons/fa";
import { CiCalculator2 } from "react-icons/ci";
import { FiLogOut } from "react-icons/fi";

const HeaderBar = () => {
  const showSidebar = () => {
    var sidebar = document.getElementById('sidebar2');
    console.log("click la woi");
    if (sidebar) {
      console.log("click la woi jing jing");
      sidebar.style.display = sidebar.style.display === 'none' ? 'flex' : 'none';
    }
  };

  const [profileInfo, setProfileInfo] = useState(null);
  const [isProfilePopupVisible, setIsProfilePopupVisible] = useState(false);

  const handleClickProfile = () => {
    if (profileInfo) {
      setIsProfilePopupVisible(!isProfilePopupVisible);
    } else {
      setProfileInfo({
        name: 'นายกิตติภพ กิจทรัพย์',
        email: 'kitipok.123@gmail.com'
      });
    }
  }

  useEffect(() => {
    if (profileInfo) {
      // alert(`ชื่อ: ${profileInfo.name}\nอีเมลล์: ${profileInfo.email}`);
    }
  }, [profileInfo]);

  return (
    <div>
      <div className={`${styles.headerbar}`}>
        <div className={`${styles.left_content}`}>
          <span onClick={showSidebar} style={{ color: "#EB6725", cursor: "pointer" }}>
            <AiOutlineMenu size={25} />
          </span>
          <img src="/kmutnb.jpg" alt="Logo" />
          <p>ระบบตรวจสอบการจบการศึกษาโครงการพิเศษสองภาษา</p>
        </div>
        <div className={`${styles.right_content}`}>
          <div className={`${styles.profile}`} onClick={handleClickProfile}>
            <FaUserCircle size={35} />
            {isProfilePopupVisible && <ProfileInfoPopup profileInfo={profileInfo} />}
          </div>
        </div>
      </div>

      <nav className={`${styles.sidebar}`} id='sidebar2'>
        <div className={`${styles.menucontent}`}>
          <ul className={`${styles.menuitem}`}>
            <li>
              <FaRegFile size={23} />
              <Link href="/Check" className={`${styles.item}`}> ตรวจสอบการจบการศึกษา</Link>
            </li>
            <li>
              <CiCalculator2 size={23} />
              <Link href="/Calculate" className={`${styles.item}`}> คำนวนเกรดเฉลี่ย</Link>
            </li>
            <li>
              <FaRegCheckCircle size={23} />
              <Link href="/StatusCheck" className={`${styles.item}`}> ตรวจสอบสถานะการจบการศึกษา</Link>
            </li>
            <li>
              <FiLogOut size={23} />
              <Link href="/Hello" className={`${styles.item}`}> ออกจากระบบ</Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default HeaderBar;
