import HeaderBar from "./Headerbar";
import styles from '@/styles/Home.module.css';
import { FaLocationDot, FaPhone } from "react-icons/fa6";
import HeaderbarForlogin from "./HeaderbarForlogin";

const Layout = ({ children }) => {
    return (
        <div>
            <HeaderBar />
            <main className={`${styles.Mainn}`}>{children}</main>
            <footer className={`${styles.footer}`}>
                <h4>© 2021 Department of Computer and Information Sciences,Faculty of Applied Science (KMUTNB)</h4>

                <h4><FaLocationDot /> ภาควิชาวิทยาการคอมพิวเตอร์และสารสนเทศ มจพ. กรุงเทพฯ</h4>

                <h4><FaPhone /> 02-555-2000 ต่อ 4601, 4602</h4>

            </footer>
        </div>
    )
}
export default Layout;