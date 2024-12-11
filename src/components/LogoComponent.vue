<template>
  <div class="logo-container">
    <img :src="logoPath" alt="Logo del sistema" class="logo-image" />
  </div>
</template>

<script setup>
import logoPath from '@/assets/logo.png'; // Asegúrate de que el nombre del archivo sea correcto
</script>

<style scoped>
.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-image {
  width: 120px; /* Ajusta el tamaño según lo que necesites */
  height: auto;
  border-radius: 15px; /* Redondea las esquinas */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* (Opcional) Agrega un sombreado suave */
}
</style>
