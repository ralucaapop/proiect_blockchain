import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { loginUser, parseJwt } from "../service/AuthService";
import { Box, Modal } from '@mui/material';
import styles from "../assets/css/login.module.css";

// redirectionam in functie de rol:
//   DOCTOR  → /doctor        (DoctorBoard)
//   PATIENT → /pacient/profil (PatientDashboard)

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
            const response = await loginUser(cnp, password);
            const token = response.data.token;
            localStorage.setItem('token', token);

            const decodedToken = parseJwt(token);
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
            <div className={styles.card}>
                <div className={styles["card-container"]}>
                    <div className={styles.brandMark}>
                        <span className={styles.brandDot}></span>
                        <span className={styles.brandName}>
                            Dent<span className={styles.brandAccent}>help</span>
                        </span>
                    </div>
                    <p className={styles.helloMsg}>Bine ați revenit</p>
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