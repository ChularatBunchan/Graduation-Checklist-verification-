import styles from '@/styles/Headerbar.module.css';
import Link from 'next/link';
import { FaUserCircle } from "react-icons/fa";

const HeaderbarForlogin = ({ loggedIn }) => {
  return (
    <div>
      <div className={styles.headerbar}>
        <div className={styles.left_content}>
          <img src="/kmutnb.jpg" alt="Logo" />
          <p>ระบบตรวจสอบการจบการศึกษาโครงการพิเศษสองภาษา</p>
        </div>
        <div className={styles.right_content}>
          <div className={styles.profile}>
            {loggedIn ? (
              <FaUserCircle size={35} color='#07AA9F' />
            ) : (
              <Link href="/Login">
                <span>
                  <FaUserCircle size={35} color='#07AA9F' />
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderbarForlogin;
