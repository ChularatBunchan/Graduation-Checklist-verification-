import styles from '@/styles/Headerbar.module.css';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { AiFillCalculator, AiOutlineMenu } from "react-icons/ai";
import { FaUserCircle, FaRegCheckCircle, FaRegFile } from "react-icons/fa";
import { CiCalculator2 } from "react-icons/ci";
import { FiLogOut } from "react-icons/fi";

const HeaderbarForlogin = () => {
  return (
    <div>
      <div className={`${styles.headerbar}`}>
        <div className={`${styles.left_content}`}>
          <img src="/kmutnb.jpg" alt="Logo" />
          <p>ระบบตรวจสอบการจบการศึกษาโครงการพิเศษสองภาษา</p>
        </div>
        <div className={`${styles.right_content}`}>
          <div className={`${styles.profile}`}>
            <Link href="/Login" style={{display:"flex", alignItems:"center" ,gap:'.5rem'}}>
            <FaUserCircle size={35} color='#07AA9F' />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderbarForlogin;
