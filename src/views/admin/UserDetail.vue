<template>
    <div class="container mt-5" v-if="user">
        <h2>Détail utilisateur</h2>
        <p><strong>Nom :</strong> {{ user.nom }}</p>
        <p><strong>Prénom :</strong> {{ user.prenom }}</p>
        <p><strong>Email :</strong> {{ user.email }}</p>
        <p><strong>Téléphone :</strong> {{ formatPhoneNumber(user.telephone) || 'Non renseigné' }}</p>
        <p><strong>Inscrit le :</strong> {{ formatDate(user.created_at) }}</p>

        <hr>
        <h4>Statistiques</h4>
        <p><strong>Nombre de réservations :</strong> {{ user.nb_reservations }}</p>
        <p><strong>Nombre d’achats :</strong> {{ user.nb_achats }}</p>
    </div>
    <div v-else class="container mt-5">
        <div class="loader"></div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const user = ref(null)

onMounted(async () => {
    const id = route.params.id
    try {
        const res = await api.get(`admin/user/${id}`)
        user.value = res.data
    } catch (e) {
        console.error('Erreur lors du chargement', e)
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
