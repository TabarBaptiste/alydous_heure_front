<template>
    <div class="modal fade" :class="{ 'show': modelValue }" tabindex="-1"
        :style="{ display: modelValue ? 'block' : 'none' }">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        {{ mode === 'create' ? 'Ajouter une prestation' : 'Modifier la prestation' }}
                    </h5>
                    <button type="button" class="btn-close" @click="$emit('update:modelValue', false)"></button>
                </div>
                <div class="modal-body">
                    <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
                    <div v-if="success" class="alert alert-success mt-3">{{ success }}</div>
                    <form @submit.prevent="submit">
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
                            <input v-model.number="form.prix" type="number" class="form-control" min="0" step="0.01"
                                required />
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Durée (minutes)</label>
                            <input v-model.number="form.duree" type="number" class="form-control" min="0" required />
                        </div>

                        <div class="d-flex justify-content-end gap-2">
                            <button type="button" class="btn btn-secondary"
                                @click="$emit('update:modelValue', false)">Annuler</button>
                            <button type="submit" class="btn btn-primary" :disabled="submitting">
                                {{ submitting
                                    ? (mode === 'create' ? 'Création…' : 'Modification…')
                                    : (mode === 'create' ? 'Créer' : 'Enregistrer') }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div class="modal-backdrop fade show" v-if="modelValue"></div>
</template>

<script setup>
import { ref, watch } from 'vue'
import api from '../services/api.js'

const props = defineProps({
    modelValue: { type: Boolean, required: true },
    mode: { type: String, required: true },
    prestationId: { type: Number, default: null }
})

const emit = defineEmits(['update:modelValue', 'saved'])

const form = ref({
    titre: '',
    description: '',
    prix: null,
    duree: null
})

const submitting = ref(false)
const error = ref('')
const success = ref('')

watch(() => props.modelValue, async (newVal) => {
    if (newVal && props.mode === 'edit' && props.prestationId) {
        try {
            const res = await api.get(`/prestation/${props.prestationId}`)
            Object.assign(form.value, {
                titre: res.data.titre,
                description: res.data.description,
                prix: res.data.prix,
                duree: res.data.duree
            })
        } catch (e) {
            error.value = 'Impossible de charger la prestation.'
        }
    } else if (!newVal) {
        // Reset form when modal closes
        form.value = { titre: '', description: '', prix: null, duree: null }
        error.value = ''
        success.value = ''
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
            await api.patch(`/prestation/${props.prestationId}`, form.value)
            success.value = 'Prestation modifiée avec succès.'
        }
        emit('saved')  // Déclenche le rechargement forcé des données
        setTimeout(() => {
            emit('update:modelValue', false)
        }, 800)
    } catch (e) {
        error.value = e.response?.data?.message || 'Erreur lors de la requête.'
    } finally {
        submitting.value = false
    }
}
</script>

<style scoped>
.modal {
    background-color: rgba(0, 0, 0, 0.5);
}
</style>
