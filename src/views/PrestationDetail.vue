<template>
    <div class="container mt-5" v-if="prestation">
        <h2 class="mb-3">{{ prestation.titre }}</h2>
        <p class="lead">{{ prestation.description }}</p>
        <p><strong>Prix :</strong> {{ prestation.prix }} €</p>
        <p><strong>Durée :</strong> {{ prestation.duree }} min</p>
    </div>
    <div v-else class="container mt-5">Chargement...</div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api.js'

const route = useRoute()
const prestation = ref(null)

onMounted(async () => {
    try {
        const id = route.params.id
        const res = await api.get(`/prestation/${id}`)
        prestation.value = res.data
    } catch (error) {
        console.error('Erreur lors du chargement de la prestation', error)
    }
})
</script>
