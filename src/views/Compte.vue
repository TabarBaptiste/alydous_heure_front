<template>
    <div class="container mt-5">
        <h2>Mon compte</h2>

        <div v-if="loading">Chargement...</div>
        <div v-else>
            <p><strong>Nom :</strong> {{ user.nom }}</p>
            <p><strong>Prénom :</strong> {{ user.prenom }}</p>
            <p><strong>Email :</strong> {{ user.email }}</p>
            <p><strong>Téléphone :</strong> {{ user.telephone ?? 'Non renseigné' }}</p>
            <p><strong>Membre depuis :</strong> {{ formatDate(user.created_at) }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const user = ref({})
const loading = ref(true)

onMounted(async () => {
    try {
        const res = await api.get('/user/me')
        user.value = res.data
    } catch (e) {
        console.error('Erreur lors du chargement des infos utilisateur', e)
    } finally {
        loading.value = false
    }
})

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}
</script>
