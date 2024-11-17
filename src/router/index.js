// composables
import {createRouter, createWebHistory} from 'vue-router'
import {useUtils} from '@/plugins/utils'
import authRouter from '@/views/auth/router'
import catalogoCuentasRouter from '@/modules/catalogos/router'
import reporteRouter from '@/modules/reportes/router'

const {canNavigate} = useUtils()

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/DashboardLayout.vue'),
    children: [
      {
        path: '/',
        name: 'dashboard',
        // router level code-splitting
        // this generates a separate chunk (about.[hash].js) for this router
        // which is lazy-loaded when the router is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/DashboardView.vue'),
      },
      ...authRouter,
      ...catalogoCuentasRouter,
      ...reporteRouter,
    ],
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
  },
  {
    path: '/forbidden',
    name: 'Forbidden',
    component: () => import('@/views/ForbiddenView.vue'),
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/views/ForbiddenView.vue'),
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  // console.log('Navigating from', from.path, 'to', to.path);

  // const userCanNavigate = await canNavigate();

  // console.log('User can navigate?', userCanNavigate)

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !localStorage.getItem('token')) next('/login')
  else if (!requiresAuth && localStorage.getItem('token')) next('/')
  // else if (
  //   requiresAuth &&
  //   localStorage.getItem('token') &&
  //   !(userCanNavigate)
  // )
  //   next('/forbidden')
  else next()
});



export default router
