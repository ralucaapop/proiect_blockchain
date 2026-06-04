import { useState, useEffect } from "react";
import NavBar from "./NavBar.jsx";
import api from "../api/axios.js";
import styles from "../assets/css/AppointmentsPage.module.css";

// FIX 3: nu mai incarcam consultatiile la mount — asteptam ca userul sa apese Filtreaza
// Asta elimina pop-up-ul de eroare la intrarea pe pagina

function AppointmentsPage() {
    const [consultations, setConsultations] = useState([]);
    const [patients, setPatients]           = useState([]);
    const [loading, setLoading]             = useState(false);
    const [searched, setSearched]           = useState(false); // a apasat userul Filtreaza?
    const [toast, setToast]                 = useState({ msg: "", type: "" });
    const [startDate, setStartDate]         = useState("");
    const [endDate, setEndDate]             = useState("");
    const [showModal, setShowModal]         = useState(false);

    // Incarcam doar pacientii la mount (pentru dropdown-ul din modal)
    // Nu mai facem request de consultatii automat
    useEffect(() => {
        loadPatients();
    }, []);

    async function loadPatients() {
        try {
            const res = await api.get("/api/patients");
            setPatients(res.data.data || []);
        } catch {
            // eroare necritica
        }
    }

    async function applyFilter() {
        if (!startDate || !endDate) {
            showToast("Selectează ambele date pentru filtrare.", "error");
            return;
        }
        setLoading(true);
        try {
            const res = await api.post("/api/consult/date", {
                startTime: `${startDate}T00:00:00`,
                endTime:   `${endDate}T23:59:59`,
            });
            setConsultations(res.data.data || []);
            setSearched(true);
        } catch {
            showToast("Eroare la filtrare.", "error");
        } finally {
            setLoading(false);
        }
    }

    function resetFilter() {
        setStartDate("");
        setEndDate("");
        setConsultations([]);
        setSearched(false);
    }

    function showToast(msg, type = "success") {
        setToast({ msg, type });
        setTimeout(() => setToast({ msg: "", type: "" }), 3000);
    }

    return (
        <div className={styles.appWrapper}>
            <NavBar />
            <div className={styles.page}>

                <div className={styles.pageHeader}>
                    <div>
                        <h1 className={styles.pageTitle}>Consultații</h1>
                        <p className={styles.pageSub}>
                            {searched ? `${consultations.length} înregistrări` : "Selectează o perioadă pentru a vedea consultațiile"}
                        </p>
                    </div>
                    <button className={styles.btnPrimary} onClick={() => setShowModal(true)}>
                        + Consultație nouă
                    </button>
                </div>

                {toast.msg && (
                    <div className={toast.type === "error" ? styles.toastError : styles.toastSuccess}>
                        {toast.msg}
                    </div>
                )}

                <div className={styles.filterBar}>
                    <div className={styles.filterGroup}>
                        <label>De la</label>
                        <input type="date" value={startDate}
                               onChange={e => setStartDate(e.target.value)}
                               className={styles.dateInput} />
                    </div>
                    <div className={styles.filterGroup}>
                        <label>Până la</label>
                        <input type="date" value={endDate}
                               onChange={e => setEndDate(e.target.value)}
                               className={styles.dateInput} />
                    </div>
                    <button className={styles.btnFilter} onClick={applyFilter}>
                        Filtrează
                    </button>
                    {searched && (
                        <button className={styles.btnReset} onClick={resetFilter}>
                            ✕ Resetează
                        </button>
                    )}
                </div>

                {/* Placeholder cand nu s-a cautat inca */}
                {!searched && !loading && (
                    <div className={styles.empty}>
                        Alege o perioadă și apasă <strong>filtrează</strong> pentru a vedea consultațiile.
                    </div>
                )}

                {loading && <div className={styles.loading}>Se încarcă…</div>}

                {searched && !loading && consultations.length === 0 && (
                    <div className={styles.empty}>Nicio consultație în perioada selectată.</div>
                )}

                {searched && !loading && consultations.map((c, i) => (
                    <ConsultRow key={i} c={c} />
                ))}

            </div>

            {showModal && (
                <ModalAddConsult
                    patients={patients}
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                        setShowModal(false);
                        showToast("Consultație adăugată cu succes!");
                    }}
                />
            )}
        </div>
    );
}

// FIX 2: data fara ora
function ConsultRow({ c }) {
    const [open, setOpen] = useState(false);
    const data = c.dataConsultatie
        ? c.dataConsultatie.split("T")[0]
        : "—";

    return (
        <div className={`${styles.row} ${open ? styles.rowOpen : ""}`}>
            <div className={styles.rowTop} onClick={() => setOpen(!open)}>
                <span className={styles.rowDate}>{data}</span>
                <span className={styles.rowDiag}>{c.diagnostic ?? "—"}</span>
                <span className={styles.rowCnp}>CNP: {c.CNP ?? c.cnp ?? "—"}</span>
                <span className={styles.rowToggle}>{open ? "▲" : "▼"}</span>
            </div>
            {open && (
                <div className={styles.rowBody}>
                    <div>
                        <span className={styles.bodyLabel}>Simptome</span>
                        <p>{c.simptome ?? "—"}</p>
                    </div>
                    <div>
                        <span className={styles.bodyLabel}>Tratament</span>
                        <p>{c.tratament ?? "—"}</p>
                    </div>
                    {c.alteDetalii && (
                        <div style={{ gridColumn: "1/-1" }}>
                            <span className={styles.bodyLabel}>Alte detalii</span>
                            <p>{c.alteDetalii}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function ModalAddConsult({ patients, onClose, onSuccess }) {
    const [form, setForm]       = useState({ cnp: "", simptome: "", diagnostic: "", tratament: "", alteDetalii: "" });
    const [loading, setLoading] = useState(false);
    const [err, setErr]         = useState("");
    const ch = e => setForm({ ...form, [e.target.name]: e.target.value });

    async function submit(e) {
        e.preventDefault();
        setLoading(true); setErr("");
        try {
            await api.post("/api/consult/add", form);
            onSuccess();
        } catch {
            setErr("Eroare la salvare. Încearcă din nou.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
            <div className={styles.modal}>
                <div className={styles.modalHead}>
                    <h2 className={styles.modalTitle}>Consultație nouă</h2>
                    <button className={styles.modalClose} onClick={onClose}>✕</button>
                </div>
                {err && <div className={styles.toastError} style={{ marginBottom: 14 }}>{err}</div>}
                <form onSubmit={submit} className={styles.form}>
                    <div className={styles.field}>
                        <label>Pacient *</label>
                        <select name="cnp" value={form.cnp} onChange={ch} required>
                            <option value="">Selectează pacientul…</option>
                            {patients.map(p => (
                                <option key={p.CNP ?? p.cnp} value={p.CNP ?? p.cnp}>
                                    {p.firstName} {p.lastName} — {p.CNP ?? p.cnp}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.field}>
                        <label>Simptome / Motivul vizitei *</label>
                        <textarea name="simptome" value={form.simptome} onChange={ch} rows={3} required />
                    </div>
                    <div className={styles.field}>
                        <label>Diagnostic *</label>
                        <input name="diagnostic" value={form.diagnostic} onChange={ch} required />
                    </div>
                    <div className={styles.field}>
                        <label>Tratament / Recomandare *</label>
                        <textarea name="tratament" value={form.tratament} onChange={ch} rows={3} required />
                    </div>
                    <div className={styles.field}>
                        <label>Alte detalii (opțional)</label>
                        <textarea name="alteDetalii" value={form.alteDetalii} onChange={ch} rows={2} />
                    </div>
                    <div className={styles.formActions}>
                        <button type="submit" className={styles.btnPrimary} disabled={loading}>
                            {loading ? "Se salvează…" : "Salvează"}
                        </button>
                        <button type="button" className={styles.btnSecondary} onClick={onClose}>Anulează</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AppointmentsPage;