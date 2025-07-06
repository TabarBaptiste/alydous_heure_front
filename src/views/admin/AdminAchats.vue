<template>
    <div class="container mt-5">
        <h2 class="mb-4">Tous les achats</h2>

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
const statutOptions = ['en_attente', 'confirmee', 'annule']

onMounted(async () => {
    try {
        const res = await api.get('/achats')
        achats.value = res.data
    } catch (e) {
        console.error('Erreur lors du chargement des achats', e)
    } finally {
        loading.value = false
    }
})

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
