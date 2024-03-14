import styles from '@/styles/Headerbar.module.css';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { AiOutlineMenu } from "react-icons/ai";
import { FaCircleCheck } from "react-icons/fa6";
import { FaUserCircle ,FaRegCheckCircle  } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { IoAddCircleOutline } from "react-icons/io5";
import { TbEdit } from "react-icons/tb";

const HeaderBarOff = () => {
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
              <IoAddCircleOutline size={23} />
              <Link href="/AddSub" className={`${styles.item}`}> เพิ่มรายวิชา</Link>
            </li>
            <li>
              <TbEdit   size={23} />
              <Link href="/EditSub" className={`${styles.item}`}> แก้ไขรายวิชา</Link>
            </li>
            <li>
              <FaRegCheckCircle  size={23} />
              <Link href="/OffCheck" className={`${styles.item}`}> ตรวจสอบสถานะการจบการศึกษา</Link>
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

export default HeaderBarOff;
