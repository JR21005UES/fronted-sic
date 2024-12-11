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
    },
    {
      path: "/balance-general",
      name: "balance_general",
      component: () => import("../views/BalanceGeneral.vue"),
    }, 
    {
      path: "/nueva-partida",
      name: "nueva_partida",
      component: () => import("../views/CrearPartida.vue"),
    },
    {
      path: "/nuevos-datos",
      name: "nuevos_datos",
      component: () => import("../views/CrearDatoView.vue"),
    },



  ];

  export default reporteRouter;
