<template>
    <div class="d-flex justify-content-center align-items-center vh-100">
        <div class="card p-4 shadow-sm" style="max-width: 400px; width: 100%;">
            <div v-if="errorMessage" class="alert alert-danger mb-3">
                {{ errorMessage }}
            </div>
            <h3 class="card-title text-center mb-4">Connexion</h3>
            <form @submit.prevent="loginUser" novalidate>
                <div class="mb-3">
                    <label for="email" class="form-label">Adresse email</label>
                    <input id="email" v-model="email" type="email" class="form-control" placeholder="name@example.com"
                        required @input="errorMessage = ''" :disabled="loading" />
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Mot de passe</label>
                    <input id="password" v-model="password" type="password" class="form-control" placeholder="••••••••"
                        required @input="errorMessage = ''" :disabled="loading" />
                </div>
                <div v-if="loading" class="d-flex justify-content-center">
                    <div class="loader"></div>
                </div>
                <button v-else type="submit" class="btn btn-primary w-100">
                    Se connecter
                </button>

            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import { useAuth } from '../composables/useAuth'

const email = ref('')
const password = ref('')
const router = useRouter()
const modal = inject('modal')
const { login } = useAuth()
const errorMessage = ref('')
const loading = ref(false)

const loginUser = async () => {
    loading.value = true
    try {
        const res = await api.post('/login_check', {
            email: email.value,
            password: password.value
        })
        const token = res.data.token
        api.defaults.headers.common['Authorization'] = 'Bearer ' + token
        login(token)
        await router.push('/')
    } catch (e) {
        errorMessage.value = "Identifiants invalides ou erreur de connexion."
        console.error(e)
    } finally {
        loading.value = false
    }
}
</script>