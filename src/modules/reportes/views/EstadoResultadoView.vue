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
    <v-row class="my-3 px-3" no-gutters justify="space-between">
      <div style="width: 300px">
          <v-text-field prepend-inner-icon="mdi-magnify" density="compact" variant="outlined" v-model="filtro"
            label="Buscar..." />
        </div>
      <!-- Botón para generar el archivo Excel -->
      <v-btn @click="generarExcel" color="primary" elevation="2">Generar Excel</v-btn>
    </v-row>
    <!-- Indicador de carga -->
    <v-row v-if="loading" justify="center" class="my-5">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-row>

    <!-- Tabla de resultados -->
    <v-data-table :headers="headers" :items="estadoResultado" no-data-text="Sin datos para mostrar" :search="filtro" class="elevation-1"></v-data-table>

    <!-- Mensaje de error -->
    <v-alert v-if="error" type="error" dismissible class="mt-4">
      {{ error }}
    </v-alert>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const filtro = ref(null)
const invFinal = ref(""); // Campo de texto para inventario final
const estadoResultado = ref([]); // Datos de la tabla
const loading = ref(false); // Indicador de carga
const error = ref(null); // Mensajes de error

// Encabezados de la tabla
const headers = [
  {
    align: 'center',
    key: 'nombre_cuenta',
    sortable: false,
    title: 'Cuenta',
  },
  {
    align: 'center',
    key: 'total',
    sortable: false,
    title: 'Parcial',
  }
]


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

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver'; // Necesitamos FileSaver para descargar el archivo

const generarExcel = async () => {
  if (!estadoResultado.value.length) {
    alert('No hay datos para exportar');
    return;
  }

  // Crear un nuevo libro de trabajo
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Esado de Resultado');

  // Agregar un título
  worksheet.mergeCells('A1:C1'); // Fusionar celdas para el título
  const titleCell = worksheet.getCell('A1');
  titleCell.value = 'Esado de Resultado';
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' }; // Centrar el texto
  titleCell.font = { bold: true, size: 14 }; // Estilo de la fuente

  // Agregar encabezados de la tabla
  worksheet.addRow([ 'Cuenta', 'Parcial']).font = { bold: true };

  // Agregar datos
  estadoResultado.value.forEach((item) => {
    worksheet.addRow([ item.nombre_cuenta, item.total]);
  });

  // Ajustar ancho de columnas
  worksheet.columns = [
    { width: 40 }, // Columna 2: Cuenta
    { width: 15 }, // Columna 3: Parcial
  ];

  // Crear el archivo Excel
  const buffer = await workbook.xlsx.writeBuffer();

  // Descargar el archivo
  saveAs(new Blob([buffer]), 'Estado_Resultado.xlsx');
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

