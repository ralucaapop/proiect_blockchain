import API from "../api/axios";

// 1. Funcția de login
export const loginUser = async (cnp, password) => {
    return await API.post('auth/login', { cnp, password });
};

// 2. Funcția de parsare JWT
export const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

// 3. Funcția isTokenValid
export const isTokenValid = (token) => {
    if (!token) return false;

    const decoded = parseJwt(token);
    if (!decoded) return false;

    // JWT-ul are câmpul "exp" care reprezintă data expirării în secunde
    // Verificăm dacă timpul actual (în milisecunde) este mai mic decât timpul de expirare (înmulțit cu 1000)
    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;
};