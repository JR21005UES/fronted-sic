<template>
  <v-container>
    <h1 class="text-center">Balance General</h1>
    <v-row class="my-3 px-3" no-gutters justify="space-between">
      <div style="width: 300px">
        <v-text-field prepend-inner-icon="mdi-magnify" density="compact" variant="outlined" v-model="filtro"
          label="Buscar..." />
      </div>
      <!-- Botón para generar el archivo Excel -->
      <v-btn @click="generarExcel" color="primary" elevation="2">Generar Excel</v-btn>
    </v-row>
    <v-data-table :headers="headers" :items="items_tabla" no-data-text="Sin datos para mostrar" :search="filtro" class="elevation-1">
      <template #item.accion="{ item }">
        <v-tooltip text="Ver" location="top" content-class="bg-primary">
          <template v-slot:activator="{ props }">
            <v-icon icon="mdi-trash-can" color="red" v-bind="props" @click="eliminarRegistro(item)" />
          </template>
        </v-tooltip>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from "vue";
import reporteServices from '@/services/reportes';
import { useRouter } from "vue-router";

const router = useRouter();
const headers = [
  { align: 'center', key: 'nombre_cuenta', sortable: false, title: 'Cuenta' },
  { align: 'center', key: 'total', sortable: false, title: 'Parcial' }
];

const items_tabla = ref([]);
const filtro = ref(null);

const llenarTabla = async () => {
  const { data } = await reporteServices.getBalanceGeneral();
  items_tabla.value = data;
};

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver'; // Necesitamos FileSaver para descargar el archivo

const generarExcel = async () => {
  if (!items_tabla.value.length) {
    alert('No hay datos para exportar');
    return;
  }

  // Crear un nuevo libro de trabajo
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Balance General');

  // Agregar un título
  worksheet.mergeCells('A1:C1'); // Fusionar celdas para el título
  const titleCell = worksheet.getCell('A1');
  titleCell.value = 'Balance General';
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' }; // Centrar el texto
  titleCell.font = { bold: true, size: 14 }; // Estilo de la fuente

  // Agregar encabezados de la tabla
  worksheet.addRow([ 'Cuenta', 'Parcial']).font = { bold: true };

  // Agregar datos
  items_tabla.value.forEach((item) => {
    worksheet.addRow([item.nombre_cuenta, item.total]);
  });

  // Ajustar ancho de columnas
  worksheet.columns = [
    { width: 40 }, // Columna 2: Cuenta
    { width: 15 }, // Columna 3: Parcial
  ];

  // Crear el archivo Excel
  const buffer = await workbook.xlsx.writeBuffer();

  // Descargar el archivo
  saveAs(new Blob([buffer]), 'Balance_General.xlsx');
};




onMounted(() => {
  llenarTabla();
});
</script>
