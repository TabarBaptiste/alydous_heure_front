<template>
    <div class="container mt-5">
        <h2 class="mb-4">Toutes les réservations</h2>

        <!-- ✨ Filtres -->
        <div class="row mb-4 g-3">
            <!-- Filtre utilisateur -->
            <div class="col-md-4 position-relative">
                <label class="form-label">Utilisateur</label>
                <div class="position-relative">
                    <select class="form-select pe-5" v-model="filters.userId" @change="loadReservations">
                        <option value="">Tous</option>
                        <option v-for="u in users" :key="u.id" :value="u.id">
                            {{ u.prenom }} {{ u.nom }}
                        </option>
                    </select>
                    <button v-if="filters.userId" type="button"
                        class="btn btn-sm btn-light position-absolute top-50 end-0 translate-middle-y me-2"
                        @click="clearFilter('userId')" style="z-index: 10">
                        &times;
                    </button>
                </div>
            </div>

            <!-- Filtre date -->
            <div class="col-md-4 position-relative">
                <label class="form-label">Date</label>
                <div class="position-relative">
                    <input type="date" class="form-control pe-5" v-model="filters.date" @change="loadReservations" />
                    <button v-if="filters.date" type="button"
                        class="btn btn-sm btn-light position-absolute top-50 end-0 translate-middle-y me-2"
                        @click="clearFilter('date')" style="z-index: 10">
                        &times;
                    </button>
                </div>
            </div>

            <!-- Filtre statut -->
            <div class="col-md-4 position-relative">
                <label class="form-label">Statut</label>
                <div class="position-relative">
                    <select class="form-select pe-5" v-model="filters.statut" @change="loadReservations">
                        <option value="">Tous</option>
                        <option v-for="opt in statutOptions" :key="opt" :value="opt">
                            {{ opt }}
                        </option>
                    </select>
                    <button v-if="filters.statut" type="button"
                        class="btn btn-sm btn-light position-absolute top-50 end-0 translate-middle-y me-2"
                        @click="clearFilter('statut')" style="z-index: 10">
                        &times;
                    </button>
                </div>
            </div>
        </div>


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
                                Email : {{ reservation.user.email }}<br />
                                Date : {{ formatDate(reservation.date) }}<br />
                                De {{ formatTime(reservation.startTime) }} à {{ formatTime(reservation.endTime) }}<br />
                                Statut :
                                <span :class="getBadgeClass(reservation.statut)">
                                    {{ reservation.statut }}
                                </span>
                            </p>

                            <div class="mt-3">
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
import { ref, onMounted } from 'vue'
import api from '@/services/api.js'

const reservations = ref([])
const users = ref([])
const loading = ref(true)
const statutOptions = ['en_attente', 'confirmee', 'annulee']

const filters = ref({
    userId: '',
    date: '',
    statut: ''
})

async function loadReservations() {
    loading.value = true
    try {
        const params = {}
        if (filters.value.userId) params.userId = filters.value.userId
        if (filters.value.date) params.date = filters.value.date
        if (filters.value.statut) params.statut = filters.value.statut

        const res = await api.get('/reservation', { params })
        reservations.value = res.data
    } catch (e) {
        console.error('Erreur lors du chargement des réservations', e)
    } finally {
        loading.value = false
    }
}

async function loadUsers() {
    // supposons que tu as un endpoint /user/admin pour les admins
    const res = await api.get('/admin/user')
    users.value = res.data
}

function clearFilter(field) {
    filters.value[field] = ''
    loadReservations()
}

onMounted(async () => {
    try {
        await loadUsers()
        await loadReservations()
        const res = await api.get('/reservation')
        reservations.value = res.data
    } catch (e) {
        console.error('Erreur lors du chargement des réservations', e)
    } finally {
        loading.value = false
    }
})

async function updateStatut(reservation) {
    try {
        await api.patch(`/reservation/${reservation.id}/statut`, {
            statut: reservation.statut
        })
    } catch (e) {
        console.error('Erreur mise à jour statut', e)
        alert("Erreur lors de la mise à jour du statut")
    }
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

function formatTime(timeStr) {
    return new Date(timeStr).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    })
}

function getBadgeClass(statut) {
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
