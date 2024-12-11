<template>
  <v-container>
    <h1 class="text-center">Libro Diario</h1>
    <v-row class="my-3 px-3" no-gutters justify="space-between">
      <div style="width: 300px">
          <v-text-field prepend-inner-icon="mdi-magnify" density="compact" variant="outlined" v-model="filtro"
            label="Buscar..." />
        </div>
      <!-- Botón para generar el archivo Excel -->
      <v-btn @click="generarExcel" color="primary" elevation="2">Generar Excel</v-btn>
    </v-row>
    <v-data-table :headers="headers" :items="items_tabla" no-data-text="Sin datos para mostrar" :search="filtro" class="elevation-1">
      <!-- Botón para abrir el modal -->

      <template #item.accion="{ item }">
        <v-tooltip text="Ver" location="top" content-class="bg-primary">
          <template v-slot:activator="{ props }">
            <v-icon icon="mdi-eye" color="primary" v-bind="props" @click="abrirModal(item)" />
          </template>
        </v-tooltip>
      </template>

    </v-data-table>

    <!-- Modal para mostrar movimientos -->
    <v-dialog v-model="modalVisible" max-width="800">
      <v-card>
        <v-card-title>
          <span class="text-h6">Movimientos de la Partida {{ partidaSeleccionada?.numero_partida }}</span>
        </v-card-title>
        <v-card-text>
          <v-simple-table class="tabla-movimientos">
            <thead>
              <tr>
                <th class="text-left">Código</th>
                <th class="text-left">Nombre de la Cuenta</th>
                <th class="text-right">Debe</th>
                <th class="text-right">Haber</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="movimiento in partidaSeleccionada?.movimientos" :key="movimiento.codigo">
                <td class="text-left">{{ movimiento.codigo }}</td>
                <td class="text-left">{{ movimiento.nombre_cuenta }}</td>
                <td class="text-right">{{ movimiento.debe.toFixed(2) }}</td>
                <td class="text-right">{{ movimiento.haber.toFixed(2) }}</td>
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
    key: 'numero_partida',
    sortable: false,
    title: 'Numero de Partida',
  },
  {
    align: 'center',
    key: 'concepto',
    sortable: false,
    title: 'Nombre',
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
const partidaSeleccionada = ref(null);

// Función para cargar los datos desde la API
const llenarTabla = async () => {
  try {
    const { data } = await reporteServices.getLibroDiario();
    console.log('Datos cargados:', data); // Verifica los datos en la consola
    items_tabla.value = data;
  } catch (error) {
    console.error('Error al cargar los datos:', error);
  }
};

// Función para abrir el modal con los movimientos de una partida
const abrirModal = (item) => {
  partidaSeleccionada.value = item;
  modalVisible.value = true;
};

// Función para cerrar el modal
const cerrarModal = () => {
  partidaSeleccionada.value = null;
  modalVisible.value = false;
};

// Cargar los datos al montar el componente
onMounted(() => {
  llenarTabla();
});


import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver'; // Necesitamos FileSaver para descargar el archivo

const generarExcel = async () => {
  if (!items_tabla.value.length) {
    alert('No hay datos para exportar');
    return;
  }

  // Crear un nuevo libro de trabajo
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Libro Diario');

  // Agregar un título
  worksheet.mergeCells('A1:E1'); // Fusionar celdas para el título
  const titleCell = worksheet.getCell('A1');
  titleCell.value = 'Libro Diario';
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' }; // Centrar el texto
  titleCell.font = { bold: true, size: 14 }; // Estilo de la fuente

  // Agregar encabezados de la tabla principal
  worksheet.addRow(['Número de Partida', 'Código', 'Nombre de Cuenta', 'Debe', 'Haber']).font = { bold: true };

  // Iterar sobre las partidas y agregar los movimientos
  items_tabla.value.forEach((partida) => {
    // Agregar una fila para el número de partida
    worksheet.addRow([`Partida ${partida.numero_partida}`, '', '', '', '']).font = { bold: true, size: 12 };

    // Agregar los movimientos de la partida
    partida.movimientos.forEach((movimiento) => {
      worksheet.addRow([
        '', // Número de partida vacío en los movimientos
        movimiento.codigo,
        movimiento.nombre_cuenta,
        movimiento.debe.toFixed(2),
        movimiento.haber.toFixed(2),
      ]);
    });

    // Agregar una fila para el concepto al final de los movimientos
    const conceptoRow = worksheet.addRow([`Concepto: ${partida.concepto}`, '', '', '', '']);
    worksheet.mergeCells(`A${conceptoRow.number}:E${conceptoRow.number}`); // Combinar celdas de A a E
    conceptoRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' }; // Centrar texto
    conceptoRow.font = { italic: true, size: 11 }; // Aplicar estilo al concepto

    // Espacio entre partidas
    worksheet.addRow([]);
  });

  // Ajustar ancho de columnas
  worksheet.columns = [
    { width: 20 }, // Columna 1: Número de Partida
    { width: 15 }, // Columna 2: Código
    { width: 45 }, // Columna 3: Nombre de Cuenta
    { width: 15 }, // Columna 4: Debe
    { width: 15 }, // Columna 5: Haber
  ];

  // Crear el archivo Excel
  const buffer = await workbook.xlsx.writeBuffer();

  // Descargar el archivo
  saveAs(new Blob([buffer]), 'Libro_Diario.xlsx');
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
