import React from 'react'; 
import styles from '@/styles/Home.module.css';
import HeaderbarForlogin from "./HeaderbarForlogin";
import HeaderBar from './Headerbar';
import HeaderBarOff from '../Officer/HeaderbarOff';

// const Layout = ({ children }) => {
  const Layout = ({ children, loggedIn, accountType, onLogin, onLogout }) => {
  return (
    <>
      {!loggedIn ? (
        <HeaderbarForlogin />
      ) : accountType === 'students' ? (
        <HeaderBar onLogout={onLogout} onLogin={onLogin} />
      ) : accountType === 'personel' ? (
        <HeaderBarOff onLogout={onLogout} onLogin={onLogin} />

      ) : (
        <HeaderbarForlogin />
      )}

      <main className={styles.Mainn}>{children}</main>
      <footer className={styles.footer}>
        <h4>© 2021 Department of Computer and Information Sciences, Faculty of Applied Science (KMUTNB)</h4>
        <h4>ภาควิชาวิทยาการคอมพิวเตอร์และสารสนเทศ มจพ. กรุงเทพฯ</h4>
        <h4>s6304062616072@email.kmutnb.ac.th ,s6304062616188@email.kmutnb.ac.th</h4>

      </footer>
    </>
  );
};

export default Layout;


