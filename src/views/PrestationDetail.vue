<template>
    <div class="container mt-5" v-if="prestation">
        <h2 class="mb-3">{{ prestation.titre }}</h2>
        <p class="lead">{{ prestation.description }}</p>
        <p><strong>Prix :</strong> {{ prestation.prix }} €</p>
        <p><strong>Durée :</strong> {{ prestation.duree }} min</p>

        <hr />

        <div v-if="isLoggedIn">
            <h4>Réserver cette prestation</h4>
            <div v-if="message" class="mt-3 alert" :class="messageType">{{ message }}</div>
            <div class="row mb-3">
                <div class="col-md-6">
                    <label for="date" class="form-label">Date</label>
                    <input id="date" type="date" class="form-control" v-model="date" />
                </div>
                <div class="col-md-6">
                    <label for="heure" class="form-label">Heure</label>
                    <input id="heure" type="time" class="form-control" v-model="startTime" />
                </div>
            </div>
            <button class="btn btn-primary" @click="reserver" :disabled="loading">
                {{ loading ? 'Réservation...' : 'Réserver' }}
            </button>
        </div>

        <div v-else class="alert alert-warning mt-4">
            Vous devez être connecté pour réserver cette prestation.
        </div>
    </div>

    <div v-else class="container mt-5">Chargement...</div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api.js'
import { useAuth } from '../composables/useAuth'

const route = useRoute()
const prestation = ref(null)
const date = ref('')
const startTime = ref('')
const loading = ref(false)
const message = ref('')
const messageType = ref('')
const { isLoggedIn } = useAuth()

onMounted(async () => {
    try {
        const id = route.params.id
        const res = await api.get(`/prestation/${id}`)
        prestation.value = res.data
    } catch (error) {
        console.error('Erreur lors du chargement de la prestation', error)
    }
})

const reserver = async () => {
    if (!date.value || !startTime.value) {
        message.value = 'Veuillez remplir la date et l\'heure.'
        messageType.value = 'alert-danger'
        return
    }

    loading.value = true
    try {
        await api.post('/reservation', {
            prestation_id: prestation.value.id,
            date: date.value,
            startTime: startTime.value,
        })

        message.value = 'Réservation enregistrée avec succès !'
        messageType.value = 'alert-success'
    } catch (err) {
        console.error(err)
        message.value = err.response?.data?.error || "Erreur lors de la réservation"
        messageType.value = 'alert-danger'
    } finally {
        loading.value = false
    }
}
</script>
