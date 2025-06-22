<template>
    <form @submit.prevent="loginUser">
        <input v-model="email" placeholder="Email" />
        <input v-model="password" type="password" placeholder="Mot de passe" />
        <button type="submit">Connexion</button>
    </form>
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

const loginUser = async () => {
    try {
        const res = await api.post('/login_check', {
            email: email.value,
            password: password.value
        })
        const token = res.data.token
        api.defaults.headers.common['Authorization'] = 'Bearer ' + token
        login(token)
        await router.push('/produit')
    } catch (e) {
        modal.value?.show('Erreur', 'Identifiants invalides.')
        console.error(e)
    }
}
</script>
