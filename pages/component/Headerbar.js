import styles from '@/styles/Headerbar.module.css';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { AiFillCalculator ,AiOutlineMenu } from "react-icons/ai";
import { FaFile , FaCircleCheck } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
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

  return (
    <div>
      <div className={`${styles.headerbar}`}>
        <div className={`${styles.left_content}`}>
          <span onClick={showSidebar} style={{ color: "#EB6725", cursor: "pointer" }}>
          <AiOutlineMenu  size={25} />
          </span>
          <img src="/kmutnb.jpg" alt="Logo" />
          <p>ระบบตรวจสอบการจบการศึกษาโครงการพิเศษสองภาษา</p>
        </div>
        <div className={`${styles.right_content}`}>
          <Link href="Profile">
            <div className={`${styles.profile}`}>
              <FaUserCircle size={35} />
            </div>
            
          </Link>
        </div>
      </div>

      <nav className={`${styles.sidebar}`} id='sidebar2'>
        <div className={`${styles.menucontent}`}>
          <ul className={`${styles.menuitem}`}>
            <li>
              <FaFile size={23} />
              <Link href="Check" className={`${styles.item}`}> ตรวจสอบการจบการศึกษา</Link>
            </li>
            <li>
              <AiFillCalculator  size={23} />
              <Link href="Calculate" className={`${styles.item}`}> คำนวนเกรดเฉลี่ย</Link>
            </li>
            <li>
              <FaCircleCheck size={23} />
              <Link href="#" className={`${styles.item}`}> ตรวจสอบสถานะการจบการศึกษา</Link>
            </li>
            <li>
              <FiLogOut size={23} />
              <Link href="#" className={`${styles.item}`}> ออกจากระบบ</Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default HeaderBar;
