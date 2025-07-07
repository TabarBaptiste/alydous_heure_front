<template>
    <div class="container mt-5">
        <h2 class="mb-4">Gestion des disponibilités</h2>

        <!-- Bouton d'ajout -->
        <button class="btn btn-primary mb-3" @click="openModal()">
            + Ajouter une disponibilité
        </button>

        <div v-if="loading" class="text-center">
            <div class="loader"></div>
        </div>
        <!-- Tableau des disponibilités -->
        <table v-else class="table table-striped">
            <thead>
                <tr>
                    <th>Jour</th>
                    <th>Heure début</th>
                    <th>Heure fin</th>
                    <th>Disponible</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="dispo in dispos" :key="dispo.id">
                    <td>{{ dispo.jour }}</td>
                    <td>{{ dispo.start }}</td>
                    <td>{{ dispo.end }}</td>
                    <td>
                        <span class="badge" :class="dispo.is_disponible ? 'bg-success' : 'bg-secondary'">
                            {{ dispo.is_disponible ? 'Oui' : 'Non' }}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-outline-secondary me-2"
                            @click="openModal(dispo)">Modifier</button>
                        <button class="btn btn-sm btn-outline-danger" @click="deleteDispo(dispo.id)">Supprimer</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Modal d'ajout / édition -->
        <div class="modal fade" tabindex="-1" ref="modal" id="dispoModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ editing ? 'Modifier' : 'Ajouter' }} une disponibilité</h5>
                        <button type="button" class="btn-close" @click="closeModal()"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="saveDispo">
                            <div class="mb-3">
                                <label class="form-label">Jour</label>
                                <input v-model="form.jour" class="form-control" required disabled />
                                <!-- <select v-model="form.jour" class="form-select" required>
                                    <option value="Lundi">Lundi</option>
                                    <option value="Mardi">Mardi</option>
                                    <option value="Mercredi">Mercredi</option>
                                    <option value="Jeudi">Jeudi</option>
                                    <option value="Vendredi">Vendredi</option>
                                    <option value="Samedi">Samedi</option>
                                    <option value="Dimanche">Dimanche</option>
                                </select> -->
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Heure début</label>
                                <input type="time" v-model="form.start" class="form-control" required />
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Heure fin</label>
                                <input type="time" v-model="form.end" class="form-control" required />
                            </div>
                            <div class="mb-3 form-check">
                                <input type="checkbox" v-model="form.is_disponible" class="form-check-input"
                                    id="isDisponible" />
                                <label class="form-check-label" for="isDisponible">Disponible</label>
                            </div>
                            <button type="submit" class="btn btn-primary">{{ editing ? 'Enregistrer' : 'Ajouter'
                            }}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { Modal } from 'bootstrap'

const dispos = ref([])
const loading = ref(false)
const editing = ref(false)
const currentId = ref(null)
const form = ref({ jour: 'Lundi', start: '', end: '', is_disponible: 1 })
let bsModal = null

// Charger les dispos
async function fetchDispos() {
    loading.value = true
    try {
        const res = await api.get('/disponibilites/all')
        // Transformer le format renvoyé (groupé par jour) en tableau plat
        const flat = []
        Object.entries(res.data).forEach(([jour, slots]) => {
            slots.forEach(s => flat.push({ id: s.id, jour, start: s.start, end: s.end, is_disponible: s.is_disponible }))
        })
        dispos.value = flat
        console.log("res :", res);
    } catch (e) {
        console.error('Erreur chargement disponibilités', e)
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    await fetchDispos()
    bsModal = new Modal(document.getElementById('dispoModal'))
})

function openModal(dispo = null) {
    editing.value = !!dispo
    if (dispo) {
        currentId.value = dispo.id
        form.value = {
            ...dispo,
            is_disponible: !!dispo.is_disponible
        }
    } else {
        currentId.value = null
        form.value = { jour: 'Lundi', start: '', end: '', is_disponible: 1 }
    }
    bsModal.show()
}

function closeModal() {
    bsModal.hide()
}

async function saveDispo() {
    try {
        if (editing.value) {
            await api.put(`/disponibilites/${currentId.value}`, {
                jour: form.value.jour,
                startTime: form.value.start,
                endTime: form.value.end,
                isDisponible: form.value.is_disponible
            })
        } else {
            await api.post('/disponibilites', {
                jour: form.value.jour,
                start: form.value.start,
                end: form.value.end,
                isDisponible: form.value.is_disponible
            })
        }
        await fetchDispos()
        closeModal()
    } catch (e) {
        console.error('Erreur sauvegarde dispo', e)
        alert('Erreur lors de la sauvegarde')
    }
}

async function deleteDispo(id) {
    if (!confirm('Confirmer la suppression ?')) return
    try {
        await api.delete(`/disponibilites/${id}`)
        await fetchDispos()
    } catch (e) {
        console.error('Erreur suppression dispo', e)
        alert('Impossible de supprimer')
    }
}
</script>

<style scoped>
.table>tbody>tr>td {
    vertical-align: middle;
}

.loader {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    animation: spin 1s linear infinite;
    margin: auto;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
