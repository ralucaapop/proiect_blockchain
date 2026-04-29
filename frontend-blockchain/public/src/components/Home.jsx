import {useLocation, useNavigate} from "react-router-dom";
import styles from "../assets/css/Home.module.css";
import stylesCard from "../assets/css/Card.module.css";

import { isTokenValid, parseJwt } from "../service/AuthService.jsx";
import {useEffect} from "react";
import NavBar from "./NavBar.jsx";

function Home() {
    const navigate = useNavigate();
    const getUserRole = () => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = parseJwt(token);
            return decodedToken.role;
        }
        return null;
    };
    const userRole = getUserRole();

    const location = useLocation();
    const isAuthenticated = () => {
        const token = localStorage.getItem('token');
        return token && isTokenValid(token);
    };



    const handleRequestAppointment = () => {
        if (isAuthenticated()) {
            navigate("/GeneralPatientBoard/request");
        }
        else{
            alert("Pentru a putea acsesa aceasta sectiune trebuie sa fiti autentificat")
        }
    };

    const handleAppointments = () => {
        if (isAuthenticated()){
            navigate("/GeneralAdminBoard/appointments");
        } else{
            alert("Pentru a putea acsesa aceasta sectiune trebuie sa fiti autentificat")
        }

    };
    const handlePatients = () => {
        if (isAuthenticated()){
            navigate("/GeneralAdminBoard/patients");
        }
        else{
            alert("Pentru a putea acsesa aceasta sectiune trebuie sa fiti autentificat")
        }
    };


    // Derulăm automat la secțiunea specificată în hash când componenta este montată
    useEffect(() => {
        if (location.hash) {
            const sectionId = location.hash.replace('#', '');
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location]);

    return (
        <div className={styles.page}>
            <NavBar/>
            <div className={styles["content-container"]}>
                <div className={styles["text-content"]}>
                    <h1 className={styles.title}>DENTHELP</h1>
                </div>
            </div>

            {/* Afișăm cardurile doar pentru utilizator neautentificat sau pacient */}
            {(userRole === "PATIENT") && (
                <div className={styles.section} id="options-section">
                    <h2 className={styles["title-options"]}>Opțiunile Tale</h2>
                    <p className={styles["intro-options"]}>
                        Bun venit la secțiunea „Opțiunile Tale”! Aici vei găsi tot ce ai nevoie pentru a gestiona
                        programările tale, a accesa istoricul medical și a administra informațiile personale.
                        Explorează funcționalitățile noastre și alege ce ți se potrivește cel mai bine!
                    </p>

                    <div className={stylesCard.cards}>
                        <div className={stylesCard.card} onClick={handleRequestAppointment}>
                            <h3 className={stylesCard["card-title"]}>Cere o programare</h3>
                            <p className={stylesCard["card-description"]}>Rezervați o întâlnire rapidă și ușor.</p>
                        </div>



                    </div>
                </div>
            )}

            {/* Afișăm conținutul pentru admin */}
            {userRole === "DOCTOR" && (
                <div className={styles.section} id="options-section">
                    <h2 className={styles["title-options"]}>Opțiunile Tale</h2>
                    <p className={styles["intro-options"]}>
                        Bun venit la secțiunea „Opțiunile Tale”! Aici vei găsi tot ce ai nevoie pentru a gestiona
                        programările pacientilor, si monitorizarea acestora.
                    </p>
                    <div id="options-section" className={stylesCard.cards}>
                        <div className={stylesCard.card} onClick={handleAppointments}>
                            <h3 className={stylesCard["card-title"]}>Consultatii</h3>
                            <p className={stylesCard["card-description"]}>Consultatii</p>
                        </div>

                        <div className={stylesCard.card} onClick={handlePatients}>
                            <h3 className={stylesCard["card-title"]}>Pacienți</h3>
                            <p className={stylesCard["card-description"]}>Informații despre pacienții tăi</p>
                        </div>
                    </div>
                </div>
            )}

            <div id="contact" className={styles["contact-section"]}>
                <h2 className={styles["contact-title"]}>Contactați-ne</h2>
                <p className={styles["contact-description"]}>
                    Suntem aici să vă răspundem la întrebări și să vă ajutăm cu orice informații de care aveți nevoie.
                    Nu ezitați să ne contactați folosind datele de mai jos.
                </p>

                <div className={styles["contact-info"]}>
                    <div className={styles["contact-item"]}>
                        <h3 className={styles["contact-item-title"]}>Adresă:</h3>
                        <p className={styles["contact-item-text"]}>Strada Exemplu, Nr. 10, București, România</p>
                    </div>
                    <div className={styles["contact-item"]}>
                        <h3 className={styles["contact-item-title"]}>Telefon:</h3>
                        <p className={styles["contact-item-text"]}>+40 123 456 789</p>
                    </div>
                    <div className={styles["contact-item"]}>
                        <h3 className={styles["contact-item-title"]}>Email:</h3>
                        <p className={styles["contact-item-text"]}>contact@cabinet.ro</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;