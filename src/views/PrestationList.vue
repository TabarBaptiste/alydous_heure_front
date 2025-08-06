<template>
  <div class="container mt-5">
    <div v-if="isLoggedIn && isAdmin" class="mb-3">
      <button class="btn btn-success" @click="openCreateModal">
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
              <button class="btn btn-sm btn-outline-primary me-2" @click="() => openEditModal(prestation.id)">
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

    <PrestationModal v-model="showModal" :mode="modalMode" :prestation-id="selectedPrestationId"
      @saved="prestationStore.fetchPrestations(true)" />
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import api from '../services/api.js'
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'
import { usePrestationStore } from '../stores/prestationStore.js'
import PrestationModal from '../components/PrestationModal.vue'

const router = useRouter()
const { isLoggedIn, user } = useAuth()
const isAdmin = computed(() => user?.value?.roles?.includes('ROLE_ADMIN') || false)

const prestationStore = usePrestationStore()
const prestations = computed(() => prestationStore.prestations)
const loading = computed(() => prestationStore.loading)

const showModal = ref(false)
const modalMode = ref('create')
const selectedPrestationId = ref(null)

onMounted(() => {
  prestationStore.fetchPrestations()
})

function openCreateModal() {
  modalMode.value = 'create'
  selectedPrestationId.value = null
  showModal.value = true
}

function openEditModal(id) {
  modalMode.value = 'edit'
  selectedPrestationId.value = id
  showModal.value = true
}

async function deletePrestation(id) {
  if (!confirm('Supprimer cette prestation ?')) return
  await prestationStore.deletePrestation(id)
}
</script>
