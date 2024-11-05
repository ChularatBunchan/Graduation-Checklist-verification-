import React, { useState, useEffect } from 'react';
import styles from '@/styles/Headerbar.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AiOutlineMenu } from 'react-icons/ai';
import { FaUserCircle, FaRegCheckCircle } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { IoAddCircleOutline } from 'react-icons/io5';
import { GoPersonAdd } from "react-icons/go";
import { TbEdit } from 'react-icons/tb';
import axios from 'axios';

const HeaderbarOff = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
    const of_id = localStorage.getItem('of_id');
    if (!of_id) {
      debouncedPush('/Login');
      router.reload();
    }
  }, [router]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClickLogout = async () => {
    try {
      const of_id = localStorage.getItem('of_id');
      if (!of_id) {
        console.error('No of_id found in localStorage');
        router.push('/Login');
        router.reload();
        return;
      }

      localStorage.removeItem('of_id');
      setIsSidebarOpen(false);
      router.push('/Login');
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
      <div className={styles.headerbar}>
        <div className={styles.left_content}>
          <AiOutlineMenu
            size={25}
            style={{ color: '#EB6725', cursor: 'pointer' }}
            onClick={toggleSidebar}
          />
          <div onClick={() => router.push('/HelloStaff')} style={{cursor: 'pointer' }}>
            <img src="/kmutnb.jpg" alt="Logo" />
          </div>
          <p onClick={() => router.push('/HelloStaff')} style={{cursor: 'pointer' }}>
            ระบบตรวจสอบการจบการศึกษาโครงการพิเศษสองภาษา
          </p>
        </div>
        <div className={styles.right_content}>
          <FaUserCircle
            size={35}
          />
        </div>
      </div>

      <nav className={styles.sidebar} style={{ display: isSidebarOpen ? 'flex' : 'none' }}>
        <div className={styles.menucontent}>
          <ul className={styles.menuitem}>
            <li>
              <Link href="/AddSub" onClick={toggleSidebar}  style={{ textDecoration: 'none' }}>
                <IoAddCircleOutline size={23} className={styles.sidebaricon} />
                <span className={styles.sidebartext}>เพิ่มรายวิชา</span>
              </Link>
            </li>
            <li>
              <Link href="/EditSub" onClick={toggleSidebar}  style={{ textDecoration: 'none' }}>
                <TbEdit size={23} className={styles.sidebaricon} />
                <span className={styles.sidebartext}>แก้ไขรายวิชา</span>
              </Link>
            </li>
            <li>
              <Link href="/OffCheck" onClick={toggleSidebar}  style={{ textDecoration: 'none' }}>
                <FaRegCheckCircle size={23} className={styles.sidebaricon} />
                <span className={styles.sidebartext}>
                  ตรวจสอบสถานะการจบการศึกษา
                </span>
              </Link>
            </li>
            <li>
              <Link href="/AddStaffs" onClick={toggleSidebar}  style={{ textDecoration: 'none' }}>
                <GoPersonAdd size={23} className={styles.sidebaricon} />
                <span className={styles.sidebartext}>
                 เพิ่ม/แก้ไขเจ้าหน้าที่
                </span>
              </Link>
            </li>
            <li>
              <Link href="#" onClick={handleClickLogout}  style={{ textDecoration: 'none' }}>
                <FiLogOut size={23} className={styles.sidebaricon} />
                <span className={styles.sidebartext}>ออกจากระบบ</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default HeaderbarOff;
