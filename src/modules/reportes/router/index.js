const reporteRouter = [
    {
      path: "/libro-diario",
      name: "libro_diario",
      component: () => import("../views/LibroDiarioView.vue"),
    },
    {
      path: "/libro-mayor",
      name: "libro_mayor",
      component: () => import("../views/LibroMayorView.vue"),
    },
    {
      path: "/estado-resultado",
      name: "estado_resultado",
      component: () => import("../views/EstadoResultadoView.vue"),
    }
  ];

  export default reporteRouter;
