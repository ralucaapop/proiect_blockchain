import { useState, useEffect } from "react";
import NavBar from "./NavBar.jsx";
import api from "../api/axios.js";
import { parseJwt } from "../service/authService.jsx";
import styles from "../assets/css/PatientDashboard.module.css";

async function fetchPatientData(setPatient, setConsultations, setError, setLoading) {
    const token = localStorage.getItem("token");

    if (!token) {
        setError("Nu ești autentificat.");
        setLoading(false);
        return;
    }

    const decoded = parseJwt(token);
    const cnp = decoded?.cnp;

    if (!cnp) {
        setError("Token invalid.");
        setLoading(false);
        return;
    }

    try {
        const [patRes, consultRes] = await Promise.all([
            api.get(`/api/patient/${cnp}`),
            api.get(`/api/consult/patient/${cnp}`),
        ]);
        setPatient(patRes.data.data);
        setConsultations(consultRes.data.data || []);
    } catch {
        setError("Nu s-au putut încărca datele. Încearcă din nou.");
    } finally {
        setLoading(false);
    }
}

function PatientDashboard() {
    const [patient, setPatient] = useState(null);
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("personal");

    // useEffect apeleaza o functie externa — zero setState direct in effect
    useEffect(() => {
        fetchPatientData(setPatient, setConsultations, setError, setLoading);
    }, []);

    if (loading) return (
        <div className={styles.appWrapper}>
            <NavBar />
            <div className={styles.loading}>Se încarcă…</div>
        </div>
    );

    if (error) return (
        <div className={styles.appWrapper}>
            <NavBar />
            <div className={styles.page}>
                <div className={styles.errBox}>{error}</div>
            </div>
        </div>
    );

    return (
        <div className={styles.appWrapper}>
            <NavBar />
            <div className={styles.page}>

                <header className={styles.hero}>
                    <div className={styles.heroAvatar}>
                        {patient?.firstName?.[0]}{patient?.lastName?.[0]}
                    </div>
                    <div className={styles.heroInfo}>
                        <h1 className={styles.heroName}>
                            {patient?.firstName} {patient?.lastName}
                        </h1>
                        <p className={styles.heroCnp}>CNP: {patient?.CNP}</p>
                    </div>
                    <div className={styles.heroStats}>
                        <div className={styles.stat}>
                            <span className={styles.statNum}>{consultations.length}</span>
                            <span className={styles.statLabel}>Consultații</span>
                        </div>
                        {patient?.bloodGroupRh && (
                            <div className={styles.stat}>
                                <span className={styles.statNum}>{patient.bloodGroupRh}</span>
                                <span className={styles.statLabel}>Grupă sânge</span>
                            </div>
                        )}
                    </div>
                </header>

                <div className={styles.tabs}>
                    {[
                        { key: "personal",      label: "Date personale" },
                        { key: "medical",       label: "Date medicale" },
                        { key: "consultations", label: "Consultații", count: consultations.length },
                    ].map(t => (
                        <button
                            key={t.key}
                            className={`${styles.tab} ${activeTab === t.key ? styles.tabActive : ""}`}
                            onClick={() => setActiveTab(t.key)}
                        >
                            {t.label}
                            {t.count > 0 && (
                                <span className={styles.tabBadge}>{t.count}</span>
                            )}
                        </button>
                    ))}
                </div>

                <div className={styles.tabContent}>
                    {activeTab === "personal"      && <TabPersonal      patient={patient} />}
                    {activeTab === "medical"       && <TabMedical       patient={patient} />}
                    {activeTab === "consultations" && <TabConsultations consultations={consultations} />}
                </div>

            </div>
        </div>
    );
}

function TabPersonal({ patient }) {
    return (
        <div className={styles.card}>
            <p className={styles.readOnlyNote}>
                Datele tale sunt gestionate de medic. Contactează cabinetul pentru modificări.
            </p>
            <div className={styles.infoGrid}>
                <Info label="Prenume"       value={patient?.firstName} />
                <Info label="Nume"          value={patient?.lastName} />
                <Info label="CNP"           value={patient?.cnp} />
                <Info label="Data nașterii" value={patient?.dateOfBirth} />
                <Info label="Telefon"       value={patient?.phone} />
                <Info label="Email"         value={patient?.email} />
                <Info label="Adresă"        value={patient?.address} span={2} />
            </div>
        </div>
    );
}

function TabMedical({ patient }) {
    return (
        <div className={styles.card}>
            <p className={styles.readOnlyNote}>
                Datele medicale sunt completate și actualizate de medicul tău.
            </p>
            <div className={styles.infoGrid}>
                <Info label="Grupă sânge + RH" value={patient?.bloodGroupRh} />
                <Info
                    label="Înălțime / Greutate"
                    value={
                        patient?.height || patient?.weight
                            ? `${patient?.height ?? "—"} cm / ${patient?.weight ?? "—"} kg`
                            : null
                    }
                />
            </div>
            <MedBlock label="Alergii"           value={patient?.allergies} />
            <MedBlock label="Boli cronice"      value={patient?.chronicDiseases} />
            <MedBlock label="Medicație curentă" value={patient?.currentMedication} />
            <MedBlock label="Vaccinuri"         value={patient?.vaccines} />
            <MedBlock label="Istoric familial"  value={patient?.familyHistory} />
        </div>
    );
}

function TabConsultations({ consultations }) {
    if (consultations.length === 0) {
        return (
            <div className={styles.card}>
                <div className={styles.emptyConsult}>
                    <svg width="38" height="38" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="1"
                         strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8"  y1="2" x2="8"  y2="6"/>
                        <line x1="3"  y1="10" x2="21" y2="10"/>
                    </svg>
                    <p>Nicio consultație înregistrată încă.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.consultList}>
            {consultations.map((c, i) => (
                <div key={i} className={styles.consultCard}>
                    <div className={styles.consultHead}>
                        <span className={styles.consultDate}>{c.data ?? c.date ?? "—"}</span>
                        <span className={styles.consultDiag}>{c.diagnostic ?? "—"}</span>
                    </div>
                    <div className={styles.consultBody}>
                        <div>
                            <span className={styles.consultLabel}>Simptome</span>
                            <p>{c.simptome ?? "—"}</p>
                        </div>
                        <div>
                            <span className={styles.consultLabel}>Tratament</span>
                            <p>{c.tratament ?? "—"}</p>
                        </div>
                        {c.alteDetalii && (
                            <div style={{ gridColumn: "1/-1" }}>
                                <span className={styles.consultLabel}>Alte detalii</span>
                                <p>{c.alteDetalii}</p>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

function Info({ label, value, span }) {
    return (
        <div className={styles.infoItem} style={span ? { gridColumn: `span ${span}` } : {}}>
            <span className={styles.infoLabel}>{label}</span>
            <p className={styles.infoValue}>{value || "—"}</p>
        </div>
    );
}

function MedBlock({ label, value }) {
    if (!value) return null;
    return (
        <div className={styles.medBlock}>
            <span className={styles.infoLabel}>{label}</span>
            <p className={styles.medText}>{value}</p>
        </div>
    );
}

export default PatientDashboard;
