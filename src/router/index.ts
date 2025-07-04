import { createRouter, createWebHistory } from 'vue-router'
import PrestationList from '../views/PrestationList.vue'
import ProduitDetail from '../views/ProduitDetail.vue'
import ProduitList from '../views/ProduitList.vue'
import PrestationDetail from '../views/PrestationDetail.vue'
import LoginForm from '../views/LoginForm.vue'
import RegisterForm from '../views/RegisterForm.vue'
import Achat from '../views/Achat.vue'
import Reservation from '../views/Reservation.vue'
import Compte from '../views/Compte.vue'
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
      path: '/achat',
      name: 'achat',
      component: Achat
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
