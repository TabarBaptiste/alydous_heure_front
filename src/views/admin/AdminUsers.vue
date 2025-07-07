<template>
    <div class="container mt-5">
        <h2>Liste des utilisateurs</h2>

        <div v-if="loading">
            <div class="loader"></div>
        </div>
        <div v-if="message" class="mt-3 alert" :class="messageType">
            {{ message }}
        </div>
        <table class="table table-hover mt-4">
            <thead class="table-light">
                <tr>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Email</th>
                    <th>Réservations</th>
                    <th>Achats</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.id">
                    <td>{{ user.nom }}</td>
                    <td>{{ user.prenom }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.reservationsCount }}</td>
                    <td>{{ user.achatsCount }}</td>
                    <td>
                        <router-link class="btn btn-sm btn-outline-primary ms-2" :to="`/admin/user/${user.id}`">👁️
                            Voir</router-link>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const users = ref([])
const loading = ref(true)
const message = ref('')
const messageType = ref('')

onMounted(async () => {
    try {
        const res = await api.get('/admin/user')
        users.value = res.data
    } finally {
        loading.value = false
    }
})

async function deleteUser(id) {
    try {
        if (!confirm('Confirmer la suppression de cet utilisateur ?')) return
        await api.delete(`/admin/user/${id}`)
        users.value = users.value.filter(u => u.id !== id)

        message.value = 'Utilisateur Supprimé'
        messageType.value = 'alert-success'
    } catch (e) {
        message.value = e.response?.data?.error || 'Erreur'
        messageType.value = 'alert-danger'
    }
}
</script>
