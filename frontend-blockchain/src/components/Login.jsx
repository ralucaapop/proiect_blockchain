import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { parseJwt } from "../service/authService.jsx";
import { Box, Modal } from '@mui/material';
import styles from "../assets/css/login.module.css";
import axios from "axios";

const Login = () => {
    const [cnp, setCNP] = useState('');
    const [password, setPassword] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorTitle, setErrorTitle] = useState("");
    const [errorText, setErrorText] = useState("");
    const navigator = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                cnp: cnp,
                password: password
            });

            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                const decodedToken = parseJwt(response.data.token);
                const role = decodedToken.role;
                if (role === "DOCTOR") {
                    navigator('/doctor');
                } else if (role === "PATIENT") {
                    navigator('/pacient/profil');
                } else {
                    setErrorTitle("Eroare de rol");
                    setErrorText("Rolul utilizatorului nu este recunoscut.");
                    setShowErrorModal(true);
                }
            }
        } catch (error) {
            if (error.response) {
                const msg = error.response.data.message;
                if (msg === "Wrong password") {
                    setErrorTitle("Parolă greșită");
                    setErrorText("Parola pe care ați introdus-o este greșită! Încercați din nou.");
                } else if (msg === "The email is not registered") {
                    setErrorTitle("CNP neînregistrat");
                    setErrorText("CNP-ul pe care l-ați introdus nu este asociat unui cont.");
                } else {
                    setErrorTitle("Eroare");
                    setErrorText("Eroare la autentificare. Verificați datele.");
                }
            } else {
                setErrorTitle("Eroare de conexiune");
                setErrorText("Nu s-a primit niciun răspuns de la server. Verificați conexiunea.");
            }
            setShowErrorModal(true);
        }
    };

    return (
        <div className={styles.page}>

            {/* Buton înapoi — pozitionat absolut sus stanga */}
            <button className={styles.backBtn} onClick={() => navigator('/')}>
                ← Înapoi
            </button>

            <div className={styles.card}>
                <div className={styles["card-container"]}>
                    <div className={styles.brandMark}>
                        <span className={styles.brandDot}></span>
                        <span className={styles.brandName}>
                            Smart<span className={styles.brandAccent}>Care</span>
                        </span>
                    </div>
                    <p className={styles.helloMsg}>Bine ai venit!</p>
                    <form className={styles.loginForm} onSubmit={handleSubmit}>
                        <input
                            placeholder="CNP"
                            required
                            value={cnp}
                            onChange={(e) => setCNP(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Parolă"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit" className={styles.submit}>
                            Conectează-te
                        </button>
                    </form>
                </div>
            </div>

            <Modal open={showErrorModal} onClose={() => setShowErrorModal(false)}>
                <Box className={styles.box}>
                    <h2 className={styles.changeRolT}>{errorTitle}</h2>
                    <p className={styles.text}>{errorText}</p>
                    <button className={styles.modalClose} onClick={() => setShowErrorModal(false)}>
                        Închide
                    </button>
                </Box>
            </Modal>
        </div>
    );
};

export default Login;