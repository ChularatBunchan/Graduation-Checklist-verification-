import styles from '@/styles/Headerbar.module.css';
import Link from 'next/link';
import React, { useEffect } from 'react';

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
            <i style={{ fontSize: '24px' }} className="fas fa-bars "></i>
          </span>
          <img src="/kmutnb.jpg" alt="Logo" />
        </div>
        <div className={`${styles.right_content}`}>
          <Link href="/Profile">
            <div className={`${styles.button}`}>
            <i class="fa-solid fa-user"></i>
            </div>
          </Link>
        </div>
      </div>

      <nav className={`${styles.sidebar}`} id='sidebar2'>
        <div className={`${styles.menucontent}`}>
          <ul className={`${styles.menuitem}`}>
            <li>
              <i className="fas fa-file"></i>
              <Link href="#" className={`${styles.item}`}> ตรวจสอบการจบการศึกษา</Link>
            </li>
            <li>
              <i className="fas fa-calculator"></i>
              <Link href="#" className={`${styles.item}`}> คำนวนเกรดเฉลี่ย</Link>
            </li>
            <li>
              <i className="far fa-check-circle"></i>
              <Link href="#" className={`${styles.item}`}> ตรวจสอบสถานะการจบการศึกษา</Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default HeaderBar;
