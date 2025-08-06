// src/stores/produit.ts
import { defineStore } from 'pinia'
import api from '../services/api'

export const useProduitStore = defineStore('produit', {
    state: () => ({
        produits: [],
        loading: false,
        loaded: false, // 🔒 Empêche le double chargement
    }),
    actions: {
        async fetchProduits(force = false) {
            if (this.loaded && !force) return

            this.loading = true
            try {
                const res = await api.get('/produit')
                this.produits = res.data
                this.loaded = true
            } catch (error) {
                console.error('Erreur lors du chargement des produits', e)
            } finally {
                this.loading = false
            }
        },
        async deleteProduit(id) {
            try {
                await api.delete(`/produit/${id}`)
                this.produits = this.produits.filter(p => p.id !== id)
            } catch (e) {
                console.error('Erreur suppression produit', e)
            }
        }
    }
})
