const reporteRouter = [
    {
      path: "/libro-diario",
      name: "libro_diario",
      component: () => import("../views/libroDiarioView.vue"),
    }
  ];

  export default reporteRouter;
