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
          dense
          color="primary"
          class="custom-text-field"
        />
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
      <v-btn @click="generarExcel" color="green-darken-4" elevation="2">Generar Excel</v-btn>
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
import useNoti from "@/composables/useNoti";

const { notify } = useNoti(); // Inicializar notificaciones
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
    notify("Campo vacio, Ingrese un valor ", "error");//cambio AHORAAAAAAAAAAA
    return ;
  }
  if (invFinal.value < 1 ) {
    notify("El valor tiene que ser positivo", "error");//cambio AHORAAAAAAAAAAA    return;
    return ;
  }

  try {
    loading.value = true;
    const response = await axios.get("http://127.0.0.1:8000/api/estadoResul", {
      params: { inv_final: invFinal.value },
    });
    estadoResultado.value = response.data;
  } catch (err) {
    console.error(err);
    notify("Por favor ingrese un numero", "error");//cambio AHORAAAAAAAAAAA
    return ;
  } finally {
    loading.value = false;
  }
  notify("Estado de Resultado generado con exito", "success");
};

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver'; // Necesitamos FileSaver para descargar el archivo

const generarExcel = async () => {
  if (!estadoResultado.value.length) {
    notify("NO HAY DATOS PARA EXPORTAR", "error");
    return;
  }

  // Crear un nuevo libro de trabajo
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Esado de Resultado');

  // Agregar un título
  worksheet.mergeCells('B1:C1'); // Fusionar celdas para el título
  const titleCell2 = worksheet.getCell('B1');
  titleCell2.value = 'ENCOM S.A. de C.V.';
  titleCell2.alignment = { horizontal: 'center', vertical: 'middle' }; // Centrar el texto
  titleCell2.font = { bold: true, size: 14 }; // Estilo de la fuente
  // Agregar un título
  worksheet.mergeCells('B2:C2'); // Fusionar celdas para el título
  const titleCell = worksheet.getCell('B2');
  titleCell.value = 'Estado de Resultado';
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  titleCell.font = { bold: true, size: 14 };

  // Agregar encabezados de la tabla
  worksheet.addRow([ '','Cuenta', 'Parcial']).font = { bold: true };

  // Agregar datos
  estadoResultado.value.forEach((item) => {
    worksheet.addRow(['', item.nombre_cuenta, item.total]);
  });

  // Ajustar ancho de columnas
  worksheet.columns = [
    { width: 10 }, // Columna 3: Parcial
    { width: 40 }, // Columna 2: Cuenta
    { width: 15 }, // Columna 3: Parcial
  ];

  // Crear el archivo Excel
  const buffer = await workbook.xlsx.writeBuffer();

  // Descargar el archivo
  saveAs(new Blob([buffer]), 'Estado_Resultado.xlsx');
  notify("Excel generado exitosamente", "success");
};

</script>

<style scoped>
.text-center {
  text-align: center;
}
.mb-4 {
  margin-bottom: 1rem;
}
.custom-text-field {
  background-color: rgba(255, 255, 255, 0.514); /* Fondo blanco */
  border-radius: 8px; /* Bordes redondeados */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Sombra suave para resaltar */
  padding: 4px; /* Espaciado interno */
}
</style>

