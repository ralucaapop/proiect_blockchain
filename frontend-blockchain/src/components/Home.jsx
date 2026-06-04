import { useNavigate } from "react-router-dom";
import styles from "../assets/css/Home.module.css";
import { isTokenValid, parseJwt } from "../service/AuthService";
import NavBar from "./NavBar.jsx";

function Home() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const role = token && isTokenValid(token) ? parseJwt(token).role : null;

    return (
        <div className={styles.appWrapper}>
            <NavBar />

            <div className={styles.page}>
                <header className={styles.header}>
                    <div className={styles.logo}>
                        <span className={styles.logoDot}></span>
                    </div>
                    <h1 className={styles.title}>
                        Smart<span className={styles.titleAccent}>Care</span>
                    </h1>
                    <p className={styles.subtitle}>Gestionare medicală simplificată</p>
                </header>

                <main className={styles.center}>
                    <div className={styles.welcomeBlock}>
                        <h3>Bine ai venit</h3>
                        <p>Accesează rapid instrumentele tale de lucru.</p>
                    </div>

                    <div className={styles.actions}>
                        {role === "PATIENT" && (
                            <button
                                className={styles.btnPrimary}
                                onClick={() => navigate("/pacient/profil")}
                            >
                                <span>Profilul meu</span>
                                <span className={styles.btnArrow}>→</span>
                            </button>
                        )}

                        {role === "DOCTOR" && (
                            <>
                                <button
                                    className={styles.btnPrimary}
                                    onClick={() => navigate("/doctor/consultatii")}
                                >
                                    <span>Vezi Consultații</span>
                                    <span className={styles.btnArrow}>→</span>
                                </button>
                                <button
                                    className={styles.btnSecondary}
                                    onClick={() => navigate("/doctor/pacienti")}
                                >
                                    <span>Lista Pacienți</span>
                                    <span className={styles.btnArrow}>→</span>
                                </button>
                            </>
                        )}

                        {!role && (
                            <div className={styles.unauthMessage}>
                                <p>Platformă dedicată gestionării pacienților și consultațiilor medicale.</p>
                                <div className={styles.tagline}>
                                    Sănătatea ta, prioritatea noastră!
                                </div>
                            </div>
                        )}
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