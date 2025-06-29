import { ref, computed } from 'vue'

// 🔍 Fonction pour décoder le token
function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
                .join('')
        )
        return JSON.parse(jsonPayload)
    } catch (e) {
        return null
    }
}

// 🔁 Vérifie si le token est encore valide
function isTokenValid(token: string) {
    const payload = parseJwt(token)
    if (!payload || !payload.exp) return false
    const now = Date.now() / 1000
    return payload.exp > now
}

// 📦 État
const storedToken = localStorage.getItem('token')
const isLoggedIn = ref(storedToken && isTokenValid(storedToken))

// 🔑 Utilisateur décodé
const user = ref(null)
if (storedToken && isTokenValid(storedToken)) {
    user.value = parseJwt(storedToken)
}

export function useAuth() {
    function login(token: string) {
        localStorage.setItem('token', token)
        isLoggedIn.value = true
        user.value = parseJwt(token)
    }

    function logout() {
        localStorage.removeItem('token')
        isLoggedIn.value = false
        user.value = null
    }

    function checkTokenValidity() {
        const token = localStorage.getItem('token')
        if (!token || !isTokenValid(token)) {
            logout()
        }
    }

    return {
        isLoggedIn,
        user, // ← maintenant tu peux l'importer
        login,
        logout,
        checkTokenValidity
    }
}