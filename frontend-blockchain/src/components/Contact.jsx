import { useNavigate } from "react-router-dom";
import styles from "../assets/css/Contact.module.css";

function Contact() {
    const navigate = useNavigate();

    return (
        <div className={styles.appWrapper}>
            <div className={styles.page} id="contact">

                <button className={styles.backBtn} onClick={() => navigate("/")}>
                    ← Înapoi
                </button>

                <header className={styles.header}>
                    <div className={styles.logoDot}></div>
                    <h1 className={styles.title}>Contact</h1>
                    <p className={styles.subtitle}>Suntem aici pentru tine</p>
                </header>

                <main className={styles.grid}>
                    <div className={styles.infoBlock}>
                        <div className={styles.infoCard}>
                            <span className={styles.infoIcon}>✉</span>
                            <div>
                                <p className={styles.infoLabel}>Email</p>
                                <a href="mailto:contact@cabinet.ro" className={styles.infoValue}>
                                    contact@cabinet.ro
                                </a>
                            </div>
                        </div>
                        <div className={styles.infoCard}>
                            <span className={styles.infoIcon}>☎</span>
                            <div>
                                <p className={styles.infoLabel}>Telefon</p>
                                <a href="tel:+40123456789" className={styles.infoValue}>
                                    +40 123 456 789
                                </a>
                            </div>
                        </div>
                        <div className={styles.infoCard}>
                            <span className={styles.infoIcon}>◎</span>
                            <div>
                                <p className={styles.infoLabel}>Adresă</p>
                                <p className={styles.infoValue}>Str. Exemplu nr. 1, București</p>
                            </div>
                        </div>
                        <div className={styles.infoCard}>
                            <span className={styles.infoIcon}>◷</span>
                            <div>
                                <p className={styles.infoLabel}>Program</p>
                                <p className={styles.infoValue}>Luni – Vineri, 08:00 – 18:00</p>
                            </div>
                        </div>
                    </div>

                    <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Nume</label>
                                <input className={styles.input} placeholder="Ion Popescu" required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Email</label>
                                <input className={styles.input} type="email" placeholder="ion@email.ro" required />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Subiect</label>
                            <input className={styles.input} placeholder="Cum te putem ajuta?" required />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Mesaj</label>
                            <textarea
                                className={styles.textarea}
                                rows={3}
                                placeholder="Descrie pe scurt solicitarea ta..."
                                required
                            />
                        </div>
                        <button type="submit" className={styles.btnSubmit}>
                            <span>Trimite mesaj</span>
                            <span className={styles.btnArrow}>→</span>
                        </button>
                    </form>
                </main>

                <footer className={styles.footer}>
                    contact@cabinet.ro
                    <span className={styles.divider}>·</span>
                    +40 123 456 789
                </footer>
            </div>
        </div>
    );
}

export default Contact;