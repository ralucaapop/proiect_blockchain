import { useNavigate, useLocation } from "react-router-dom";
import styles from '../assets/css/NavBar.module.css';
import { isTokenValid, parseJwt } from "../service/authService.jsx";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');
    const isAuthenticated = token && isTokenValid(token);
    const role = isAuthenticated ? parseJwt(token)?.role : null;

    const isHome = location.pathname === "/";
    const isDoctorHome = location.pathname === "/doctor";
    const isPatientPage = location.pathname.startsWith("/pacient");

    function logout() {
        localStorage.removeItem('token');
        navigate('/');
    }

    return (
        <nav className={styles.navbar}>
            <a href="/" className={styles.brand}>SmartCare</a>

            <div className={styles.navLinks}>
                {isAuthenticated && !isHome ? (
                    <>
                        {role === "DOCTOR" && !isDoctorHome && !isPatientPage && (
                            <button onClick={() => navigate('/doctor')}>
                                Panou medic
                            </button>
                        )}
                        {role === "PATIENT" && !isPatientPage && (
                            <button onClick={() => navigate('/pacient/profil')}>
                                Profilul meu
                            </button>
                        )}
                        <button onClick={logout} className={styles.navLogout}>
                            Deconectare
                        </button>
                    </>
                ) : !isAuthenticated && (
                    <a href="/login" className={styles.navCta}>
                        Autentificare
                    </a>
                )}
                {!location.pathname.startsWith("/doctor") && !isPatientPage && (
                    <a href="/Contact">Contact</a>
                )}
            </div>
        </nav>
    );
};

export default Navbar;