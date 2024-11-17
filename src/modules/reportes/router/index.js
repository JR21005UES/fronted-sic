const reportesRouter = [
    {
      path: "/libDiario",
      name: "libro_diario",
      component: () => import("../views/LibroDiarioView.vue"),
    },
  ];
  export default reportesRouter;
