<template>
  <div class="container mt-5">
    <h2 class="mb-4">Nos produits</h2>
    <div v-if="loading">Chargement...</div>
    <div v-else-if="produits.length === 0" class="alert alert-info">Aucun produit trouvé.</div>
    <div v-else>
      <div class="row">
        <div class="col-md-4 mb-3" v-for="produit in produits" :key="produit.id">
          <router-link :to="`/produit/${produit.id}`" class="card h-100 text-decoration-none text-dark">
            <div class="card-body">
              <h5 class="card-title">{{ produit.titre }}</h5>
              <p class="card-text">{{ produit.description }}</p>
              <p class="card-text">{{ produit.categorie }}</p>
              <p class="card-text">
                <strong>{{ produit.prix }} €</strong>
              </p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import api from '../services/api.js'

const produits = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await api.get('/produit')
    produits.value = res.data
  } catch (e) {
    console.error('Erreur lors du chargement des produits', e)
  } finally {
    loading.value = false
  }
})
</script>
