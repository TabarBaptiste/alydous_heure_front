<template>
    <div class="container mt-5" v-if="produit">
        <h2 class="mb-3">{{ produit.titre }}</h2>
        <p class="lead">{{ produit.description }}</p>
        <p><strong>Prix :</strong> {{ produit.prix }} €</p>
    </div>
    <div v-else class="container mt-5">Chargement...</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api.ts'

interface Produit {
    id: number
    titre: string
    description: string
    prix: number
}

const route = useRoute()
const produit = ref<Produit | null>(null)

onMounted(async () => {
    try {
        const id = route.params.id
        const res = await api.get(`/produit/${id}`)
        produit.value = res.data
    } catch (error) {
        console.error('Erreur lors du chargement du produit', error)
    }
})
</script>
