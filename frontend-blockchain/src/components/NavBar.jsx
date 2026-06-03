import styles from '../assets/css/NavBar.module.css';
import { isTokenValid } from "../service/AuthService.js";

const Navbar = () => {
    const isAuthenticated = localStorage.getItem('token') && isTokenValid(localStorage.getItem('token'));

    return (
        <nav className={styles.navbar}>
            <a href="/" className={styles.brand}>Denthelp</a>

            <div className={styles.navLinks}>
                {isAuthenticated ? (
                    <button onClick={() => window.location.href = '/#menu'}>
                        Meniu
                    </button>
                ) : (
                    <a href="/login" className={styles.navCta}>
                        Autentificare
                    </a>
                )}
                <a href="/Contact">Contact</a>
            </div>
        </nav>
    );
};

export default Navbar;
