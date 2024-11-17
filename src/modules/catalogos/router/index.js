const catalogoCuentasRouter = [
    {
      path: "/listado-cuentas",
      name: "listado_cuentas",
      component: () => import("../views/ListadoCuentasView.vue"),
    },
    {
      path: "/editar-cuenta/:id_cuenta",
      //quiero agregarle un id a la ruta listado_cuentas
      name: "editar_cuenta",
      component: () => import("../views/EditarCuenta.vue"),
    },
    {
      path: "/crear-cuenta",
      //quiero agregarle un id a la ruta listado_cuentas
      name: "crear_cuenta",
      component: () => import("../views/CrearCuenta.vue"),
    },
  ];

  export default catalogoCuentasRouter;
