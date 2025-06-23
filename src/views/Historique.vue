<template>
    <div class="container mt-5">
        <h2 class="mb-4">Historique de mes achats</h2>

        <div v-if="loading" class="text-center">Chargement...</div>
        <div v-else-if="achats.length === 0" class="alert alert-info">Aucun achat trouvé.</div>
        <div v-else>
            <div class="row">
                <div class="col-md-6 mb-4" v-for="achat in achats" :key="achat.id">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">{{ achat.produit?.titre ?? 'Produit inconnu' }}</h5>
                            <p class="card-text">
                                Quantité : {{ achat.quantite }}<br />
                                Prix total : <strong>{{ achat.prixTotal.toFixed(2) }} €</strong><br />
                                Statut : <span :class="getBadgeClass(achat.statut)">{{ achat.statut }}</span><br />
                                Acheté le : {{ formatDate(achat.dateAchat) }}
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

// 🔁 État
const achats = ref([])
const loading = ref(true)

// 📦 Chargement des achats
onMounted(async () => {
    try {
        const res = await api.get('/achats/mine')
        achats.value = res.data
    } catch (e) {
        console.error('Erreur lors du chargement des achats', e)
    } finally {
        loading.value = false
    }
})

// 📅 Formatage de la date
const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// 🎨 Badge de statut
const getBadgeClass = (statut) => {
    switch (statut) {
        case 'en_attente':
            return 'badge bg-warning text-dark'
        case 'livré':
            return 'badge bg-success'
        case 'annulé':
            return 'badge bg-danger'
        default:
            return 'badge bg-secondary'
    }
}
</script>
