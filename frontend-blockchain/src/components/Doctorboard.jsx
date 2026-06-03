import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar.jsx";
import styles from "../assets/css/DoctorBoard.module.css";

// Ruta: /doctor
// Prima pagina pe care o vede medicul dupa login.
// Doua carduri mari: Pacienti si Consultatii.

function DoctorBoard() {
    const navigate = useNavigate();

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
                    <p className={styles.subtitle}>Panou medic</p>
                </header>

                <main className={styles.center}>
                    <p className={styles.greeting}>Ce dorești să gestionezi astăzi?</p>

                    <div className={styles.cards}>

                        {/* Card 1 — Pacienti */}
                        <button
                            className={styles.card}
                            onClick={() => navigate("/doctor/pacienti")}
                        >
                            <div className={styles.cardIcon}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                                     stroke="currentColor" strokeWidth="1.5"
                                     strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                    <circle cx="9" cy="7" r="4"/>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                </svg>
                            </div>
                            <div className={styles.cardContent}>
                                <h2 className={styles.cardTitle}>Pacienți</h2>
                                <p className={styles.cardDesc}>
                                    Gestionează fișele, adaugă sau editează pacienți
                                </p>
                            </div>
                            <span className={styles.cardArrow}>→</span>
                        </button>

                        {/* Card 2 — Consultatii */}
                        <button
                            className={`${styles.card} ${styles.cardOutline}`}
                            onClick={() => navigate("/doctor/consultatii")}
                        >
                            <div className={styles.cardIcon}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                                     stroke="currentColor" strokeWidth="1.5"
                                     strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                    <line x1="16" y1="2" x2="16" y2="6"/>
                                    <line x1="8"  y1="2" x2="8"  y2="6"/>
                                    <line x1="3"  y1="10" x2="21" y2="10"/>
                                    <path d="M8 14h.01M12 14h.01M8 18h.01M12 18h.01"/>
                                </svg>
                            </div>
                            <div className={styles.cardContent}>
                                <h2 className={styles.cardTitle}>Consultații</h2>
                                <p className={styles.cardDesc}>
                                    Vezi toate consultațiile și adaugă unele noi
                                </p>
                            </div>
                            <span className={styles.cardArrow}>→</span>
                        </button>

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

export default DoctorBoard;