<template>
  <div class="container mt-5">
    <div v-if="isLoggedIn && isAdmin" class="mb-3">
      <button class="btn btn-success" @click="() => router.push({ name: 'produitCreate' })">
        Ajouter un produit
      </button>
    </div>

    <h2 class="mb-4">Nos produits</h2>

    <div v-if="loading">
      <div class="loader"></div>
    </div>
    <div v-else-if="produits.length === 0" class="alert alert-info">Aucun produit trouvé.</div>
    <div v-else>
      <div class="row">
        <div class="col-md-4 mb-3" v-for="produit in produits" :key="produit.id">
          <div class="card h-100 text-dark">
            <router-link :to="`/produit/${produit.id}`" class="card h-100 text-decoration-none">
              <div class="card-body">
                <h5 class="card-title">{{ produit.titre }}</h5>
                <p class="card-text">{{ produit.description }}</p>
                <p class="card-text">{{ produit.categorie }}</p>
                <p class="card-text">
                  <strong>{{ produit.prix }} €</strong>
                </p>
              </div>
            </router-link>
            <div v-if="isLoggedIn && isAdmin" class="card-footer bg-white border-top-0">
              <button class="btn btn-sm btn-outline-primary me-2"
                @click="() => router.push({ name: 'produitEdit', params: { id: produit.id } })">
                Modifier
              </button>
              <button class="btn btn-sm btn-outline-danger" @click="deleteProduit(produit.id)">
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
import { useProduitStore } from '../stores/produitStore.js'

const router = useRouter()
const { isLoggedIn, user } = useAuth()
const isAdmin = computed(() => user?.value?.roles?.includes('ROLE_ADMIN') || false)

const produitStore = useProduitStore()
const produits = computed(() => produitStore.produits)
const loading = computed(() => produitStore.loading)

onMounted(() => {
  produitStore.fetchProduits()
})

async function deleteProduit(id) {
  if (!confirm('Supprimer cette produit ?')) return
  await produitStore.deleteProduit(id)
}
</script>
