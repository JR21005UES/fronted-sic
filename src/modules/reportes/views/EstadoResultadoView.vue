<template>
  <v-container>
    <!-- Título -->
    <h1 class="text-center mb-4">Estado de Resultados</h1>

    <!-- Campo de texto y botón -->
    <v-row justify="center" class="my-3">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="invFinal"
          label="Inventario Final"
          outlined
          clearable
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="2">
        <v-btn color="primary" @click="calcularEstadoResultado">
          Calcular
        </v-btn>
      </v-col>
    </v-row>

    <!-- Indicador de carga -->
    <v-row v-if="loading" justify="center" class="my-5">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-row>

    <!-- Tabla de resultados -->
    <v-row v-else>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="estadoResultado"
          dense
          outlined
          class="elevation-1"
        >
        </v-data-table>
      </v-col>
    </v-row>

    <!-- Mensaje de error -->
    <v-alert v-if="error" type="error" dismissible class="mt-4">
      {{ error }}
    </v-alert>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const invFinal = ref(""); // Campo de texto para inventario final
const estadoResultado = ref([]); // Datos de la tabla
const loading = ref(false); // Indicador de carga
const error = ref(null); // Mensajes de error

// Encabezados de la tabla
const headers = [
  { text: "Nombre de Cuenta", value: "nombre_cuenta" },
  { text: "Total", value: "total" },
];

// Función para calcular el estado de resultados
const calcularEstadoResultado = async () => {
  error.value = null; // Resetea el error
  estadoResultado.value = []; // Limpia la tabla

  if (!invFinal.value) {
    error.value = "Por favor, ingresa el valor del inventario final.";
    return;
  }

  try {
    loading.value = true;
    const response = await axios.get("http://127.0.0.1:8000/api/estadoResul", {
      params: { inv_final: invFinal.value },
    });
    estadoResultado.value = response.data;
  } catch (err) {
    console.error(err);
    error.value = "Ocurrió un error al obtener el estado de resultados.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.text-center {
  text-align: center;
}
.mb-4 {
  margin-bottom: 1rem;
}
</style>

