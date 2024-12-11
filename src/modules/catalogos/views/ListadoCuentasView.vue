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
      <v-btn @click="crearCuenta">Crear cuenta</v-btn>
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
import { useRouter } from "vue-router";

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
  console.log("Datos del item seleccionado:", item);
  form.value = { ...item };
  dialogoEdicion.value = true;
};

const cerrarModalEdicion = () => {
  dialogoEdicion.value = false;
};

const guardarCambios = async () => {
  try {
    console.log("ID enviado:", form.value.codigo); // Verifica el ID
    console.log("Datos enviados al backend:", {
      nombre: form.value.nombre,
      descripcion: form.value.descripcion,
    });

    // Llama al servicio con el ID y los datos del formulario
    await catalogoServices.editarCuenta(form.value.codigo, {
      nombre: form.value.nombre,
      descripcion: form.value.descripcion,
    });

    alert("Cuenta actualizada correctamente");
    cerrarModalEdicion();
    llenarTabla(); // Recargar la tabla
  } catch (error) {
    console.error("Error al guardar los cambios:", error.response || error);
    alert(
      error.response?.data?.message ||
        "No se pudo guardar la cuenta. Verifica los datos."
    );
  }
};


const eliminarRegistro = async (item) => {
<<<<<<< HEAD
  await catalogoServices.deleteCuenta(item.codigo)
  llenarTabla()
}

const editarRegistro = async (item) => {
  await catalogoServices.editarCuenta(item.codigo, item)
  llenarTabla()
}
=======
  await catalogoServices.deleteCuenta(item.codigo);
  llenarTabla();
};
>>>>>>> f5db9eb06310bc8d5466051f6e41f6ae47c0ba67

const crearCuenta = () => {
  router.push({ name: "crear_cuenta" });
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
