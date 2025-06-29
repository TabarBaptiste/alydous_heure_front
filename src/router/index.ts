import { createRouter, createWebHistory } from 'vue-router'
// @ts-ignore
import PrestationList from '../views/PrestationList.vue'
// @ts-ignore
import ProduitDetail from '../views/ProduitDetail.vue'
// @ts-ignore
import ProduitList from '../views/ProduitList.vue'
// @ts-ignore
import PrestationDetail from '../views/PrestationDetail.vue'
// @ts-ignore
import LoginForm from '../views/LoginForm.vue'
// @ts-ignore
import RegisterForm from '../views/RegisterForm.vue'
// @ts-ignore
import Historique from '../views/Historique.vue'
// @ts-ignore
import Reservation from '../views/Reservation.vue'
// @ts-ignore
import Compte from '../views/Compte.vue'
// @ts-ignore
import PrestationForm from '../views/PrestationForm.vue'

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
    },
    {
      path: '/login',
      name: 'login',
      component: LoginForm
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterForm
    },
    {
      path: '/historique',
      name: 'historique',
      component: Historique
    },
    {
      path: '/reservation',
      name: 'reservation',
      component: Reservation
    },
    {
      path: '/compte',
      name: 'compte',
      component: Compte
    },
    {
      path: '/prestation/create',
      name: 'prestationCreate',
      component: PrestationForm,
      props: { mode: 'create' }
    },
    {
      path: '/prestation/edit/:id',
      name: 'prestationEdit',
      component: PrestationForm,
      props: route => ({ mode: 'edit', id: Number(route.params.id) })
    },

  ],
})

export default router
