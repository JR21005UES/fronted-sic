<template>
  <h1 class="text-center">Estado de Resultados</h1>
  <v-row class="my-3 px-3" no-gutters justify="space-between">
   <div style="width: 300px">
     <v-text-field
       prepend-inner-icon="mdi-magnify"
       density="compact"
       variant="outlined"
       v-model="filtro"
       label="Buscar..."/>
   </div>
  </v-row>
  <v-row>
    <v-col cols="12">
      <v-data-table
        :headers="headers"
        :items="items_tabla"
        no-data-text="Sin datos para mostrar"
        :search="filtro"
      >
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script setup>

import {onMounted, ref} from "vue";
import reporteServices from "@/services/reportes";
import {useRouter} from "vue-router";
const router = useRouter();
const headers = [
  {
    align: 'center',
    key: 'nombre_cuenta',
    sortable: false,
    title: 'Nombre de Cuenta',
  },
  {
    align: 'center',
    key: 'total',
    sortable: false,
    title: 'Saldo',
  },
]

const items_tabla = ref([])

const filtro = ref(null)

const llenarTabla = async () => {
  const {data} = await reporteServices.getEstadoResultado(200000)
  items_tabla.value = data
}  
onMounted(() => {
  llenarTabla()
})
</script>
