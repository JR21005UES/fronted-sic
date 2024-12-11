<template>
    <div class="d-flex justify-center">
      <v-card width="70%">
        <v-card-title>
          <h1 class="text-center">Crear Partidas</h1>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-row>
            <!-- Combo de Partidas -->
            <v-col cols="6">
              <v-select
                variant="outlined"
                density="compact"
                label="Combo de Partidas"
                :items="partidas"
              />
            </v-col>
            
            <!-- Combo de Catálogo -->
            <v-col cols="6">
              <v-select
                variant="outlined"
                density="compact"
                label="Combo de Catálogo"
                :items="catalogos"
              />
            </v-col>
  
            <!-- Checkbox: Es del Diario -->
            <v-col cols="6">
              <v-checkbox
                label="¿Es del Diario?"
              />
            </v-col>
  
            <!-- Campos de Débito y Crédito -->
            <v-col cols="6">
              <v-text-field
                variant="outlined"
                density="compact"
                label="Debe"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                variant="outlined"
                density="compact"
                label="Haber"
              />
            </v-col>
  
            <!-- Botones de acción -->
            <v-col cols="12" class="d-flex justify-space-between">
              <v-btn
                variant="tonal"
                color="red"
                @click="cancelar"
              >
                Cancelar
              </v-btn>
              <v-btn
                variant="tonal"
                color="blue"
                @click="guardar"
              >
                Guardar
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        partidas: ["Partida 1", "Partida 2", "Partida 3"], // Opciones para el combo de partidas
        catalogos: ["Catálogo 1", "Catálogo 2", "Catálogo 3"], // Opciones para el combo de catálogo
      };
    },
    methods: {
      cancelar() {
        this.$router.push({ name: "libro_diario" });
      },
      guardar() {
        // Lógica para guardar los datos
        console.log("Guardar datos");
      },
    },
  };
  </script>
  
  <style scoped>
  .text-center {
    text-align: center;
  }
  </style>
  