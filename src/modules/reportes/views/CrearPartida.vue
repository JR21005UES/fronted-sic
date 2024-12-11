<template>

    <div class="d-flex justify-center">
      <v-card width="50%">
        <v-card-title>
          <h1 class="text-center">Crear Partidas</h1>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <v-text-field
                variant="outlined"
                density="compact"
                label="Numero de partida"
                v-model="form.num_de_partida"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                variant="outlined"
                density="compact"
                label="Fecha"
                 v-model="form.fecha"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                variant="outlined"
                density="compact"
                label="Concepto"
                 v-model="form.concepto"
              />
            </v-col>
            
          </v-row>
   
        </v-card-text>
        <v-card-actions>
          <v-btn variant="tonal" color="red" @click="router.push({ name: 'libro_diario'})">Cancelar</v-btn>
           <v-btn @click="crearPartida" variant="tonal" color="blue">Crear Partida</v-btn>
        </v-card-actions>
      </v-card>
    </div>
   
   </template>
   
   <script setup>
   
   import {ref} from "vue";
   import reportesServices from "@/services/reportes";
   import {useRouter} from "vue-router";
   
   const router = useRouter();
   
   const form = ref({
     num_de_partida: null,
     fecha: null,
     concepto: null,
    
   })
   
   const crearPartida = async () => {
     await reportesServices.crearPartida(form.value);
     router.push({name: 'libro_diario'});
   
   }
   </script>
   