<template>
  <h1 class="text-center">Libro Diario</h1>
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
    key: 'codigo',
    sortable: false,
    title: 'Código',
  },
  {
    align: 'center',
    key: 'nombre_cuenta',
    sortable: false,
    title: 'Nombre',
  },
  {
    align: 'center',
    key: 'debe',
    sortable: false,
    title: 'Debe',
  },
  {
    align: 'center',
    key: 'haber',
    sortable: false,
    title: 'Haber',
  },
]

const items_tabla = ref([])

const llenarTabla = async () => {
  const {data} = await reporteServices.getLibroDiario()
  items_tabla.value = data
}
onMounted(() => {
  llenarTabla()
})
</script>
