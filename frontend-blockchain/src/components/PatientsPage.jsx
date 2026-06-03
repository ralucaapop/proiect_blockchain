import {useEffect, useState} from "react";
import NavBar from "./NavBar.jsx";
import styles from "../assets/css/PatientsPage.module.css";
import axios from "axios";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
// TODO: replace with api.get("/api/patients") when backend is ready
const MOCK_PATIENTS = [
    {
        cnp: "1870312123456",
        firstName: "Maria",
        lastName: "Popescu",
        dateOfBirth: "1987-03-12",
        phone: "0722 000 001",
        email: "maria.popescu@email.ro",
        address: "Str. Florilor 4, Cluj-Napoca",
        patientStatus: "ACTIV",
        bloodGroupRh: "A+",
        height: 165,
        weight: 62,
        allergies: "Penicilină",
        chronicDiseases: "Diabet tip 2",
        currentMedication: "Metformin 500mg",
        vaccines: "COVID-19, Tetanos",
        familyHistory: "Tată — hipertensiune arterială",
    },
    {
        cnp: "1650814987654",
        firstName: "Ion",
        lastName: "Gheorghe",
        dateOfBirth: "1965-08-14",
        phone: "0744 000 002",
        email: "ion.gheorghe@email.ro",
        address: "Bd. Unirii 22, București",
        patientStatus: "ACTIV",
        bloodGroupRh: "0+",
        height: 178,
        weight: 85,
        allergies: "",
        chronicDiseases: "Hipertensiune",
        currentMedication: "Enalapril 10mg",
        vaccines: "Gripă",
        familyHistory: "",
    },
    {
        cnp: "2780920321321",
        firstName: "Elena",
        lastName: "Stancu",
        dateOfBirth: "1978-09-20",
        phone: "",
        email: "elena.stancu@email.ro",
        address: "Str. Mihai Viteazu 1, Timișoara",
        patientStatus: "TRANSFERAT",
        bloodGroupRh: "B-",
        height: 160,
        weight: 55,
        allergies: "Aspirină",
        chronicDiseases: "",
        currentMedication: "",
        vaccines: "COVID-19",
        familyHistory: "Mamă — diabet tip 2",
    },
];

// TODO: replace with api.get("/api/consult/patient/:cnp") when backend is ready
const MOCK_CONSULTATIONS = {
    "1870312123456": [
        {
            data: "2025-05-28",
            diagnostic: "Carie interproximală 15",
            simptome: "Durere la rece și la dulce, sensibilitate crescută",
            tratament: "Obtурație compozit clasa II-a",
            alteDetalii: "Radiografie periapicală — fără modificări periapicale",
        },
        {
            data: "2025-01-10",
            diagnostic: "Control periodic",
            simptome: "Control de rutină, fără acuze",
            tratament: "Detartraj supragingival, periaj profesional",
            alteDetalii: "",
        },
    ],
    "1650814987654": [
        {
            data: "2024-12-03",
            diagnostic: "Extracție M1 inferior stânga",
            simptome: "Durere spontană, mobilitate grad III",
            tratament: "Extracție sub anestezie locală, sutură",
            alteDetalii: "",
        },
    ],
    "2780920321321": [],
};

// ─────────────────────────────────────────────────────────────────────────────

function PatientsPage() {
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState(null);
    const [consultations, setConsultations] = useState([]);
    const [mode, setMode] = useState("idle");
    const [toast, setToast] = useState({ msg: "", type: "" });

    const getAllPatients = async () =>{
        try {
            const token = localStorage.getItem('token');

            const response = await axios.get(`http://localhost:8080/api/patients`,{ headers: {
                Authorization: `Bearer ${token}`,
            },
            });
            console.log("Patients:", response.data.data);
            setPatients(response.data.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };


    useEffect(() => {
        getAllPatients()
    }, []);

    const selectPatient=(cnp)=> {
        const pat = patients.find(p => p.cnp === cnp);
        setSelected(pat);
        setConsultations(MOCK_CONSULTATIONS[cnp] || []);
        setMode("view");
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
            p.cnp?.includes(q)
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
                        {filtered.length === 0 && (
                            <li className={styles.listEmpty}>Niciun pacient găsit.</li>
                        )}
                        {filtered.map(p => (
                            <li
                                key={p.cnp}
                                className={`${styles.listItem} ${selected?.cnp === p.cnp && mode === "view" ? styles.listItemActive : ""}`}
                                onClick={() => selectPatient(p.cnp)}
                            >
                                <div className={styles.avatar}>
                                    {(p.firstName?.[0] || "")}{(p.lastName?.[0] || "")}
                                </div>
                                <div className={styles.listMeta}>
                                    <span className={styles.listName}>{p.firstName} {p.lastName}</span>
                                    <span className={styles.listCnp}>{p.cnp}</span>
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
                            onSuccess={() => { setMode("idle"); showToast("Pacient creat! (mock — nu s-a salvat în backend)"); }}
                            onCancel={() => setMode("idle")}
                        />
                    )}

                    {mode === "view" && selected && (
                        <PatientFile
                            patient={selected}
                            consultations={consultations}
                            onAddConsult={() => setMode("addConsult")}
                            onRefresh={() => selectPatient(selected.cnp)}
                            showToast={showToast}
                        />
                    )}

                    {mode === "addConsult" && selected && (
                        <FormAddConsult
                            cnp={selected.cnp}
                            name={`${selected.firstName} ${selected.lastName}`}
                            onSuccess={() => { setMode("view"); showToast("Consultație adăugată! (mock — nu s-a salvat în backend)"); }}
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


function FormAddPatient({ onSuccess, onCancel }) {
    const [form, setForm] = useState({ firstName: "", lastName: "", cnp: "", password: "" });
    const ch = e => setForm({ ...form, [e.target.name]: e.target.value });

    async function submit(e) {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/register', {
                firstName: "test",
                lastName:"testln",
                cnp:"testcnp",
                password:"test_pw"
            });

            if (response.status === 200) {
                console.log(response.data);
                onSuccess();
            } else {
                alert('Eroare la înregistrare: ' + response.statusText);
            }
        } catch (error) {
            console.error('Eroare de la server:', error.response ? error.response.data : error.message);
        }

    }

    return (
        <div className={styles.formPanel}>
            <h2 className={styles.panelTitle}>Pacient nou</h2>
            <p className={styles.panelSub}>Completează datele minime. Fișa completă se editează ulterior.</p>
            <form onSubmit={submit} className={styles.form}>
                <div className={styles.row2}>
                    <Field label="Prenume *"  name="firstName" value={form.firstName} onChange={ch} placeholder="Maria"   required />
                    <Field label="Nume *"     name="lastName"  value={form.lastName}  onChange={ch} placeholder="Popescu" required />
                </div>
                <Field label="CNP *"               name="cnp"      value={form.cnp}      onChange={ch} placeholder="1234567890123" maxLength={13} required />
                <Field label="Parolă temporară *"  name="password" value={form.password} onChange={ch} type="password" placeholder="••••••••" required />
                <div className={styles.actions}>
                    <button type="submit" className={styles.btnPrimary}>Creează cont</button>
                    <button type="button" className={styles.btnSecondary} onClick={onCancel}>Anulează</button>
                </div>
            </form>
        </div>
    );
}

// ─── Fisa completa a pacientului ──────────────────────────────────────────────
function PatientFile({ patient, consultations, onAddConsult, onRefresh, showToast }) {
    return (
        <div className={styles.filePanel}>
            <div className={styles.fileHeader}>
                <div className={styles.fileAvatar}>
                    {patient.firstName?.[0]}{patient.lastName?.[0]}
                </div>
                <div className={styles.fileHeaderInfo}>
                    <h2 className={styles.fileName}>{patient.firstName} {patient.lastName}</h2>
                    <p className={styles.fileCnp}>
                        CNP: {patient.cnp}
                        <span className={`${styles.badge} ${patient.patientStatus === "TRANSFERAT" ? styles.badgeGray : styles.badgeGreen}`} style={{ marginLeft: 10 }}>
                            {patient.patientStatus === "TRANSFERAT" ? "Transferat" : "Activ"}
                        </span>
                    </p>
                </div>
                {patient.patientStatus !== "TRANSFERAT" && (
                    <BtnTransfer cnp={patient.cnp} onDone={onRefresh} showToast={showToast} />
                )}
            </div>

            <SectPersonal patient={patient} onSaved={onRefresh} showToast={showToast} />
            <SectMedical  patient={patient} onSaved={onRefresh} showToast={showToast} />

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

// ─── Sectiunea date personale ─────────────────────────────────────────────────
// TODO: save → api.put("/api/patient", form)
function SectPersonal({ patient, onSaved, showToast }) {
    const [edit, setEdit] = useState(false);
    const [form, setForm] = useState({
        cnp: patient.cnp,
        firstName:   patient.firstName   || "",
        lastName:    patient.lastName    || "",
        dateOfBirth: patient.dateOfBirth || "",
        phone:       patient.phone       || "",
        email:       patient.email       || "",
        address:     patient.address     || "",
    });

    const ch = e => setForm({ ...form, [e.target.name]: e.target.value });

    function save() {
        // TODO: await api.put("/api/patient", form)
        showToast("Date personale salvate! (mock)");
        setEdit(false);
        onSaved();
    }

    return (
        <div className={styles.section}>
            <div className={styles.sectHead}>
                <h3 className={styles.sectTitle}>Date personale</h3>
                {!edit && <button className={styles.btnEdit} onClick={() => setEdit(true)}>✎ Editează</button>}
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
                    <Field label="Email"   name="email"   value={form.email}   onChange={ch} type="email" />
                    <Field label="Adresă"  name="address" value={form.address} onChange={ch} />
                    <div className={styles.actions}>
                        <button className={styles.btnPrimary}   onClick={save}>Salvează</button>
                        <button className={styles.btnSecondary} onClick={() => setEdit(false)}>Anulează</button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Sectiunea date medicale ──────────────────────────────────────────────────
// TODO: save → api.put("/api/patient_medical_info", form)
function SectMedical({ patient, onSaved, showToast }) {
    const [edit, setEdit] = useState(false);
    const [form, setForm] = useState({
        cnpPatient:        patient.cnp,
        bloodGroupRh:      patient.bloodGroupRh      || "",
        allergies:         patient.allergies          || "",
        chronicDiseases:   patient.chronicDiseases    || "",
        currentMedication: patient.currentMedication  || "",
        vaccines:          patient.vaccines            || "",
        familyHistory:     patient.familyHistory       || "",
        patientStatus:     patient.patientStatus       || "ACTIV",
    });

    const ch = e => setForm({ ...form, [e.target.name]: e.target.value });

    function save() {
        // TODO: await api.put("/api/patient_medical_info", form)
        showToast("Date medicale salvate! (mock)");
        setEdit(false);
        onSaved();
    }

    return (
        <div className={styles.section}>
            <div className={styles.sectHead}>
                <h3 className={styles.sectTitle}>Date medicale</h3>
                {!edit && <button className={styles.btnEdit} onClick={() => setEdit(true)}>✎ Editează</button>}
            </div>
            {!edit ? (
                <div className={styles.infoGrid}>
                    <Info label="Grupă sânge"        value={patient.bloodGroupRh} />
                    <Info label="Înălțime / Greutate" value={`${patient.height || "—"} cm / ${patient.weight || "—"} kg`} />
                    <Info label="Alergii"             value={patient.allergies} />
                    <Info label="Boli cronice"        value={patient.chronicDiseases} />
                    <Info label="Medicație curentă"   value={patient.currentMedication} />
                    <Info label="Vaccinuri"           value={patient.vaccines} />
                    <Info label="Istoric familial"    value={patient.familyHistory} span={2} />
                </div>
            ) : (
                <div className={styles.form}>
                    <Field    label="Grupă sânge + RH"   name="bloodGroupRh"      value={form.bloodGroupRh}      onChange={ch} placeholder="ex: A+" />
                    <Textarea label="Alergii"             name="allergies"          value={form.allergies}          onChange={ch} />
                    <Textarea label="Boli cronice"        name="chronicDiseases"    value={form.chronicDiseases}    onChange={ch} />
                    <Textarea label="Medicație curentă"   name="currentMedication"  value={form.currentMedication}  onChange={ch} />
                    <Textarea label="Vaccinuri"           name="vaccines"            value={form.vaccines}            onChange={ch} />
                    <Textarea label="Istoric familial"    name="familyHistory"       value={form.familyHistory}       onChange={ch} />
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
// TODO: replace with api.put("/api/patient_status", { cnpPatient: cnp, newStatus: "TRANSFERAT" })
// TODO: cand conectezi backend-ul, adauga { cnp, onDone, showToast } si trimite:
// await api.put("/api/patient_status", { cnpPatient: cnp, newStatus: "TRANSFERAT" })
function BtnTransfer({ onDone, showToast }) {
    // _cnp este folosit cand se conecteaza backend-ul:
    // await api.put("/api/patient_status", { cnpPatient: _cnp, newStatus: "TRANSFERAT" })
    function transfer() {
        if (!window.confirm("Marchezi pacientul ca TRANSFERAT. Ești sigur?")) return;
        showToast("Pacient marcat ca transferat! (mock)");
        onDone();
    }
    return (
        <button className={styles.btnDanger} onClick={transfer} style={{ marginLeft: "auto" }}>
            Transferă
        </button>
    );
}

// ─── Card consultatie ─────────────────────────────────────────────────────────
function ConsultCard({ c }) {
    return (
        <div className={styles.consultCard}>
            <div className={styles.consultTop}>
                <span className={styles.consultDate}>{c.data ?? "—"}</span>
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
// TODO: submit → api.post("/api/consult/add", form)
function FormAddConsult({ cnp, name, onSuccess, onCancel }) {
    const [form, setForm] = useState({ cnp, simptome: "", diagnostic: "", tratament: "", alteDetalii: "" });
    const ch = e => setForm({ ...form, [e.target.name]: e.target.value });

    function submit(e) {
        e.preventDefault();
        // TODO: await api.post("/api/consult/add", form)
        onSuccess();
    }

    return (
        <div className={styles.formPanel}>
            <h2 className={styles.panelTitle}>Consultație nouă</h2>
            <p className={styles.panelSub}>Pacient: <strong>{name}</strong></p>
            <form onSubmit={submit} className={styles.form}>
                <Textarea label="Simptome / Motivul vizitei *" name="simptome"    value={form.simptome}    onChange={ch} required />
                <Field    label="Diagnostic *"                 name="diagnostic"  value={form.diagnostic}  onChange={ch} required />
                <Textarea label="Tratament / Recomandare *"    name="tratament"   value={form.tratament}   onChange={ch} required />
                <Textarea label="Alte detalii (opțional)"      name="alteDetalii" value={form.alteDetalii} onChange={ch} />
                <div className={styles.actions}>
                    <button type="submit"  className={styles.btnPrimary}>Salvează consultație</button>
                    <button type="button" className={styles.btnSecondary} onClick={onCancel}>Anulează</button>
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
            <input name={name} value={value} onChange={onChange}
                   type={type} placeholder={placeholder}
                   required={required} maxLength={maxLength} />
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
