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
import ProduitForm from '../views/ProduitForm.vue'
import AdminUsers from '@/views/admin/AdminUsers.vue'
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import AdminReservations from '@/views/admin/AdminReservations.vue'
import AdminAchats from '@/views/admin/AdminAchats.vue'
import AdminDisponibilites from '@/views/admin/AdminDisponibilites.vue'
import AdminExceptions from '@/views/admin/AdminExceptions.vue'

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
      path: '/produit/create',
      name: 'produitCreate',
      component: ProduitForm,
      props: { mode: 'create' }
    },
    {
      path: '/produit/edit/:id',
      name: 'produitEdit',
      component: ProduitForm,
      props: route => ({ mode: 'edit', id: Number(route.params.id) })
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
    {
      path: '/admin/user',
      component: AdminUsers,
      meta: { requiresAdmin: true }
    },
    {
      path: '/admin',
      component: AdminDashboard,
      meta: { AdminDashboard: true }
    },
    {
      path: '/admin/user/:id',
      name: 'AdminUserDetail',
      component: () => import('@/views/admin/UserDetail.vue'),
      meta: { requiresAdmin: true }
    },
    {
      path: '/admin/reservations',
      name: 'adminReservations',
      component: AdminReservations
    },
    {
      path: '/admin/achats',
      name: 'adminAchats',
      component: AdminAchats
    },
    {
      path: '/admin/disponibilites',
      name: 'adminDisponibilites',
      component: AdminDisponibilites
    },
    {
      path: '/admin/exceptions',
      name: 'adminExceptions',
      component: AdminExceptions
    },
  ],
})

export default router
