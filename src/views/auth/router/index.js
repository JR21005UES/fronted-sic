const userRoutes = [
  {
    path: '/usuarios/listado',
    name: 'usersList',
    component: () => import('../views/ListAuthView.vue')
  },
  {
    path: '/usuarios/crear',
    name: 'usersCreate',
    component: () => import('../views/CreateAuthView.vue')
  }
]

export default userRoutes
