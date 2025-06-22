<template>
    <form @submit.prevent="register">
        <input v-model="email" placeholder="Email" />
        <input v-model="password" placeholder="Mot de passe" type="password" />
        <input v-model="nom" placeholder="Nom" />
        <input v-model="prenom" placeholder="Prénom" />
        <button type="submit">S'inscrire</button>
    </form>
</template>

<script setup>
import { ref } from 'vue'
import api from '../services/api'

const email = ref('')
const password = ref('')
const nom = ref('')
const prenom = ref('')

const register = async () => {
    try {
        await api.post('/register', {
            email: email.value,
            password: password.value,
            nom: nom.value,
            prenom: prenom.value
        })
        alert("Inscription réussie")
    } catch (err) {
        console.error(err)
    }
}
</script>
