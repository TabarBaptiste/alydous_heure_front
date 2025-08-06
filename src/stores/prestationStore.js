// src/stores/prestation.ts
import { defineStore } from 'pinia'
import api from '../services/api'

export const usePrestationStore = defineStore('prestation', {
    state: () => ({
        prestations: [],
        loading: false,
        loaded: false, // 🔒 Empêche le double chargement
    }),
    actions: {
        async fetchPrestations(force = false) {
            if (this.loaded && !force) return

            this.loading = true
            try {
                const res = await api.get('/prestation')
                this.prestations = res.data
                this.loaded = true
            } catch (error) {
                console.error('Erreur lors du chargement des prestations', e)
            } finally {
                this.loading = false
            }
        },
        async deletePrestation(id) {
            try {
                await api.delete(`/prestation/${id}`)
                this.prestations = this.prestations.filter(p => p.id !== id)
            } catch (e) {
                console.error('Erreur suppression prestation', e)
            }
        }
    }
})
