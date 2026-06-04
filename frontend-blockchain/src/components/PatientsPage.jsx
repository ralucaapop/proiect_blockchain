import { useState, useEffect } from "react";
import NavBar from "./NavBar.jsx";
import api from "../api/axios.js";
import styles from "../assets/css/PatientsPage.module.css";

// Ruta: /doctor/pacienti
// Layout split: stanga = lista, dreapta = fisa pacient selectat sau formular

function PatientsPage() {
    const [patients, setPatients]         = useState([]);
    const [search, setSearch]             = useState("");
    const [selected, setSelected]         = useState(null);
    const [consultations, setConsultations] = useState([]);
    const [mode, setMode]                 = useState("idle");
    const [toast, setToast]               = useState({ msg: "", type: "" });
    const [loadingPatients, setLoadingPatients] = useState(true);
    const [loadingFile, setLoadingFile]   = useState(false);

    // Incarca lista de pacienti la mount
    useEffect(() => {
        loadPatients();
    }, []);

    async function loadPatients() {
        setLoadingPatients(true);
        try {
            const res = await api.get("/api/patients");
            setPatients(res.data.data || []);
        } catch {
            showToast("Nu s-a putut încărca lista de pacienți.", "error");
        } finally {
            setLoadingPatients(false);
        }
    }

    // La click pe un pacient din lista:
    // incarca datele complete + consultatiile lui in paralel
    async function selectPatient(cnp) {
        setLoadingFile(true);
        setMode("view");
        try {
            const [patRes, consultRes] = await Promise.all([
                api.get(`/api/patient/${cnp}`),
                api.get(`/api/consult/patient/${cnp}`),
            ]);
            setSelected(patRes.data.data);
            setConsultations(consultRes.data.data || []);
        } catch {
            showToast("Eroare la încărcarea fișei.", "error");
            setMode("idle");
        } finally {
            setLoadingFile(false);
        }
    }

    function showToast(msg, type = "success") {
        setToast({ msg, type });
        setTimeout(() => setToast({ msg: "", type: "" }), 3000);
    }

    const filtered = patients.filter(p => {
        const q = search.toLowerCase();
        return (
            p.firstName?.toLowerCase().includes(q) ||
            p.lastName?.toLowerCase().includes(q) ||
            p.CNP?.includes(q)
        );
    });

    return (
        <div className={styles.appWrapper}>
            <NavBar />
            <div className={styles.layout}>

                {/* ════ SIDEBAR STANGA ════ */}
                <aside className={styles.sidebar}>
                    <div className={styles.sidebarTop}>
                        <h2 className={styles.sidebarTitle}>Pacienți</h2>
                        <button
                            className={styles.btnAdd}
                            onClick={() => { setMode("addPatient"); setSelected(null); }}
                        >
                            + Pacient nou
                        </button>
                    </div>

                    <div className={styles.searchBox}>
                        <input
                            className={styles.search}
                            placeholder="Caută după nume sau CNP…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    <ul className={styles.list}>
                        {loadingPatients && (
                            <li className={styles.listEmpty}>Se încarcă…</li>
                        )}
                        {!loadingPatients && filtered.length === 0 && (
                            <li className={styles.listEmpty}>Niciun pacient găsit.</li>
                        )}
                        {!loadingPatients && filtered.map(p => (
                            <li
                                key={p.CNP}
                                className={`${styles.listItem} ${selected?.CNP === p.CNP && mode === "view" ? styles.listItemActive : ""}`}
                                onClick={() => selectPatient(p.CNP)}
                            >
                                <div className={styles.avatar}>
                                    {(p.firstName?.[0] || "").toUpperCase()}
                                    {(p.lastName?.[0]  || "").toUpperCase()}
                                </div>
                                <div className={styles.listMeta}>
                                    <span className={styles.listName}>
                                        {p.firstName} {p.lastName}
                                    </span>
                                    <span className={styles.listCnp}>{p.CNP}</span>
                                </div>
                                <span className={`${styles.badge} ${p.patientStatus === "TRANSFERAT" ? styles.badgeGray : styles.badgeGreen}`}>
                                    {p.patientStatus === "TRANSFERAT" ? "Transferat" : "Activ"}
                                </span>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* ════ PANEL DREAPTA ════ */}
                <main className={styles.panel}>
                    {toast.msg && (
                        <div className={toast.type === "error" ? styles.toastError : styles.toastSuccess}>
                            {toast.msg}
                        </div>
                    )}

                    {mode === "idle" && <Placeholder />}

                    {mode === "addPatient" && (
                        <FormAddPatient
                            onSuccess={() => {
                                loadPatients();
                                setMode("idle");
                                showToast("Pacient creat cu succes!");
                            }}
                            onCancel={() => setMode("idle")}
                        />
                    )}

                    {mode === "view" && loadingFile && (
                        <div className={styles.loadingFile}>Se încarcă fișa…</div>
                    )}

                    {mode === "view" && !loadingFile && selected && (
                        <PatientFile
                            patient={selected}
                            consultations={consultations}
                            onAddConsult={() => setMode("addConsult")}
                            onRefresh={() => selectPatient(selected.CNP)}
                            showToast={showToast}
                        />
                    )}

                    {mode === "addConsult" && selected && (
                        <FormAddConsult
                            cnp={selected.CNP}
                            name={`${selected.firstName} ${selected.lastName}`}
                            onSuccess={() => {
                                selectPatient(selected.CNP);
                                showToast("Consultație adăugată cu succes!");
                            }}
                            onCancel={() => setMode("view")}
                        />
                    )}
                </main>

            </div>
        </div>
    );
}

// ─── Placeholder ──────────────────────────────────────────────────────────────
function Placeholder() {
    return (
        <div className={styles.placeholder}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <p>Selectează un pacient din listă<br/>sau adaugă unul nou.</p>
        </div>
    );
}

// ─── Formular creare pacient ──────────────────────────────────────────────────
// POST /api/auth/register → { firstName, lastName, cnp, password }
function FormAddPatient({ onSuccess, onCancel }) {
    const [form, setForm]     = useState({ firstName: "", lastName: "", cnp: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [err, setErr]       = useState("");

    const ch = e => setForm({ ...form, [e.target.name]: e.target.value });

    async function submit(e) {
        e.preventDefault();
        setLoading(true);
        setErr("");
        try {
            await api.post("/api/auth/register", form);
            onSuccess();
        } catch {
            setErr("Eroare la creare. Verifică dacă CNP-ul nu există deja.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.formPanel}>
            <h2 className={styles.panelTitle}>Pacient nou</h2>
            <p className={styles.panelSub}>
                Completează datele minime. Fișa completă se editează ulterior.
            </p>
            {err && <div className={styles.toastError}>{err}</div>}
            <form onSubmit={submit} className={styles.form}>
                <div className={styles.row2}>
                    <Field label="Prenume *" name="firstName" value={form.firstName} onChange={ch} placeholder="Maria"   required />
                    <Field label="Nume *"    name="lastName"  value={form.lastName}  onChange={ch} placeholder="Popescu" required />
                </div>
                <Field label="CNP *"              name="cnp"      value={form.cnp}      onChange={ch} placeholder="1234567890123" maxLength={13} required />
                <Field label="Parolă temporară *" name="password" value={form.password} onChange={ch} type="password" placeholder="••••••••" required />
                <div className={styles.actions}>
                    <button type="submit" className={styles.btnPrimary} disabled={loading}>
                        {loading ? "Se creează…" : "Creează cont"}
                    </button>
                    <button type="button" className={styles.btnSecondary} onClick={onCancel}>
                        Anulează
                    </button>
                </div>
            </form>
        </div>
    );
}

// ─── Fisa completa a pacientului ──────────────────────────────────────────────
function PatientFile({ patient, consultations, onAddConsult, onRefresh, showToast }) {
    return (
        <div className={styles.filePanel}>

            {/* Header */}
            <div className={styles.fileHeader}>
                <div className={styles.fileAvatar}>
                    {(patient.firstName?.[0] || "").toUpperCase()}
                    {(patient.lastName?.[0]  || "").toUpperCase()}
                </div>
                <div className={styles.fileHeaderInfo}>
                    <h2 className={styles.fileName}>
                        {patient.firstName} {patient.lastName}
                    </h2>
                    <p className={styles.fileCnp}>
                        CNP: {patient.CNP}
                        <span
                            className={`${styles.badge} ${patient.patientStatus === "TRANSFERAT" ? styles.badgeGray : styles.badgeGreen}`}
                            style={{ marginLeft: 10 }}
                        >
                            {patient.patientStatus === "TRANSFERAT" ? "Transferat" : "Activ"}
                        </span>
                    </p>
                </div>
                {patient.patientStatus !== "TRANSFERAT" && (
                    <BtnTransfer
                        cnp={patient.CNP}
                        onDone={onRefresh}
                        showToast={showToast}
                    />
                )}
            </div>

            <SectPersonal patient={patient} onSaved={onRefresh} showToast={showToast} />
            <SectMedical  patient={patient} onSaved={onRefresh} showToast={showToast} />

            {/* Consultatii */}
            <div className={styles.section}>
                <div className={styles.sectHead}>
                    <h3 className={styles.sectTitle}>Consultații</h3>
                    <button
                        className={styles.btnPrimary}
                        style={{ padding: "7px 14px", fontSize: "0.82rem" }}
                        onClick={onAddConsult}
                    >
                        + Consultație nouă
                    </button>
                </div>
                {consultations.length === 0
                    ? <p className={styles.emptyText}>Nicio consultație înregistrată.</p>
                    : consultations.map((c, i) => <ConsultCard key={i} c={c} />)
                }
            </div>
        </div>
    );
}

// ─── Sectiunea date personale cu editare ─────────────────────────────────────
// PUT /api/patient → { cnp, firstName, lastName, dateOfBirth, phone, email, address }
function SectPersonal({ patient, onSaved, showToast }) {
    const [edit, setEdit] = useState(false);
    const [form, setForm] = useState({
        cnp:         patient.CNP,
        firstName:   patient.firstName   || "",
        lastName:    patient.lastName    || "",
        dateOfBirth: patient.dateOfBirth || "",
        phone:       patient.phone       || "",
        email:       patient.email       || "",
        address:     patient.address     || "",
    });

    const ch = e => setForm({ ...form, [e.target.name]: e.target.value });

    async function save() {
        try {
            await api.put("/api/patient", form);
            showToast("Date personale salvate!");
            setEdit(false);
            onSaved();
        } catch {
            showToast("Eroare la salvare.", "error");
        }
    }

    return (
        <div className={styles.section}>
            <div className={styles.sectHead}>
                <h3 className={styles.sectTitle}>Date personale</h3>
                {!edit && (
                    <button className={styles.btnEdit} onClick={() => setEdit(true)}>
                        ✎ Editează
                    </button>
                )}
            </div>
            {!edit ? (
                <div className={styles.infoGrid}>
                    <Info label="Data nașterii" value={patient.dateOfBirth} />
                    <Info label="Telefon"        value={patient.phone} />
                    <Info label="Email"          value={patient.email} />
                    <Info label="Adresă"         value={patient.address} span={2} />
                </div>
            ) : (
                <div className={styles.form}>
                    <div className={styles.row2}>
                        <Field label="Prenume"       name="firstName"   value={form.firstName}   onChange={ch} />
                        <Field label="Nume"          name="lastName"    value={form.lastName}    onChange={ch} />
                    </div>
                    <div className={styles.row2}>
                        <Field label="Data nașterii" name="dateOfBirth" value={form.dateOfBirth} onChange={ch} placeholder="YYYY-MM-DD" />
                        <Field label="Telefon"       name="phone"       value={form.phone}       onChange={ch} />
                    </div>
                    <Field label="Email"  name="email"   value={form.email}   onChange={ch} type="email" />
                    <Field label="Adresă" name="address" value={form.address} onChange={ch} />
                    <div className={styles.actions}>
                        <button className={styles.btnPrimary}   onClick={save}>Salvează</button>
                        <button className={styles.btnSecondary} onClick={() => setEdit(false)}>Anulează</button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Sectiunea date medicale cu editare ───────────────────────────────────────
// PUT /api/patient_medical_info → { cnpPatient, bloodGroupRh, allergies,
//                                   chronicDiseases, currentMedication,
//                                   vaccines, familyHistory, patientStatus }
function SectMedical({ patient, onSaved, showToast }) {
    const [edit, setEdit] = useState(false);
    const [form, setForm] = useState({
        cnpPatient:        patient.CNP,
        bloodGroupRh:      patient.bloodGroupRh      || "",
        allergies:         patient.allergies          || "",
        chronicDiseases:   patient.chronicDiseases    || "",
        currentMedication: patient.currentMedication  || "",
        vaccines:          patient.vaccines            || "",
        familyHistory:     patient.familyHistory       || "",
        patientStatus:     patient.patientStatus       || "ACTIV",
    });

    const ch = e => setForm({ ...form, [e.target.name]: e.target.value });

    async function save() {
        try {
            await api.put("/api/patient_medical_info", form);
            showToast("Date medicale salvate!");
            setEdit(false);
            onSaved();
        } catch {
            showToast("Eroare la salvare.", "error");
        }
    }

    return (
        <div className={styles.section}>
            <div className={styles.sectHead}>
                <h3 className={styles.sectTitle}>Date medicale</h3>
                {!edit && (
                    <button className={styles.btnEdit} onClick={() => setEdit(true)}>
                        ✎ Editează
                    </button>
                )}
            </div>
            {!edit ? (
                <div className={styles.infoGrid}>
                    <Info label="Grupă sânge"         value={patient.bloodGroupRh} />
                    <Info label="Înălțime / Greutate"  value={`${patient.height || "—"} cm / ${patient.weight || "—"} kg`} />
                    <Info label="Alergii"              value={patient.allergies} />
                    <Info label="Boli cronice"         value={patient.chronicDiseases} />
                    <Info label="Medicație curentă"    value={patient.currentMedication} />
                    <Info label="Vaccinuri"            value={patient.vaccines} />
                    <Info label="Istoric familial"     value={patient.familyHistory} span={2} />
                </div>
            ) : (
                <div className={styles.form}>
                    <Field    label="Grupă sânge + RH"  name="bloodGroupRh"      value={form.bloodGroupRh}      onChange={ch} placeholder="ex: A+" />
                    <Textarea label="Alergii"            name="allergies"          value={form.allergies}          onChange={ch} />
                    <Textarea label="Boli cronice"       name="chronicDiseases"    value={form.chronicDiseases}    onChange={ch} />
                    <Textarea label="Medicație curentă"  name="currentMedication"  value={form.currentMedication}  onChange={ch} />
                    <Textarea label="Vaccinuri"          name="vaccines"            value={form.vaccines}            onChange={ch} />
                    <Textarea label="Istoric familial"   name="familyHistory"       value={form.familyHistory}       onChange={ch} />
                    <div className={styles.actions}>
                        <button className={styles.btnPrimary}   onClick={save}>Salvează</button>
                        <button className={styles.btnSecondary} onClick={() => setEdit(false)}>Anulează</button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Buton transfer pacient ───────────────────────────────────────────────────
// PUT /api/patient_status → { cnpPatient, newStatus: "TRANSFERAT" }
function BtnTransfer({ cnp, onDone, showToast }) {
    async function transfer() {
        if (!window.confirm("Marchezi pacientul ca TRANSFERAT. Ești sigur?")) return;
        try {
            await api.put("/api/patient_status", { cnpPatient: cnp, newStatus: "TRANSFERAT" });
            showToast("Pacient marcat ca transferat.");
            onDone();
        } catch {
            showToast("Eroare la schimbarea statusului.", "error");
        }
    }
    return (
        <button className={styles.btnDanger} onClick={transfer} style={{ marginLeft: "auto" }}>
            Transferă
        </button>
    );
}

// ─── Card consultatie (read-only) ─────────────────────────────────────────────
function ConsultCard({ c }) {
    return (
        <div className={styles.consultCard}>
            <div className={styles.consultTop}>
                <span className={styles.consultDate}>{c.dataConsultatie ?? c.dataConsultatie ?? "—"}</span>
                <span className={styles.consultDiag}>{c.diagnostic ?? "—"}</span>
            </div>
            <div className={styles.consultGrid}>
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
    );
}

// ─── Formular consultatie noua ────────────────────────────────────────────────
// POST /api/consult/add → { cnp, simptome, diagnostic, tratament, alteDetalii }
function FormAddConsult({ cnp, name, onSuccess, onCancel }) {
    const [form, setForm]       = useState({ cnp, simptome: "", diagnostic: "", tratament: "", alteDetalii: "" });
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
        <div className={styles.formPanel}>
            <h2 className={styles.panelTitle}>Consultație nouă</h2>
            <p className={styles.panelSub}>Pacient: <strong>{name}</strong></p>
            {err && <div className={styles.toastError}>{err}</div>}
            <form onSubmit={submit} className={styles.form}>
                <Textarea label="Simptome / Motivul vizitei *" name="simptome"    value={form.simptome}    onChange={ch} required />
                <Field    label="Diagnostic *"                 name="diagnostic"  value={form.diagnostic}  onChange={ch} required />
                <Textarea label="Tratament / Recomandare *"    name="tratament"   value={form.tratament}   onChange={ch} required />
                <Textarea label="Alte detalii (opțional)"      name="alteDetalii" value={form.alteDetalii} onChange={ch} />
                <div className={styles.actions}>
                    <button type="submit"  className={styles.btnPrimary} disabled={loading}>
                        {loading ? "Se salvează…" : "Salvează consultație"}
                    </button>
                    <button type="button" className={styles.btnSecondary} onClick={onCancel}>
                        Anulează
                    </button>
                </div>
            </form>
        </div>
    );
}

// ─── Micro-componente ─────────────────────────────────────────────────────────
function Info({ label, value, span }) {
    return (
        <div className={styles.infoItem} style={span ? { gridColumn: `span ${span}` } : {}}>
            <span className={styles.infoLabel}>{label}</span>
            <p className={styles.infoValue}>{value || "—"}</p>
        </div>
    );
}

function Field({ label, name, value, onChange, type = "text", placeholder, required, maxLength }) {
    return (
        <div className={styles.field}>
            <label>{label}</label>
            <input
                name={name} value={value} onChange={onChange}
                type={type} placeholder={placeholder}
                required={required} maxLength={maxLength}
            />
        </div>
    );
}

function Textarea({ label, name, value, onChange, required }) {
    return (
        <div className={styles.field}>
            <label>{label}</label>
            <textarea name={name} value={value} onChange={onChange} rows={2} required={required} />
        </div>
    );
}

export default PatientsPage;