import { useState } from "react";
import NavBar from "./NavBar.jsx";
import styles from "../assets/css/AppointmentsPage.module.css";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
// TODO: replace with api.get("/api/consult/date", { data: { startTime, endTime } })
const MOCK_CONSULTATIONS = [
    {
        cnp: "1870312123456",
        data: "2025-05-28",
        diagnostic: "Carie interproximală 15",
        simptome: "Durere la rece, sensibilitate crescută",
        tratament: "Obtурație compozit clasa II-a",
        alteDetalii: "Radiografie periapicală — fără modificări periapicale",
    },
    {
        cnp: "1870312123456",
        data: "2025-01-10",
        diagnostic: "Control periodic",
        simptome: "Control de rutină, fără acuze",
        tratament: "Detartraj supragingival, periaj profesional",
        alteDetalii: "",
    },
    {
        cnp: "1650814987654",
        data: "2024-12-03",
        diagnostic: "Extracție M1 inferior stânga",
        simptome: "Durere spontană, mobilitate grad III",
        tratament: "Extracție sub anestezie locală, sutură",
        alteDetalii: "",
    },
    {
        cnp: "1650814987654",
        data: "2024-09-15",
        diagnostic: "Pulpită acută ireversibilă 36",
        simptome: "Durere pulsatilă spontană, accentuată nocturn",
        tratament: "Tratament endodontic — biopulpectomie",
        alteDetalii: "3 canale, obturație provizorie Cavit",
    },
];

// TODO: replace with api.get("/api/patients")
const MOCK_PATIENTS = [
    { cnp: "1870312123456", firstName: "Maria",  lastName: "Popescu" },
    { cnp: "1650814987654", firstName: "Ion",    lastName: "Gheorghe" },
    { cnp: "2780920321321", firstName: "Elena",  lastName: "Stancu" },
];
// ─────────────────────────────────────────────────────────────────────────────

function AppointmentsPage() {
    const [consultations, setConsultations] = useState(MOCK_CONSULTATIONS);
    const [patients]                        = useState(MOCK_PATIENTS);
    const [toast, setToast]                 = useState({ msg: "", type: "" });
    const [startDate, setStartDate]         = useState("");
    const [endDate, setEndDate]             = useState("");
    const [showModal, setShowModal]         = useState(false);

    function showToast(msg, type = "success") {
        setToast({ msg, type });
        setTimeout(() => setToast({ msg: "", type: "" }), 3000);
    }

    // Filtru client-side pe data — cand vine din backend se inlocuieste cu request
    // TODO: replace with api.get("/api/consult/date", { data: { startTime, endTime } })
    function applyFilter() {
        if (!startDate || !endDate) { showToast("Selectează ambele date.", "error"); return; }
        const filtered = MOCK_CONSULTATIONS.filter(c => {
            if (!c.data) return false;
            return c.data >= startDate && c.data <= endDate;
        });
        setConsultations(filtered);
    }

    function resetFilter() {
        setStartDate("");
        setEndDate("");
        setConsultations(MOCK_CONSULTATIONS);
    }

    return (
        <div className={styles.appWrapper}>
            <NavBar />
            <div className={styles.page}>

                <div className={styles.pageHeader}>
                    <div>
                        <h1 className={styles.pageTitle}>Consultații</h1>
                        <p className={styles.pageSub}>{consultations.length} înregistrări</p>
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
                               onChange={e => setStartDate(e.target.value)} className={styles.dateInput} />
                    </div>
                    <div className={styles.filterGroup}>
                        <label>Până la</label>
                        <input type="date" value={endDate}
                               onChange={e => setEndDate(e.target.value)} className={styles.dateInput} />
                    </div>
                    <button className={styles.btnFilter} onClick={applyFilter}>Filtrează</button>
                    {(startDate || endDate) && (
                        <button className={styles.btnReset} onClick={resetFilter}>✕ Resetează</button>
                    )}
                </div>

                {consultations.length === 0 && (
                    <div className={styles.empty}>Nicio consultație în perioada selectată.</div>
                )}

                {consultations.map((c, i) => (
                    <ConsultRow key={i} c={c} />
                ))}

            </div>

            {showModal && (
                <ModalAddConsult
                    patients={patients}
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                        setShowModal(false);
                        showToast("Consultație adăugată! (mock — nu s-a salvat în backend)");
                    }}
                />
            )}
        </div>
    );
}

// ─── Un rand expandabil ───────────────────────────────────────────────────────
function ConsultRow({ c }) {
    const [open, setOpen] = useState(false);

    return (
        <div className={`${styles.row} ${open ? styles.rowOpen : ""}`}>
            <div className={styles.rowTop} onClick={() => setOpen(!open)}>
                <span className={styles.rowDate}>{c.data ?? "—"}</span>
                <span className={styles.rowDiag}>{c.diagnostic ?? "—"}</span>
                <span className={styles.rowCnp}>CNP: {c.cnp ?? "—"}</span>
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
// TODO: submit → api.post("/api/consult/add", form)
function ModalAddConsult({ patients, onClose, onSuccess }) {
    const [form, setForm] = useState({
        cnp: "", simptome: "", diagnostic: "", tratament: "", alteDetalii: ""
    });

    const ch = e => setForm({ ...form, [e.target.name]: e.target.value });

    function submit(e) {
        e.preventDefault();
        // TODO: await api.post("/api/consult/add", form)
        onSuccess();
    }

    return (
        <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
            <div className={styles.modal}>
                <div className={styles.modalHead}>
                    <h2 className={styles.modalTitle}>Consultație nouă</h2>
                    <button className={styles.modalClose} onClick={onClose}>✕</button>
                </div>
                <form onSubmit={submit} className={styles.form}>
                    <div className={styles.field}>
                        <label>Pacient *</label>
                        <select name="cnp" value={form.cnp} onChange={ch} required>
                            <option value="">Selectează pacientul…</option>
                            {patients.map(p => (
                                <option key={p.cnp} value={p.cnp}>
                                    {p.firstName} {p.lastName} — {p.cnp}
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
                        <button type="submit"  className={styles.btnPrimary}>Salvează</button>
                        <button type="button"  className={styles.btnSecondary} onClick={onClose}>Anulează</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AppointmentsPage;