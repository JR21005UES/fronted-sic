<template>

 <div class="d-flex justify-center">
   <v-card width="50%">
     <v-card-title>
       <h1 class="text-center">Crear cuenta</h1>
     </v-card-title>
     <v-divider />
     <v-card-text>
       <v-row>
         <v-col cols="6">
           <v-text-field
             variant="outlined"
             density="compact"
             label="Código"
             v-model="form.codigo"
           />
         </v-col>
         <v-col cols="6">
           <v-text-field
             variant="outlined"
             density="compact"
             label="Nombre"
              v-model="form.nombre"
           />
         </v-col>
         <v-col cols="6">
           <v-text-field
             variant="outlined"
             density="compact"
             label="Descripción"
              v-model="form.descripcion"
           />
         </v-col>
         <v-col cols="6">
           <v-autocomplete
             variant="outlined"
             density="compact"
             label="Naturaleza"
             no-data-text="Sin datos..."
             :items="selects.naturaleza"
             item-title="nombre"
             item-value="id"
             v-model="form.naturaleza_id"
           />
         </v-col>
       </v-row>

     </v-card-text>
     <v-card-actions>
       <v-btn variant="tonal" color="red" @click="router.push({ name: 'listado_cuentas'})">Cancelar</v-btn>
        <v-btn @click="crearCuenta" variant="tonal" color="blue">Crear cuenta</v-btn>
     </v-card-actions>
   </v-card>
 </div>

</template>

<script setup>

import {ref} from "vue";
import catalogoServices from "@/services/catalogos";
import {useRouter} from "vue-router";
import useNoti from "@/composables/useNoti";

const { notify } = useNoti(); // Inicializar notificaciones

const router = useRouter();
const selects = ref({
  naturaleza: [
    {
      id: 1,
      nombre: 'Deudora'
    },
    {
      id: 2,
      nombre: 'Deudora cuenta R'
    },
    {
      id: 3,
      nombre: 'Acreedora'
    }
  ],
})

const form = ref({
  codigo: null,
  nombre: null,
  descripcion: null,
  naturaleza_id: null,
})

const crearCuenta = async () => {
  try {
    // Llamar al servicio de creación de cuenta
    const response = await catalogoServices.crearCuenta(form.value);

    // Verificar si el código de estado es 201
    if (response.status === 201) {
      router.push({ name: 'listado_cuentas' }); // Redirigir después de crear
    } else {
      // Manejar otros casos de error
    }
  } catch (error) {
    // Capturar errores del servidor o problemas de red
    console.error("Error al crear la cuenta:", error);
    notify("Ocurrió un error al crear la cuenta. Intenta nuevamente.", "error");
  }
};

</script>
