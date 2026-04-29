import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { parseJwt } from "../service/AuthService.jsx";
import {Box, Dialog, Modal, TextField} from '@mui/material';
import styles from "../assets/css/login.module.css"

const Login = () => {
    const [cnp, setCNP] = useState('');
    const [password, setPassword] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorTitle, setErrorTitle] = useState("");
    const [errorText, setErrorText] = useState("");
    const navigator = useNavigate();

    const baseUrl = "http://localhost:8080";

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(baseUrl+'/api/auth/login', {
                cnp: cnp,
                password: password
            });

            if (response.status === 200) {
                const token = response.data.token;
                localStorage.setItem('token', token);
                const decodedToken = parseJwt(token);
                const role = decodedToken.role;
                console.log(token)
                if (role === "DOCTOR") {
                    navigator('/Home');
                } else if (role === "PATIENT") {
                    navigator("/Home");
                }else {
                    alert('Rol necunoscut.');
                }
            }
        } catch (error) {
            if (error.response) {
                if(error.response.data.message=="Wrong password"){
                    setShowErrorModal(true);
                    setErrorText("Parola pe care ați introdus-o este gresită! Încercați iar.");
                    setErrorTitle("Parolă greșită");
                }
                else if(error.response.data.message=="The email is not registered"){
                    setShowErrorModal(true);
                    setErrorText("CNP=-ul pe care l-ați introdus nu este asociat unui cont.");
                    setErrorTitle("CNP neînregistrat");
                }
            } else if (error.request) {
                setShowErrorModal(true);
                setErrorText("Eroare de autentificare: Nu s-a primit niciun răspuns de la server.");
                setErrorTitle("Eroare");
            } else {
                setShowErrorModal(true);
                setErrorText('Eroare de autentificare: ' + error.message);
                setErrorTitle("Eroare");
            }
        }
    };



    const handleCloseErrorModal = () => setShowErrorModal(false);


    return (
        <div className={styles["page"]}>
            <div className={styles.card}>
                <div className={styles["card-container"]}>
                    <h1 className={styles.helloMsg}>BINE AȚI REVENIT</h1>
                    <form  className={styles.loginForm} onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                placeholder="cnp"
                                required
                                id="cnp-input"
                                value={cnp}
                                onChange={(e) => setCNP(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="parola"
                                required
                                id="register-password-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" className={styles["submit"]}>Conectează-te</button>
                    </form>
                </div>
            </div>

            <Modal open={showErrorModal} onClose={handleCloseErrorModal}>
                <Box className={styles.box}>
                    <h2 className={styles.changeRolT}>{errorTitle}</h2>
                    <p className={styles.text}>{errorText}
                    </p>
                </Box>
            </Modal>
        </div>
    );
};

export default Login;