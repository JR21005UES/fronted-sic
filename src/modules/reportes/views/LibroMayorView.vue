<template>
 <v-container>
    <h1 class="text-center">Balanza de Comprobacion</h1>
    <v-row class="my-3 px-3" no-gutters justify="space-between">
      <div style="width: 300px">
        <v-text-field prepend-inner-icon="mdi-magnify" density="compact" variant="outlined" v-model="filtro"
          label="Buscar..." />
      </div>
    </v-row>
    <v-data-table :headers="headers" :items="items_tabla" no-data-text="Sin datos para mostrar" :search="filtro" class="elevation-1">
      <!-- Botón para abrir el modal -->

      <template #item.accion="{ item }">
        <v-tooltip text="Mayorizar" location="top" content-class="bg-primary">
          <template v-slot:activator="{ props }">
            <v-icon icon="mdi-chart-bar-stacked" color="primary" v-bind="props" @click="abrirModal(item)" />
          </template>
        </v-tooltip>
      </template>

    </v-data-table>

    <!-- Modal para mostrar movimientos -->
    <v-dialog v-model="modalVisible" max-width="800">
      <v-card>
        <v-card-title>
          <span class="text-h6">Movimientos de la Cuenta{{ cuentaSeleccionada?.numero_partida }}</span>
        </v-card-title>
        <v-card-text>
          <v-simple-table class="tabla-movimientos">
            <thead>
              <tr>
                <th class="text-left">Partida No. #</th>
                <th class="text-left">Debe</th>
                <th class="text-right">Haber</th>
                <th class="text-right">Concepto</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="movimiento in cuentaSeleccionada?.movimientos" :key="movimiento.codigo">
                <td class="text-left">{{ movimiento.numero_partida }}</td>
                <td class="text-left">{{ movimiento.debe.toFixed(2) }}</td>
                <td class="text-right">{{ movimiento.haber.toFixed(2) }}</td>
                <td class="text-right">{{ movimiento.concepto }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="cerrarModal">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import reporteServices from '@/services/reportes';

const filtro = ref(null)

// Encabezados de la tabla principal
const headers = [
  {
    align: 'center',
    key: 'codigo',
    sortable: false,
    title: 'Codigo',
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
  {
    align: 'center',
    key: 'total_deudor',
    sortable: false,
    title: 'Saldo Deudor',
  },
  {
    align: 'center',
    key: 'total_acreedor',
    sortable: false,
    title: 'Saldo Acreedor',
  },
  {
    align: 'center',
    key: 'accion',
    sortable: false,
    title: 'Acción',
  },
]


// Datos para la tabla principal y el modal
const items_tabla = ref([]);
const modalVisible = ref(false);
const cuentaSeleccionada = ref(null);

// Función para cargar los datos desde la API
const llenarTabla = async () => {
  try {
    const { data } = await reporteServices.getLibroMayor();
    console.log('Datos cargados:', data); // Verifica los datos en la consola
    items_tabla.value = data;
  } catch (error) {
    console.error('Error al cargar los datos:', error);
  }
};

// Función para abrir el modal con los movimientos de una partida
const abrirModal = (item) => {
  cuentaSeleccionada.value = item;
  modalVisible.value = true;
};

// Función para cerrar el modal
const cerrarModal = () => {
  cuentaSeleccionada.value = null;
  modalVisible.value = false;
};

// Cargar los datos al montar el componente
onMounted(() => {
  llenarTabla();
});
</script>
<style scoped>
.tabla-movimientos {
  width: 100%;
}

.tabla-movimientos th,
.tabla-movimientos td {
  padding: 8px 16px;
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}
</style>


