<template>
  <v-app>
    <v-main class="background-container">
      <v-container>
        <h1 class="text-center">Últimas Transacciones</h1>
        <v-btn color="primary" class="mb-4" @click="refrescarTabla">
          <v-icon left>mdi-refresh</v-icon>Refrescar
        </v-btn>
        <v-data-table
          :headers="headers"
          :items="ultimasPartidas"
          no-data-text="Sin datos para mostrar"
          class="elevation-1"
          hide-default-footer
        >
          <template #item.accion="{ item }">
            <v-btn icon color="primary" @click="verDetalles(item)">
              <v-icon>mdi-eye</v-icon>
            </v-btn>
          </template>
        </v-data-table>

        <v-dialog v-model="modalVisible" max-width="800">
          <v-card>
            <v-card-title>
              <span class="text-h6">Detalles de la Partida {{ partidaSeleccionada?.numero_partida }}</span>
            </v-card-title>
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
                  <tr v-for="movimiento in partidaSeleccionada?.movimientos" :key="movimiento.codigo">
                    <td>{{ movimiento.codigo }}</td>
                    <td>{{ movimiento.nombre_cuenta }}</td>
                    <td>{{ movimiento.debe.toFixed(2) }}</td>
                    <td>{{ movimiento.haber.toFixed(2) }}</td>
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
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import reporteServices from '@/services/reportes';

const headers = [
  { text: 'Número de Partida', value: 'numero_partida' },
  { text: 'Concepto', value: 'concepto' },
  { text: 'Acción', value: 'accion', align: 'center', sortable: false },
];

const ultimasPartidas = ref([]);
const modalVisible = ref(false);
const partidaSeleccionada = ref(null);

const cargarUltimasPartidas = async () => {
  try {
    const { data } = await reporteServices.getLibroDiario();
    if (data.length > 1) {
      ultimasPartidas.value = data.slice(-6, -1); // Mostrar hasta la penúltima partida
    } else {
      ultimasPartidas.value = [];
    }
  } catch (error) {
    console.error('Error al cargar las últimas partidas:', error);
  }
};

const refrescarTabla = async () => {
  await cargarUltimasPartidas();
};

const verDetalles = (item) => {
  partidaSeleccionada.value = item;
  modalVisible.value = true;
};

const cerrarModal = () => {
  partidaSeleccionada.value = null;
  modalVisible.value = false;
};

onMounted(() => {
  cargarUltimasPartidas();
});
</script>

<style scoped>
/* Elimina márgenes y rellenos globales */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

/* Contenedor principal con el fondo */
.background-container {
  background-image: url('@/assets/background.png');
  background-size: cover; /* Ajusta el fondo para que cubra todo */
  background-position: center; /* Centra la imagen */
  background-repeat: no-repeat; /* No repite la imagen */
  min-height: 100vh; /* Altura mínima para cubrir la ventana */
  display: flex;
  flex-direction: column;
}

/* Asegura que el contenedor interno sea responsivo */
.v-container {
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
  max-width: 90%; /* Ajusta el ancho del contenido en pantallas pequeñas */
  margin: 0 auto;
}

/* Ajustes específicos para pantallas pequeñas */
@media (max-width: 768px) {
  .background-container {
    background-size: contain; /* Cambia a "contain" para pantallas pequeñas */
  }

  h1.text-center {
    font-size: 1.5rem; /* Reduce el tamaño del texto en dispositivos pequeños */
  }

  .v-btn {
    font-size: 0.9rem; /* Ajusta el tamaño de los botones */
  }
}

@media (max-width: 480px) {
  .background-container {
    padding: 10px; /* Reduce el relleno para pantallas muy pequeñas */
  }

  .v-container {
    max-width: 100%; /* Utiliza todo el ancho disponible */
  }
}
</style>
