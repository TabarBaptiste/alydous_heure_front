<template>
    <div class="d-flex justify-content-center align-items-center vh-100">
        <div class="card p-4 shadow-sm" style="max-width: 400px; width: 100%;">
            <div v-if="successMessage" class="alert alert-success">
                {{ successMessage }}
            </div>
            <div v-if="errorMessage" class="alert alert-danger">
                {{ errorMessage }}
            </div>
            <h3 class="card-title text-center mb-4">Inscription</h3>
            <form @submit.prevent="register" novalidate>
                <div class="mb-3">
                    <label class="form-label">Adresse email</label>
                    <input v-model="email" type="email" class="form-control" required :disabled="loading" />
                </div>
                <div class="mb-3">
                    <label class="form-label">Mot de passe</label>
                    <input v-model="password" type="password" class="form-control" required :disabled="loading" />
                </div>
                <div class="mb-3">
                    <label class="form-label">Nom</label>
                    <input v-model="nom" type="text" class="form-control" required :disabled="loading" />
                </div>
                <div class="mb-3">
                    <label class="form-label">Prénom</label>
                    <input v-model="prenom" type="text" class="form-control" required :disabled="loading" />
                </div>
                <div class="mb-3">
                    <label class="form-label">Téléphone</label>
                    <input v-model="telephone" type="tel" class="form-control" placeholder="06..."
                        :disabled="loading" />
                </div>
                <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                    {{ loading ? 'Chargement...' : "S'inscrire" }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import { useAuth } from '../composables/useAuth'

const email = ref('')
const password = ref('')
const nom = ref('')
const prenom = ref('')
const telephone = ref('')

const errorMessage = ref('')
const successMessage = ref('')
const loading = ref(false)

const router = useRouter()
const { login } = useAuth()

watch([errorMessage, successMessage], ([err, success]) => {
    if (err || success) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
})

const register = async () => {
    errorMessage.value = ''
    successMessage.value = ''
    loading.value = true

    try {
        const res = await api.post('/register', {
            email: email.value,
            password: password.value,
            nom: nom.value,
            prenom: prenom.value,
            telephone: telephone.value
        })

        // Si l’inscription réussit, se connecter automatiquement
        const loginRes = await api.post('/login_check', {
            email: email.value,
            password: password.value
        })
        const token = loginRes.data.token
        api.defaults.headers.common['Authorization'] = 'Bearer ' + token
        login(token)

        successMessage.value = 'Inscription réussie ! Redirection en cours...'
        setTimeout(() => router.push('/'), 4000)
    } catch (err) {
        console.error(err)
        if (err.response?.status === 409) {
            errorMessage.value = "Cet email est déjà utilisé. Veuillez vous connecter."
            setTimeout(() => router.push('/login'), 4000)
        } else {
            errorMessage.value = "Erreur lors de l'inscription. Veuillez réessayer."
        }
    } finally {
        loading.value = false
    }
}
</script>
