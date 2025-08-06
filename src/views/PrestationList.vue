<template>
  <div class="container mt-5">
    <div v-if="isLoggedIn && isAdmin" class="mb-3">
      <button class="btn btn-success" @click="() => router.push({ name: 'prestationCreate' })">
        Ajouter une prestation
      </button>
    </div>

    <h2 class="mb-4">Nos prestations</h2>

    <div v-if="loading">
      <div class="loader"></div>
    </div>
    <div v-else-if="prestations.length === 0" class="alert alert-info">Aucune prestation trouvée.</div>
    <div v-else>
      <div class="row">
        <div class="col-md-4 mb-3" v-for="prestation in prestations" :key="prestation.id">
          <div class="card h-100 text-dark">
            <router-link :to="`/prestation/${prestation.id}`" class="card h-100 text-decoration-none">
              <div class="card-body">
                <h5 class="card-title">{{ prestation.titre }}</h5>
                <p class="card-text">{{ prestation.description }}</p>
                <p class="card-text"><strong>{{ prestation.prix }} €</strong></p>
              </div>
            </router-link>

            <div v-if="isLoggedIn && isAdmin" class="card-footer bg-white border-top-0">
              <button class="btn btn-sm btn-outline-primary me-2"
                @click="() => router.push({ name: 'prestationEdit', params: { id: prestation.id } })">
                Modifier
              </button>
              <button class="btn btn-sm btn-outline-danger" @click="deletePrestation(prestation.id)">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import api from '../services/api.js'
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'
import { usePrestationStore } from '../stores/prestationStore.js'

const router = useRouter()
const { isLoggedIn, user } = useAuth()
const isAdmin = computed(() => user?.value?.roles?.includes('ROLE_ADMIN') || false)

const prestationStore = usePrestationStore()
const prestations = computed(() => prestationStore.prestations)
const loading = computed(() => prestationStore.loading)

onMounted(() => {
  prestationStore.fetchPrestations()
})

async function deletePrestation(id) {
  if (!confirm('Supprimer cette prestation ?')) return
  await prestationStore.deletePrestation(id)
}
</script>
