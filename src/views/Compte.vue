<template>
    <div class="container mt-5">
        <h2>Mon compte</h2>

        <div v-if="loading">
            <div class="loader"></div>
        </div>
        <div v-else>
            <p><strong>Nom :</strong> {{ user.nom }}</p>
            <p><strong>Prénom :</strong> {{ user.prenom }}</p>
            <p><strong>Email :</strong> {{ user.email }}</p>
            <p><strong>Téléphone :</strong>
                {{ user.telephone ? formatPhoneNumber(user.telephone) : 'Non renseigné' }}
            </p>
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

// Formate un numéro "696123456" en "06 96 12 34 56"
function formatPhoneNumber(number) {
    if (!number) return 'Non renseigné'

    // S'assurer que c’est bien une chaîne
    number = number.toString()

    // Si le numéro commence par "6" et a 9 chiffres, on suppose que c’est un numéro mobile DOM
    if (number.length === 9 && number.startsWith('6')) {
        number = '0' + number
    }

    // Regrouper en blocs de 2 chiffres
    return number.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')
}

</script>
