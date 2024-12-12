<template>
  <v-container>
    <h1 class="text-center">Listado de cuentas</h1>
    <v-row class="my-3 px-3" no-gutters justify="space-between">
      <div style="width: 300px">
        <v-text-field
          prepend-inner-icon="mdi-magnify"
          density="compact"
          variant="outlined"
          v-model="filtro"
          label="Buscar..."
        />
      </div>
      <v-row justify="end" class="my-3" style="gap: 10px;">
        <v-btn color="primary" @click="crearCuenta">Crear cuenta</v-btn>
        <v-btn color="green-darken-3" @click="generarExcel">Exportar a Excel</v-btn>
      </v-row>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="items_tabla"
      no-data-text="Sin datos para mostrar"
      :search="filtro"
      class="elevation-1"
    >
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

        <v-tooltip text="Eliminar" location="top" content-class="bg-primary">
          <template v-slot:activator="{ props }">
            <v-icon
              icon="mdi-trash-can"
              color="red"
              v-bind="props"
              @click="eliminarRegistro(item)"
            />
          </template>
        </v-tooltip>
      </template>
    </v-data-table>

    <!-- Modal de Edición -->
    <v-dialog v-model="dialogoEdicion" persistent max-width="600px">
      <v-card>
        <v-card-title class="headline">Editar Cuenta</v-card-title>
        <v-card-text>
          <v-form ref="formRef" v-model="isValid">
            <v-text-field
              label="Código"
              v-model="form.codigo"
              disabled
            />
            <v-text-field
              label="Nombre"
              v-model="form.nombre"
              :rules="[rules.required]"
            />
            <v-text-field
              label="Descripción"
              v-model="form.descripcion"
              :rules="[rules.required]"
            />
            <v-text-field
              label="Naturaleza"
              v-model="form.naturaleza_id"
              disabled
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
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import catalogoServices from "@/services/catalogos";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useRouter } from "vue-router";
import useNoti from "@/composables/useNoti";

const { notify } = useNoti();
const router = useRouter();

const headers = [
  { align: "center", key: "codigo", sortable: false, title: "Código" },
  { align: "center", key: "nombre", sortable: false, title: "Nombre" },
  { align: "center", key: "descripcion", sortable: false, title: "Descripción" },
  { align: "center", key: "naturaleza", sortable: false, title: "Naturaleza" },
  { align: "center", key: "accion", sortable: false, title: "Acción" },
];

const items_tabla = ref([]);
const filtro = ref("");
const dialogoEdicion = ref(false);
const form = ref({
  codigo: "",
  nombre: "",
  descripcion: "",
  naturaleza_id: "",
});

const rules = {
  required: (value) => !!value || "Este campo es obligatorio.",
};
const isValid = ref(false);

const llenarTabla = async () => {
  const { data } = await catalogoServices.getCuentas();
  items_tabla.value = data;
};

const abrirModalEdicion = (item) => {
  form.value = { ...item };
  dialogoEdicion.value = true;
};

const cerrarModalEdicion = () => {
  dialogoEdicion.value = false;
};

const guardarCambios = async () => {
  try {
    await catalogoServices.editarCuenta(form.value.codigo, {
      nombre: form.value.nombre,
      descripcion: form.value.descripcion,
    });
    notify("Cuenta actualizada exitosamente", "success");
    cerrarModalEdicion();
    llenarTabla();
  } catch (error) {
    notify(
      error.response?.data?.message ||
        "No se pudo guardar la cuenta. Verifica los datos.",
      "error"
    );
  }
};

const eliminarRegistro = async (item) => {
  try {
    const response = await catalogoServices.deleteCuenta(item.codigo);
    if (response.status === 200) {
      notify("Cuenta eliminada exitosamente", "success");
    }
  } catch (error) {
    notify("Error al eliminar la cuenta. Verifica y vuelve a intentar.", "error");
  }
  llenarTabla();
};

const crearCuenta = () => {
  router.push({ name: "crear_cuenta" });
};

// Generar el Excel
const generarExcel = async () => {
  if (!items_tabla.value.length) {
    notify("No hay datos para exportar", "error");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Listado de Cuentas");

  worksheet.mergeCells('B1:E1'); // Fusionar celdas para el título
        const titleCell2 = worksheet.getCell('B1');
        titleCell2.value = 'ENCOM S.A. de C.V.';
        titleCell2.alignment = { horizontal: 'center', vertical: 'middle' }; // Centrar el texto
        titleCell2.font = { bold: true, size: 14 }; // Estilo de la fuente
        // Agregar un título
        worksheet.mergeCells('B2:E2'); // Fusionar celdas para el título
        const titleCell = worksheet.getCell('B2');
        titleCell.value = 'Catalogo de Cuentas';
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        titleCell.font = { bold: true, size: 14 };

  worksheet.addRow(["", "Código", "Nombre", "Descripción", "Naturaleza"]).font = {
    bold: true,
  };

  items_tabla.value.forEach((item) => {
    worksheet.addRow(["", item.codigo, item.nombre, item.descripcion, item.naturaleza]);
  });

  worksheet.columns = [
    { width: 10 },
    { width: 15 },
    { width: 30 },
    { width: 40 },
    { width: 20 },
  ];

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), "Catalogo_de_Cuentas.xlsx");
  notify("El archivo de Catalogo de cuentas se generó exitosamente.", "success");
};

onMounted(() => {
  llenarTabla();
});
</script>

<style scoped>
.my-3 {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
</style>
