<template>
    <div class="container mt-5">
        <h2 class="mb-4">
            {{ mode === 'create' ? 'Ajouter une prestation' : 'Modifier la prestation' }}
        </h2>

        <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
        <div v-if="success" class="alert alert-success mt-3">{{ success }}</div>
        <form @submit.prevent="submit" class="w-50 mx-auto">
            <div class="mb-3">
                <label class="form-label">Titre</label>
                <input v-model="form.titre" type="text" class="form-control" required />
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
                <label class="form-label">Durée (minutes)</label>
                <input v-model.number="form.duree" type="number" class="form-control" required />
            </div>

            <!-- TODO: ajouter sélect catégorie si besoin -->

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
    duree: null
})

const submitting = ref(false)
const error = ref('')
const success = ref('')

// Si mode edit, on récupère la prestation
onMounted(async () => {
    if (props.mode === 'edit') {
        try {
            const res = await api.get(`/prestation/${props.id}`)
            Object.assign(form.value, {
                titre: res.data.titre,
                description: res.data.description,
                prix: res.data.prix,
                duree: res.data.duree
            })
        } catch (e) {
            error.value = 'Impossible de charger la prestation.'
        }
    }
})

async function submit() {
    error.value = ''
    success.value = ''
    submitting.value = true

    try {
        if (props.mode === 'create') {
            await api.post('/prestation', form.value)
            success.value = 'Prestation créée avec succès.'
        } else {
            await api.patch(`/prestation/${props.id}`, form.value)
            success.value = 'Prestation modifiée avec succès.'
        }
        // Après un petit délai, revenir à la liste
        setTimeout(() => router.push({ name: 'prestations' }), 800)
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
