<template>
    <div class="container mt-5">
        <h2 class="mb-4">
            {{ mode === 'create' ? 'Ajouter une produit' : 'Modifier la produit' }}
        </h2>

        <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
        <div v-if="success" class="alert alert-success mt-3">{{ success }}</div>
        <form @submit.prevent="submit" class="w-50 mx-auto">
            <div class="mb-3">
                <label class="form-label">Titre</label>
                <input v-model="form.titre" type="text" class="form-control" required />
            </div>

            <!-- TODO mettre un menu déroulant -->
            <div class="mb-3">
                <label class="form-label">Categorie</label>
                <input v-model="form.categorie" type="text" class="form-control" :disabled=true />
            </div>

            <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea v-model="form.description" class="form-control" rows="3"></textarea>
            </div>

            <div class="mb-3">
                <label class="form-label">Prix (€)</label>
                <input v-model.number="form.prix" type="number" class="form-control" step="0.01" required />
            </div>

            <div class="mb-3">
                <label class="form-label">Stock</label>
                <input v-model.number="form.stock" type="number" class="form-control" required />
            </div>

            <div class="d-flex justify-content-between">
                <button type="button" class="btn btn-secondary" @click="goBack">Annuler</button>
                <button type="submit" class="btn btn-primary" :disabled="submitting">
                    {{ submitting
                        ? (mode === 'create' ? 'Création…' : 'Modification…')
                        : (mode === 'create' ? 'Créer' : 'Enregistrer') }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api.js'

const router = useRouter()
const route = useRoute()

// props: mode ('create'|'edit') et id si mode edit
const props = defineProps({
    mode: { type: String, required: true },
    id: { type: Number, required: false }
})

const form = ref({
    titre: '',
    description: '',
    prix: null,
    stock: null
})

const submitting = ref(false)
const error = ref('')
const success = ref('')

// Si mode edit, on récupère la produit
onMounted(async () => {
    if (props.mode === 'edit') {
        try {
            const res = await api.get(`/produit/${props.id}`)

            Object.assign(form.value, {
                titre: res.data.titre,
                categorie: res.data.categorie,
                description: res.data.description,
                prix: res.data.prix,
                stock: res.data.stock
            })
        } catch (e) {
            error.value = 'Impossible de charger la produit.'
        }
    } else {
        Object.assign(form.value, {
            categorie: 5,
        })
    }
})

async function submit() {
    error.value = ''
    success.value = ''
    submitting.value = true

    try {
        if (props.mode === 'create') {
            await api.post('/produit', form.value)
            success.value = 'Produit créée avec succès.'
        } else {
            await api.patch(`/produit/${props.id}`, form.value)
            success.value = 'Produit modifiée avec succès.'
        }
        // Après un petit délai, revenir à la liste
        setTimeout(() => router.push({ name: 'produits' }), 800)
    } catch (e) {
        error.value = e.response?.data?.message || 'Erreur lors de la requête.'
    } finally {
        submitting.value = false
    }
}

function goBack() {
    router.back()
}
</script>
