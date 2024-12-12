<template>
  <v-container>
    <h1 class="text-center">Libro Diario</h1>
    <v-row class="my-3 px-3" no-gutters justify="space-between">
      <div style="width: 300px">
          <v-text-field prepend-inner-icon="mdi-magnify" density="compact" variant="outlined" v-model="filtro"
            label="Buscar..." />
        </div>
      <!-- Botón para generar el archivo Excel -->
      <v-row justify="end" class="my-3" style="gap: 10px;">
        <v-btn @click="generarExcel" color="primary" elevation="2">Generar Excel</v-btn>
        <!-- Botón para Moverme a la vista de CrearDatoView.vue -->
        <v-btn @click="moverACrearPartida" color="primary" elevation="2">Crear Partida</v-btn>
        <!-- Botón para Moverme a la vista de CrearDatoView.vue -->
        <v-btn @click="moverACrearDato" color="primary" elevation="2">Crear Dato</v-btn>
      </v-row>
    </v-row>
    
    <v-data-table :headers="headers" :items="items_tabla" no-data-text="Sin datos para mostrar" :search="filtro" class="elevation-1">
      <!-- Botón para abrir el modal -->

      <template #item.accion="{ item }">
        <v-tooltip text="Editar" location="top" content-class="bg-primary">
          <template v-slot:activator="{ props }">
            <v-icon
              icon="mdi-pencil"
              color="blue"
              v-bind="props"
              @click="abrirModalEdicion(item)"
            />
          </template>
        </v-tooltip>
        <v-tooltip text="Ver" location="top" content-class="bg-primary">
          <template v-slot:activator="{ props }">
            <v-icon icon="mdi-eye" color="primary" v-bind="props" @click="abrirModal(item)" />
          </template>
        </v-tooltip>
      </template>

    </v-data-table>
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
                <th class="text-right">Accion</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="movimiento in partidaSeleccionada?.movimientos" :key="movimiento.codigo">
                <td class="text-left">{{ movimiento.codigo }}</td>
                <td class="text-left">{{ movimiento.nombre_cuenta }}</td>
                <td class="text-right">{{ movimiento.debe.toFixed(2) }}</td>
                <td class="text-right">{{ movimiento.haber.toFixed(2) }}</td>
                <td class="text-right">
                  <v-tooltip text="Editar" location="top" content-class="bg-primary">
                    <template v-slot:activator="{ props }">
                      <v-icon
                        icon="mdi-pencil"
                        color="blue"
                        v-bind="props"
                        @click="abrirModalEdicionMovimiento(movimiento)"
                      />
                    </template>
                  </v-tooltip>
                  <v-tooltip text="Eliminar" location="top" content-class="bg-primary">
                    <template v-slot:activator="{ props }">
                      <v-icon
                        icon="mdi-trash-can"
                        color="red"
                        v-bind="props"
                        @click="eliminarMovimiento(movimiento.id)"
                      />
                    </template>
                  </v-tooltip>
                </td>
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
    <!-- Modal de Edición -->
    <v-dialog v-model="dialogoEdicion" persistent max-width="600px">
      <v-card>
        <v-card-title class="headline">Editar Cuenta</v-card-title>
        <v-card-text>
          <v-form ref="formRef" v-model="isValid">
            <v-text-field
              label="Partida"
              v-model="form.numero_partida"
              disabled
            />
            <v-text-field
              label="Concepto"
              v-model="form.concepto"
              :rules="[rules.required]"
            />            
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="cerrarModalEdicion">Cancelar</v-btn>
          <v-btn color="blue" :disabled="!isValid" @click="guardarCambios">
            Guardar Cambios
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal de edicion de datos -->
     <!-- Modal de Edición -->
    <v-dialog v-model="dialogoEdicion2" persistent max-width="600px">
      <v-card>
        <v-card-title class="headline">Editar Cuenta</v-card-title>
        <v-card-text>
          <v-form ref="formRef" v-model="isValid">
            <v-text-field
              label="Partida"
              v-model="form.numero_partida"
              disabled
            />
            <v-text-field
              label="Codigo"
              v-model="form.numero_partida"
              disabled
            />
            <v-checkbox
            label="Es Diario"
            v-model="form.es_diario"
            />
            <v-text-field
              label="Concepto"
              v-model="form.concepto"
              :rules="[rules.required]"
            />            
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="cerrarModalEdicion">Cancelar</v-btn>
          <v-btn color="blue" :disabled="!isValid" @click="guardarCambios">
            Guardar Cambios
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal de Edición de Movimiento -->
    <v-dialog v-model="dialogoEdicionMovimiento" persistent max-width="600px">
      <v-card>
        <v-card-title class="headline">Editar Movimiento</v-card-title>
        <v-card-text>
          <v-form ref="formMovimientoRef" v-model="isValidMovimiento">
            <v-text-field
              label="Código"
              v-model="formMovimiento.codigo"
              disabled
            />
            <v-text-field
              label="Nombre de la Cuenta"
              v-model="formMovimiento.nombre_cuenta"
              disabled
            />
            <v-text-field
              label="Debe"
              v-model="formMovimiento.debe"
            />
            <v-text-field
              label="Haber"
              v-model="formMovimiento.haber"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="cerrarModalEdicionMovimiento">Cancelar</v-btn>
          <v-btn color="blue" :disabled="!isValidMovimiento" @click="guardarCambiosMovimiento">
            Guardar Cambios
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import reporteServices from '@/services/reportes';
import useNoti from "@/composables/useNoti";

const { notify } = useNoti(); // Inicializar notificaciones

const filtro = ref(null)

const abrirModalEdicion = (item) => {
  console.log("Datos del item seleccionado:", item);
  form.value = { ...item };
  dialogoEdicion.value = true;
};
const rules = {
  required: (value) => !!value || "Este campo es obligatorio.",
};
const isValid = ref(false);
const cerrarModalEdicion = () => {
  dialogoEdicion.value = false;
};
const abrirModal = (item) => {
  partidaSeleccionada.value = item;
  modalVisible.value = true;
};

const abrirModalEdicionMovimiento = (movimiento) => {
  if (!partidaSeleccionada.value) {
    alert("No se ha seleccionado ninguna partida.");
    return;
  }
  formMovimiento.value = { ...movimiento };
  dialogoEdicionMovimiento.value = true;
};

const cerrarModal = () => {
  partidaSeleccionada.value = null;
  modalVisible.value = false;
};

const eliminarMovimiento = async (id) => {
  try {
    await reporteServices.deleteDato(id);
    notify("Movimiento Eliminado Correctamente", "success");
    await llenarTabla(); // Recargar la tabla

    // Actualizar partidaSeleccionada
    if (partidaSeleccionada.value) {
      partidaSeleccionada.value = items_tabla.value.find(item => item.numero_partida === partidaSeleccionada.value.numero_partida) || null;
    }
  } catch (error) {
    console.error("Error al eliminar el movimiento:", error.response || error);
  }
};

const guardarCambios = async () => {
  try {
    console.log("ID enviado:", form.value.numero_partida); // Verifica el ID
    console.log("Datos enviados al backend:", {
      concepto: form.value.concepto,
    });

    // Llama al servicio con el ID y los datos del formulario
    await reporteServices.editarPartida(form.value.numero_partida, {
      concepto: form.value.concepto,
    });

    notify("Cuenta actualizada correctamente", "success");
    cerrarModalEdicion();
    llenarTabla(); // Recargar la tabla
  } catch (error) {
    console.error("Error al guardar los cambios:", error.response || error);
    
  }
};


const dialogoEdicion = ref(false);
const form = ref({
  numero_partida: "",
  concepto: "",
});
const dialogoEdicion2 = ref(false);
const form2 = ref({
  id_catalogo: "",
  id_partida: "",
  es_diario: "",
  debe: "",
  haber: "",
});

const dialogoEdicionMovimiento = ref(false);
const formMovimiento = ref({
  id: "",
  codigo: "",
  nombre_cuenta: "",
  debe: "",
  haber: "",
});
const isValidMovimiento = ref(false);

const cerrarModalEdicionMovimiento = () => {
  dialogoEdicionMovimiento.value = false;
};

const guardarCambiosMovimiento = async () => {
  try {
    console.log("ID enviado:", formMovimiento.value.id); // Verifica el ID
    console.log("Datos enviados al backend:", {
      id_catalogo: formMovimiento.value.codigo,
      id_partida: partidaSeleccionada.value.numero_partida,
      debe: formMovimiento.value.debe,
      haber: formMovimiento.value.haber,
      es_diario: formMovimiento.value.es_diario,
    });

    // Llama al servicio con el ID y los datos del formulario
    await reporteServices.editarDato(formMovimiento.value.id, {
      id_catalogo: formMovimiento.value.codigo,
      id_partida: partidaSeleccionada.value.numero_partida,
      debe: formMovimiento.value.debe,
      haber: formMovimiento.value.haber,
      es_diario: formMovimiento.value.es_diario,
    });

    notify("Movimiento actualizado correctamente", "success");
    cerrarModalEdicionMovimiento();
    await llenarTabla(); // Recargar la tabla

    cerrarModal();
  } catch (error) { 
    console.error("Error al guardar los cambios:", error.response || error);
  }
};

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
    console.log("Datos cargados:", data);
    items_tabla.value = data;
  } catch (error) {
    console.error("Error al cargar los datos:", error);
    notify("Error al cargar los datos", "error");
  }
};


// Cargar los datos al montar el componente
onMounted(() => {
  llenarTabla();
});


import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver'; // Necesitamos FileSaver para descargar el archivo

const generarExcel = async () => {
  if (!items_tabla.value.length) {
    notify("No hay datos para exportar", "error");
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
  notify("Reporte generado Exitosamente", "success");
};

const router = useRouter();

const moverACrearDato = () => {
  router.push({ name: 'nuevo_dato' });
};

const moverACrearPartida = () => {
  router.push({ name: 'nueva_partida' });
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
.my-3 {
  margin-top: 1rem;
  margin-bottom: 1rem;
} 
</style>
