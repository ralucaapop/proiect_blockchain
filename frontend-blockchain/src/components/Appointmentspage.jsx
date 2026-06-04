import { useState, useEffect } from "react";
import NavBar from "./NavBar.jsx";
import api from "../api/axios.js";
import styles from "../assets/css/AppointmentsPage.module.css";

// Ruta: /doctor/consultatii
//
// Fara filtru = incarca toate consultarile (perioada larga din backend)
// Cu filtru = incarca doar din intervalul selectat
//
// NOTA: Backend-ul tau are GET /api/consult/date cu body { startTime, endTime }
// Unele browsere nu suporta body la GET. Daca dai eroare 400/500,
// schimba in backend @GetMapping in @PostMapping pentru acea ruta.

function AppointmentsPage() {
    const [consultations, setConsultations] = useState([]);
    const [patients, setPatients]           = useState([]);
    const [loading, setLoading]             = useState(true);
    const [toast, setToast]                 = useState({ msg: "", type: "" });
    const [startDate, setStartDate]         = useState("");
    const [endDate, setEndDate]             = useState("");
    const [showModal, setShowModal]         = useState(false);

    useEffect(() => {
        loadAll();
        loadPatients();
    }, []);

    // Incarca toate consultarile — perioada foarte larga ca sa le prinda pe toate
    async function loadAll() {
        setLoading(true);
        try {
            const res = await api.get("/api/consult/date", {
                data: {
                    startTime: "2000-01-01T00:00:00",
                    endTime:   "2099-12-31T23:59:59",
                },
            });
            setConsultations(res.data.data || []);
        } catch {
            showToast("Nu s-au putut încărca consultațiile.", "error");
        } finally {
            setLoading(false);
        }
    }

    async function loadPatients() {
        try {
            const res = await api.get("/api/patients");
            setPatients(res.data.data || []);
        } catch {
            // lista de pacienti e folosita doar pentru dropdown-ul din modal
            // eroarea nu e critica
        }
    }

    // Filtru pe perioada — valorile vin din input-urile de date ale utilizatorului
    async function applyFilter() {
        if (!startDate || !endDate) {
            showToast("Selectează ambele date pentru filtrare.", "error");
            return;
        }
        setLoading(true);
        try {
            const res = await api.post("/api/consult/date", {
                startTime: `${startDate}T00:00:00`,
                endTime: `${endDate}T23:59:59`,
            });
            setConsultations(res.data.data || []);
        } catch {
            showToast("Eroare la filtrare.", "error");
        } finally {
            setLoading(false);
        }
    }

    function resetFilter() {
        setStartDate("");
        setEndDate("");
        loadAll();
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
                            {loading ? "Se încarcă…" : `${consultations.length} înregistrări`}
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

                {/* Filtru perioada — valorile sunt complet controlate de utilizator */}
                <div className={styles.filterBar}>
                    <div className={styles.filterGroup}>
                        <label>De la</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                            className={styles.dateInput}
                        />
                    </div>
                    <div className={styles.filterGroup}>
                        <label>Până la</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            className={styles.dateInput}
                        />
                    </div>
                    <button className={styles.btnFilter} onClick={applyFilter}>
                        Filtrează
                    </button>
                    {(startDate || endDate) && (
                        <button className={styles.btnReset} onClick={resetFilter}>
                            ✕ Resetează
                        </button>
                    )}
                </div>

                {loading && <div className={styles.loading}>Se încarcă…</div>}

                {!loading && consultations.length === 0 && (
                    <div className={styles.empty}>
                        Nicio consultație în perioada selectată.
                    </div>
                )}

                {!loading && consultations.map((c, i) => (
                    <ConsultRow key={i} c={c} />
                ))}

            </div>

            {showModal && (
                <ModalAddConsult
                    patients={patients}
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                        setShowModal(false);
                        loadAll();
                        showToast("Consultație adăugată cu succes!");
                    }}
                />
            )}
        </div>
    );
}

// ─── Un rand expandabil din lista ─────────────────────────────────────────────
function ConsultRow({ c }) {
    const [open, setOpen] = useState(false);

    return (
        <div className={`${styles.row} ${open ? styles.rowOpen : ""}`}>
            <div className={styles.rowTop} onClick={() => setOpen(!open)}>
                <span className={styles.rowDate}>{c.dataConsultatie ?? c.dataConsultatie ?? "—"}</span>
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

// ─── Modal adaugare consultatie ───────────────────────────────────────────────
// POST /api/consult/add → { cnp, simptome, diagnostic, tratament, alteDetalii }
function ModalAddConsult({ patients, onClose, onSuccess }) {
    const [form, setForm]       = useState({ cnp: "", simptome: "", diagnostic: "", tratament: "", alteDetalii: "" });
    const [loading, setLoading] = useState(false);
    const [err, setErr]         = useState("");

    const ch = e => setForm({ ...form, [e.target.name]: e.target.value });

    async function submit(e) {
        e.preventDefault();
        setLoading(true);
        setErr("");
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
                        <button type="button" className={styles.btnSecondary} onClick={onClose}>
                            Anulează
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AppointmentsPage;