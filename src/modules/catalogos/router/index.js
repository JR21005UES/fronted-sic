const catalogoCuentasRouter = [
    {
      path: "/listado-cuentas",
      name: "listado_cuentas",
      component: () => import("../views/ListadoCuentasView.vue"),
    },
    {
      path: "/crear-cuenta",
      //quiero agregarle un id a la ruta listado_cuentas
      name: "crear_cuenta",
      component: () => import("../views/CrearCuenta.vue"),
    },
  ];

  export default catalogoCuentasRouter;
