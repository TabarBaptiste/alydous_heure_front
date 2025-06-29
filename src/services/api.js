import axios from 'axios'

const api = axios.create({
    // baseURL: 'http://localhost:8000/api',
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

// Ajoute automatiquement le token si présent
const token = localStorage.getItem('token')
if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

// Intercepteur pour les erreurs
api.interceptors.response.use(
    response => response,
    error => {
        if (
            error.response &&
            error.response.status === 401 &&
            error.response.data.message === 'Expired JWT Token'
        ) {
            // 🔴 Token expiré => suppression + redirection ou affichage d’un message
            console.warn('Token expiré : suppression...')
            localStorage.removeItem('token')
            delete api.defaults.headers.common['Authorization']
            // 👉 Optionnel : rediriger vers login ou afficher une modale
        }

        return Promise.reject(error)
    }
)

export default api
