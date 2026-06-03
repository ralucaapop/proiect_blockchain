import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../assets/css/Home.module.css";
import { isTokenValid, parseJwt } from "../service/AuthService.js";
import NavBar from "./NavBar.jsx";

function Home() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const role = token && isTokenValid(token) ? parseJwt(token).role : null;

    // Daca utilizatorul e deja logat, il redirectionam automat
    // Medicul → DoctorBoard
    // Pacientul → PatientDashboard (datele lui)
    useEffect(() => {
        if (role === "DOCTOR") {
            navigate("/doctor");
        } else if (role === "PATIENT") {
            navigate("/pacient/profil");
        }
    }, [role, navigate]);

    // Cat timp redirectionam nu afisam nimic
    if (role) return null;

    // Doar utilizatorii nelogati vad pagina de Home
    return (
        <div className={styles.appWrapper}>
            <NavBar />
            <div className={styles.page}>
                <header className={styles.header}>
                    <div className={styles.logo}>
                        <span className={styles.logoDot}></span>
                    </div>
                    <h1 className={styles.title}>
                        Dent<span className={styles.titleAccent}>help</span>
                    </h1>
                    <p className={styles.subtitle}>Gestionare medicală simplificată</p>
                </header>

                <main className={styles.center}>
                    <div className={styles.welcomeBlock}>
                        <h3>Bine ai venit</h3>
                        <p>Autentifică-te pentru a accesa platforma.</p>
                    </div>
                    <div className={styles.actions}>
                        <div className={styles.unauthMessage}>
                            <p>Autentifică-te pentru a începe.</p>
                            <a href="/login" className={styles.btnLogin}>
                                Autentificare
                            </a>
                        </div>
                    </div>
                </main>

                <footer className={styles.contact}>
                    <a href="mailto:contact@cabinet.ro">contact@cabinet.ro</a>
                    <span className={styles.divider}>·</span>
                    <a href="tel:+40123456789">+40 123 456 789</a>
                </footer>
            </div>
        </div>
    );
}

export default Home;
