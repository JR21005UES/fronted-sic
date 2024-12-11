<template>
  <v-container>
    <v-card width="50%" class="mx-auto">
      <v-card-title>
        <h1 class="text-center">Editar Cuenta</h1>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-form ref="formRef" v-model="isValid">
          <v-text-field
            label="Código"
            v-model="form.codigo"
            :rules="[rules.required]"
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
          />
          <v-autocomplete
            label="Naturaleza"
            :items="selects.naturaleza"
            item-title="nombre"
            item-value="id"
            v-model="form.naturaleza_id"
            :rules="[rules.required]"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="red" @click="cancelar">Cancelar</v-btn>
        <v-btn color="blue" :disabled="!isValid" @click="guardarCambios">
          Guardar Cambios
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import catalogoServices from "@/services/catalogos";

const router = useRouter();
const route = useRoute();

const form = ref({
  codigo: "",
  nombre: "",
  descripcion: "",
  naturaleza_id: null,
});

const selects = ref({
  naturaleza: [
    { id: 1, nombre: "Deudora" },
    { id: 2, nombre: "Deudora cuenta R" },
    { id: 3, nombre: "Acreedora" },
    { id: 4, nombre: "Acreedora cuenta R" },
  ],
});

const rules = {
  required: (value) => !!value || "Este campo es obligatorio.",
};

const isValid = ref(false);

const cargarCuenta = async () => {
  try {
    const id = route.params.id;
    console.log("ID recibido:", id); // Verifica que el ID llegue correctamente
    const { data } = await catalogoServices.obtenerCuenta(id);
    console.log("Datos de la cuenta cargados:", data); // Verifica los datos recibidos
    form.value = { ...data };
  } catch (error) {
    console.error("Error al cargar la cuenta:", error.response || error);
    alert("No se pudo cargar la cuenta.");
  }
};


const guardarCambios = async () => {
  try {
    await catalogoServices.editarCuenta(form.value);
    alert("Cuenta actualizada correctamente");
    router.push({ name: "listado_cuentas" });
  } catch (error) {
    console.error("Error al guardar los cambios:", error.response || error);
    alert("No se pudo guardar la cuenta.");
  }
};



const cancelar = () => {
  router.push({ name: "listado_cuentas" });
};

onMounted(() => {
  cargarCuenta();
});
</script>

<style scoped>
.mx-auto {
  margin: auto;
}
</style>
