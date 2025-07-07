<template>
    <div class="container mt-5">
        <h2 class="mb-4">Mes réservations</h2>

        <div v-if="loading" class="text-center">
            <div class="loader"></div>
        </div>
        <div v-else-if="reservations.length === 0" class="alert alert-info">
            Aucune réservation trouvée.
        </div>
        <div v-else>
            <div class="row">
                <div class="col-md-6 mb-4" v-for="reservation in reservations" :key="reservation.id">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">
                                {{ reservation.prestation?.titre ?? 'Prestation inconnue' }}
                            </h5>
                            <p class="card-text">
                                Pour : {{ reservation.user.prenom }} {{ reservation.user.nom }}<br />
                                Date : {{ formatDate(reservation.date) }}<br />
                                De {{ formatTime(reservation.startTime) }}
                                à {{ formatTime(reservation.endTime) }}<br />
                                Réservé le : {{ formatDateTime(reservation.created_at) }}<br />
                                À : {{ reservation.prestation.prix }} €<br />
                                Statut :
                                <span :class="getBadgeClass(reservation.statut)">
                                    {{ reservation.statut }}
                                </span>
                            </p>

                            <!-- Si admin, on affiche le sélecteur de statut -->
                            <div v-if="isAdmin" class="mt-3">
                                <label class="form-label me-2">Changer le statut :</label>
                                <select class="form-select d-inline-block w-auto" v-model="reservation.statut"
                                    @change="updateStatut(reservation)">
                                    <option v-for="opt in statutOptions" :key="opt" :value="opt">
                                        {{ opt }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../services/api.js'
import { useAuth } from '../composables/useAuth'

// récupération de l’authentification pour savoir qui est admin
const { isLoggedIn, user } = useAuth()
const isAdmin = computed(
    () => isLoggedIn.value && user.value?.roles?.includes('ROLE_ADMIN')
)

const reservations = ref([])
const loading = ref(true)

// options possibles tirées de l’enum Statut
const statutOptions = ['en_attente', 'confirmee', 'annulee']

onMounted(async () => {
    try {
        const res = await api.get('/reservation/mine')
        reservations.value = res.data
        console.log("reservations :", reservations.value);
    } catch (e) {
        console.error('Erreur lors du chargement des réservations', e)
    } finally {
        loading.value = false
    }
})

// met à jour côté backend et côté UI la réservation
async function updateStatut(reservation) {
    try {
        await api.patch(`/reservation/${reservation.id}/statut`, {
            statut: reservation.statut
        })
        // facultatif : tu peux afficher un petit toast ici
    } catch (e) {
        console.error('Erreur mise à jour statut', e)
        alert('Impossible de mettre à jour le statut')
    }
}

// formatage de la date en « lundi 01/01/2025 »
const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })
}

// format heure « 09:00 »
const formatTime = (timeStr) => {
    if (!timeStr) return ''
    const d = new Date(timeStr)
    return d.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    })
}

// date+heure de création
const formatDateTime = (str) => {
    const d = new Date(str)
    return d.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// classes pour badge
const getBadgeClass = (statut) => {
    switch (statut) {
        case 'en_attente':
            return 'badge bg-warning text-dark'
        case 'confirmee':
            return 'badge bg-success'
        case 'annulee':
            return 'badge bg-danger'
        default:
            return 'badge bg-secondary'
    }
}
</script>
