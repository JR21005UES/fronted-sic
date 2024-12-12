<template>
 <v-container>
    <h1 class="text-center">Balanza de Comprobacion</h1>
    <v-row class="my-3 px-3" no-gutters justify="space-between">
      <div style="width: 300px">
          <v-text-field prepend-inner-icon="mdi-magnify" density="compact" variant="outlined" v-model="filtro"
            label="Buscar..." />
        </div>
      <!-- Botón para generar el archivo Excel -->
      <v-row justify="end" class="my-3" style="gap: 10px;">
  <v-btn @click="generarExcelBalanza" color="primary" elevation="2">
    Excel Balanza de Comprobación
  </v-btn>
  <v-btn @click="generarExcelMovimientos" color="secondary" elevation="2">
    Excel Libro Mayor
  </v-btn>
</v-row>

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
                <th class="text-left">Partida No.</th>
                <th class="text-left">Debe</th>
                <th class="text-right">Haber</th>
                <th class="text-right">Parcial</th>
                <th class="text-right">Concepto</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="movimiento in cuentaSeleccionada?.movimientos" :key="movimiento.codigo">
                <td class="text-left">{{ movimiento.numero_partida }}</td>
                <td class="text-left">{{ movimiento.debe.toFixed(2) }}</td>
                <td class="text-right">{{ movimiento.haber.toFixed(2) }}</td>
                <td class="text-right">{{ movimiento.total.toFixed(2)}}</td>
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
import useNoti from "@/composables/useNoti";

const { notify } = useNoti(); // Inicializar notificaciones


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

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver'; // Necesitamos FileSaver para descargar el archivo


// Función para generar el Excel de la Balanza de Comprobación
const generarExcelBalanza = async () => {
  if (!items_tabla.value.length) {
    alert('No hay datos para exportar en la Balanza de Comprobación');
    return;
  }

  // Crear un nuevo libro de trabajo
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Balanza de Comprobación');

  // Agregar un título
  worksheet.mergeCells('A1:F1'); // Fusionar celdas para el título
  const titleCell = worksheet.getCell('A1');
  titleCell.value = 'Balanza de Comprobación';
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' }; // Centrar el texto
  titleCell.font = { bold: true, size: 14 }; // Estilo de la fuente

  // Agregar encabezados
  worksheet.addRow(['Código', 'Nombre de la Cuenta', 'Debe', 'Haber', 'Saldo Deudor', 'Saldo Acreedor']).font = {
    bold: true,
  };

  // Agregar datos de la tabla principal
  items_tabla.value.forEach((item) => {
    worksheet.addRow([
      item.codigo,
      item.nombre_cuenta,
      item.debe,
      item.haber,
      item.total_deudor,
      item.total_acreedor,
    ]);
  });

  // Ajustar ancho de columnas
  worksheet.columns = [
    { width: 10 }, // Columna 1: Código
    { width: 30 }, // Columna 2: Nombre de la Cuenta
    { width: 15 }, // Columna 3: Debe
    { width: 15 }, // Columna 4: Haber
    { width: 15 }, // Columna 5: Saldo Deudor
    { width: 15 }, // Columna 6: Saldo Acreedor
  ];

  // Crear el archivo Excel
  const buffer = await workbook.xlsx.writeBuffer();

  // Descargar el archivo
  saveAs(new Blob([buffer]), 'Balanza_Comprobacion.xlsx');
  notify("Archivo Excel generado exitosamente", "success");
};

// Función para generar el Excel de los Libro Mayor
const generarExcelMovimientos = async () => {
  if (!items_tabla.value.length) {
    alert('No hay datos para exportar en los Libro Mayor');
    return;
  }

  // Crear un nuevo libro de trabajo
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Libro Mayor');

  // Agregar un título
  worksheet.mergeCells('A1:F1'); // Fusionar celdas para el título
  const titleCell = worksheet.getCell('A1');
  titleCell.value = 'Libro Mayor';
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' }; // Centrar el texto
  titleCell.font = { bold: true, size: 14 }; // Estilo de la fuente

  // Agregar encabezados
  worksheet.addRow(['Cuenta', 'Partida No.', 'Debe', 'Haber', 'Parcial', 'Concepto']).font = { bold: true };

   // Iterar sobre las cuentas y agregar los movimientos
   items_tabla.value.forEach((item) => {
    if (item.movimientos && item.movimientos.length > 0) {
      worksheet.addRow([]); // Espacio antes de los movimientos de cada cuenta
      let totalParcial = 0; // Inicializar el total de parciales para la cuenta

      item.movimientos.forEach((movimiento) => {
        worksheet.addRow([
          item.nombre_cuenta, // Columna para la cuenta
          movimiento.numero_partida, // Columna para el número de partida
          movimiento.debe,
          movimiento.haber,
          movimiento.total,
          movimiento.concepto,
        ]);
        totalParcial += movimiento.total; // Sumar el parcial
      });

      // Agregar la fila de suma total para esta cuenta
      worksheet.addRow([
        `Total de ${item.nombre_cuenta}`, // Texto para la columna "Cuenta"
        '', // Partida No. vacío
        '', // Debe vacío
        '', // Haber vacío
        totalParcial, // Total de parciales
        '', // Concepto vacío
      ]).font = { bold: true }; // Poner la fila de suma en negrita
    }
  });

  // Ajustar ancho de columnas
  worksheet.columns = [
    { width: 50 }, // Columna 1: Cuenta
    { width: 10 }, // Columna 2: Partida No.
    { width: 15 }, // Columna 3: Debe
    { width: 15 }, // Columna 4: Haber
    { width: 15 }, // Columna 5: Parcial
    { width: 40 }, // Columna 6: Concepto
  ];

  // Crear el archivo Excel
  const buffer = await workbook.xlsx.writeBuffer();

  // Descargar el archivo
  saveAs(new Blob([buffer]), 'Libro_Mayor.xlsx');
  notify("Archivo Excel generado exitosamente", "success");
};



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


