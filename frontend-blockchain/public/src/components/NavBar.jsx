import styles from '../assets/css/NavBar.module.css';
import {isTokenValid} from "../service/AuthService.jsx";
import {useNavigate} from "react-router-dom";


const Navbar = () => {

    const navigate = useNavigate();
    const isAuthenticated = () => {
        const token = localStorage.getItem('token');
        return token && isTokenValid(token);
    };

    const goToHomeSection = (sectionId) => {
        navigate(`/#${sectionId}`);
    };


    return (
        <nav className={styles["navbar"]}>
            <div className={styles["navLinks"]}>
                {isAuthenticated() ? (
                    <>
                        <button onClick={() => goToHomeSection("options-section")} className={styles["menu-btn"]}>Meniu</button>
                    </>
                ) : (
                    <>
                        <a href="/login" className={styles["history"]}>Autentificare</a>
                    </>
                )}
                <button onClick={() => goToHomeSection('contact')} className={styles["contact"]}>Contact</button>
            </div>
        </nav>
    );

};

export default Navbar;