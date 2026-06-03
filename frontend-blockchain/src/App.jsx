import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home  from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import Contact from "./components/Contact.jsx";

// Componentele noi
import DoctorBoard      from "./components/DoctorBoard.jsx";
import PatientsPage     from "./components/PatientsPage.jsx";
import AppointmentsPage from "./components/AppointmentsPage.jsx";
import PatientDashboard from "./components/PatientDashboard.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Pagini existente */}
                <Route path="/"      element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/contact" element={<Contact />} />

                {/* Pagini medic */}
                <Route path="/doctor"             element={<DoctorBoard />} />
                <Route path="/doctor/pacienti"    element={<PatientsPage />} />
                <Route path="/doctor/consultatii" element={<AppointmentsPage />} />

                {/* Pagini pacient */}
                <Route path="/pacient/profil" element={<PatientDashboard />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;