<template>
    <div class="container mt-5">
        <h2 class="mb-4">Mes réservations</h2>

        <div v-if="loading" class="text-center">Chargement...</div>
        <div v-else-if="reservations.length === 0" class="alert alert-info">Aucune réservation trouvée.</div>
        <div v-else>
            <div class="row">
                <div class="col-md-6 mb-4" v-for="reservation in reservations" :key="reservation.id">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">{{ reservation.prestation?.titre ?? 'Prestation inconnue' }}</h5>
                            <p class="card-text">
                                Date : {{ formatDate(reservation.date) }}<br />
                                De {{ formatTime(reservation.startTime) }} à {{ formatTime(reservation.endTime) }}<br />
                                Réservé le : {{ formatDateTime(reservation.created_at) }}<br />
                                À : {{ reservation.prestation.prix }}€<br />
                                Statut :
                                <span :class="getBadgeClass(reservation.statut)">
                                    {{ reservation.statut }}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api.js'

// État
const reservations = ref([])
const loading = ref(true)

// Récupération des réservations
onMounted(async () => {
    try {
        const res = await api.get('/reservation/mine') // Assure-toi que cette route existe
        reservations.value = res.data
    } catch (e) {
        console.error('Erreur lors du chargement des réservations', e)
    } finally {
        loading.value = false
    }
})

// Formatage de la date
const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })
}

// Formatage de l’heure
const formatTime = (timeStr) => {
    if (!timeStr) return ''
    const date = new Date(timeStr)
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

// Date + heure
const formatDateTime = (str) => {
    const dt = new Date(str)
    return dt.toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

// Badge en fonction du statut
const getBadgeClass = (statut) => {
    switch (statut) {
        case 'en_attente':
            return 'badge bg-warning text-dark'
        case 'confirmé':
            return 'badge bg-success'
        case 'annulé':
            return 'badge bg-danger'
        default:
            return 'badge bg-secondary'
    }
}
</script>
