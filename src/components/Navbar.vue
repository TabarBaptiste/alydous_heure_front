<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light px-4">
    <router-link class="navbar-brand" to="/">Alydous</router-link>

    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
      aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <router-link class="nav-link" to="/">Prestations</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/produit">Produits</router-link>
        </li>

        <template v-if="isLoggedIn">
          <li class="nav-item">
            <router-link class="nav-link" to="/historique">Historique</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/reservation">Reservation</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/compte">Mon compte</router-link>
          </li>
          <li class="nav-item">
            <!-- TODO : à supprimer après création compte user -->
            <a class="nav-link" href="" @click.prevent="handleLogout">Déconnexion</a>
          </li>
        </template>

        <template v-else>
          <li class="nav-item">
            <router-link class="nav-link" to="/login">Connexion</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/register">Inscription</router-link>
          </li>
        </template>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const { isLoggedIn, logout } = useAuth()
const router = useRouter()
const route = useRoute()

function handleLogout() {
  logout()

  // 🛡️ Si l'utilisateur est sur une page protégée, on redirige
  const protectedRoutes = ['/compte', '/historique', '/reservation']
  if (protectedRoutes.includes(route.path)) {
    router.push('/login')
  }
}
</script>
