import { createRouter, createWebHistory } from 'vue-router'
import PrestationList from '../views/PrestationList.vue'
import ProduitDetail from '../views/ProduitDetail.vue'
import ProduitList from '../views/ProduitList.vue'
import PrestationDetail from '../views/PrestationDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: PrestationList
    },
    {
      path: '/prestation/:id',
      name: 'prestationDetail',
      component: PrestationDetail
    },
    {
      path: '/produit',
      name: 'produit',
      component: ProduitList
    },
    {
      path: '/produit/:id',
      name: 'produitDetail',
      component: ProduitDetail
    }


  ],
})

export default router
