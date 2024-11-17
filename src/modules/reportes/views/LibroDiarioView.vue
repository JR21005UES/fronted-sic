<template>
  <v-container>
    <h1 class="text-center">Libro Diario</h1>
    <v-data-table
      :headers="headers"
      :items="items_tabla"
      item-value="numero_partida"
      no-data-text="Sin datos para mostrar"
      show-expand
      class="elevation-1"
    >
      <!-- Slot para filas expandidas -->
      <template v-slot:expanded-item="{ item }">
        <v-card flat>
          <v-card-text>
            <v-simple-table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre de la Cuenta</th>
                  <th>Debe</th>
                  <th>Haber</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="movimiento in item.movimientos" :key="movimiento.codigo">
                  <td>{{ movimiento.codigo }}</td>
                  <td>{{ movimiento.nombre_cuenta }}</td>
                  <td>{{ movimiento.debe }}</td>
                  <td>{{ movimiento.haber }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </template>
    </v-data-table>
  </v-container>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import reporteServices from '@/services/reportes';

// Encabezados de la tabla principal
const headers = [
  { text: 'Número de Partida', align: 'center', value: 'numero_partida' },
  { text: 'Concepto', align: 'center', value: 'concepto' },
];

// Datos de la tabla
const items_tabla = ref([]);

// Cargar datos desde la API
const llenarTabla = async () => {
  try {
    const { data } = await reporteServices.getLibroDiario();
    console.log('Datos cargados:', data); // Verifica que los datos lleguen correctamente
    items_tabla.value = data;
  } catch (error) {
    console.error('Error al cargar los datos:', error);
  }
};

// Llamar a la función al montar el componente
onMounted(() => {
  llenarTabla();
});
</script>

