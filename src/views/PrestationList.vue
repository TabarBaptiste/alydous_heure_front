<template>
  <div class="container mt-5">
    <h2 class="mb-4">Nos prestations</h2>
    <div v-if="loading">Chargement...</div>
    <div v-else>
      <div class="row">
        <div class="col-md-4 mb-3" v-for="prestation in prestations" :key="prestation.id">
          <router-link
            :to="`/prestation/${prestation.id}`"
            class="card h-100 text-decoration-none text-dark"
          >
            <div class="card-body">
              <h5 class="card-title">{{ prestation.titre }}</h5>
              <p class="card-text">{{ prestation.description }}</p>
              <p class="card-text">
                <strong>{{ prestation.prix }} €</strong>
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

const prestations = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await api.get('/prestation')
    prestations.value = res.data
  } catch (e) {
    console.error('Erreur lors du chargement des prestations', e)
  } finally {
    loading.value = false
  }
})
</script>
