<template>
    <div class="container mt-5">
        <h2 class="mb-4">Tous les achats</h2>

        <div class="row mb-4 g-3">
            <!-- Filtre utilisateur -->
            <div class="col-md-4 position-relative">
                <label class="form-label">Utilisateur</label>
                <div class="position-relative">
                    <select class="form-select pe-5" v-model="filters.userId" @change="loadAchats">
                        <option value="">Tous</option>
                        <option v-for="u in users" :key="u.id" :value="u.id">
                            {{ u.prenom }} {{ u.nom }}
                        </option>
                    </select>
                    <button v-if="filters.userId"
                        class="btn btn-sm btn-light position-absolute top-50 end-0 translate-middle-y me-2"
                        @click="clearFilter('userId')">&times;</button>
                </div>
            </div>

            <!-- Filtre date -->
            <div class="col-md-4 position-relative">
                <label class="form-label">Date</label>
                <input type="date" class="form-control pe-5" v-model="filters.date" @change="loadAchats" />
                <button v-if="filters.date"
                    class="btn btn-sm btn-light position-absolute top-50 end-0 translate-middle-y me-2"
                    @click="clearFilter('date')">&times;</button>
            </div>

            <!-- Filtre statut -->
            <div class="col-md-4 position-relative">
                <label class="form-label">Statut</label>
                <select class="form-select pe-5" v-model="filters.statut" @change="loadAchats">
                    <option value="">Tous</option>
                    <option v-for="opt in statutOptions" :key="opt" :value="opt">{{ opt }}</option>
                </select>
                <button v-if="filters.statut"
                    class="btn btn-sm btn-light position-absolute top-50 end-0 translate-middle-y me-2"
                    @click="clearFilter('statut')">&times;</button>
            </div>
        </div>

        <div v-if="loading" class="text-center">
            <div class="loader"></div>
        </div>

        <div v-else-if="achats.length === 0" class="alert alert-info">
            Aucun achat trouvé.
        </div>

        <div v-else>
            <div class="row">
                <div class="col-md-6 mb-4" v-for="achat in achats" :key="achat.id">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Achat n°{{ achat.id }}</h5>
                            <p class="card-text">
                                Pour : <strong>{{ achat.user.prenom }} {{ achat.user.nom }}</strong><br />
                                Email : {{ achat.user.email }}<br />
                                Réservé le : {{ formatDate(achat.dateAchat) }}<br />
                                Produits : <strong>{{ achat.produit.titre }}</strong> <br>
                                Quantité : {{ achat.quantite }}
                            <ul>
                                <!-- <li v-for="item in achat.lignes" :key="item.id">
                                    {{ item.produit.titre }} x {{ item.quantite }} — {{ item.produit.prix }} €
                                </li> -->
                            </ul>
                            Total : <strong>{{ achat.prixTotal }} €</strong><br />
                            Statut :
                            <span :class="getBadgeClass(achat.statut)">
                                {{ achat.statut }}
                            </span>
                            </p>

                            <div class="mt-3">
                                <label class="form-label me-2">Changer le statut :</label>
                                <select class="form-select d-inline-block w-auto" v-model="achat.statut"
                                    @change="updateStatut(achat)">
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
import api from '@/services/api'

const achats = ref([])
const loading = ref(true)
const users = ref([])
const statutOptions = ['en_attente', 'confirmee', 'annule']
const filters = ref({
    userId: '',
    date: '',
    statut: ''
})

onMounted(async () => {
    try {
        fetchUsers()
        loadAchats()
        const res = await api.get('/achats')
        achats.value = res.data
    } catch (e) {
        console.error('Erreur lors du chargement des achats', e)
    } finally {
        loading.value = false
    }
})

function clearFilter(field) {
    filters.value[field] = ''
    loadAchats()
}

async function loadAchats() {
    loading.value = true
    try {
        const params = new URLSearchParams()
        if (filters.value.userId) params.append('userId', filters.value.userId)
        if (filters.value.date) params.append('date', filters.value.date)
        if (filters.value.statut) params.append('statut', filters.value.statut)

        const res = await api.get('/achats?' + params.toString())
        achats.value = res.data
    } catch (e) {
        console.error('Erreur chargement achats', e)
    } finally {
        loading.value = false
    }
}

async function fetchUsers() {
    try {
        const res = await api.get('/admin/user')
        users.value = res.data
    } catch (e) {
        console.error('Erreur chargement utilisateurs', e)
    }
}

async function updateStatut(achat) {
    try {
        await api.patch(`/achats/${achat.id}/statut`, {
            statut: achat.statut
        })
    } catch (e) {
        console.error('Erreur mise à jour statut', e)
        alert('Erreur lors de la mise à jour du statut')
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

function getBadgeClass(statut) {
    switch (statut) {
        case 'en_attente':
            return 'badge bg-warning text-dark'
        case 'confirmee':
            return 'badge bg-success'
        case 'annule':
            return 'badge bg-danger'
        default:
            return 'badge bg-secondary'
    }
}
</script>
