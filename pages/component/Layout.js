import React from 'react'; 
import styles from '@/styles/Home.module.css';
import HeaderbarForlogin from "./HeaderbarForlogin";
import HeaderBar from './Headerbar';
import HeaderBarOff from '../Officer/HeaderbarOff';

const Layout = ({ children }) => {
  // const Layout = ({ children, loggedIn, accountType, onLogin, onLogout }) => {
  return (
    <>
      {/* {accountType === 'students' ? (
        <HeaderBar onLogout={onLogout} onLogin={onLogin} />
      ) : accountType === 'officers' ? (
        <HeaderBarOff onLogout={onLogout} onLogin={onLogin} />
      ) : (
        <HeaderbarForlogin />
      )} */}
      <HeaderBarOff />
      <main className={styles.Mainn}>{children}</main>
      <footer className={styles.footer}>
        <h4>© 2021 Department of Computer and Information Sciences, Faculty of Applied Science (KMUTNB)</h4>
        <h4>ภาควิชาวิทยาการคอมพิวเตอร์และสารสนเทศ มจพ. กรุงเทพฯ</h4>
        <h4>02-555-2000 ต่อ 4601, 4602</h4>
      </footer>
    </>
  );
};

export default Layout;
