<template>
  <h1 class="text-center">Listado de cuentas</h1>
  <v-row class="my-3 px-3" no-gutters justify="space-between">
   <div style="width: 300px">
     <v-text-field
       prepend-inner-icon="mdi-magnify"
       density="compact"
       variant="outlined"
       v-model="filtro"
       label="Buscar..."/>
   </div>
    <v-btn @click="crearCuenta">Crear cuenta</v-btn>
  </v-row>
  <v-row>
    <v-col cols="12">
      <v-data-table
        :headers="headers"
        :items="items_tabla"
        no-data-text="Sin datos para mostrar"
        :search="filtro"
      >
        <template #item.accion=" { item}">
          <v-tooltip text="Eliminar" location="top" content-class="bg-red">
            <template v-slot:activator="{ props }">
              <v-icon icon="mdi-trash-can" color="red" v-bind="props"
                      @click="eliminarRegistro(item)"
              />
            </template>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script setup>

import {onMounted, ref} from "vue";
import catalogoServices from "@/services/catalogos";
import {useRouter} from "vue-router";
const router = useRouter();
const headers = [
  {
    align: 'center',
    key: 'codigo',
    sortable: false,
    title: 'Código',
  },
  {
    align: 'center',
    key: 'nombre',
    sortable: false,
    title: 'Nombre',
  },
  {
    align: 'center',
    key: 'descripcion',
    sortable: false,
    title: 'Descripción',
  },
  {
    align: 'center',
    key: 'naturaleza',
    sortable: false,
    title: 'Naturaleza',
  },
  {
    align: 'center',
    key: 'accion',
    sortable: false,
    title: 'Acción',
  },
]

const items_tabla = ref([])

const filtro = ref(null)

const llenarTabla = async () => {
  const {data} = await catalogoServices.getCuentas()
  items_tabla.value = data
}

const eliminarRegistro = async (item) => {
  await catalogoServices.deleteCuenta(item.codigo)
  llenarTabla()
}

const crearCuenta = () => {
  router.push({name: 'crear_cuenta'})
}
onMounted(() => {
  llenarTabla()
})
</script>
