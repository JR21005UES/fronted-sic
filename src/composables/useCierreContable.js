import { ref } from 'vue';

// Variable global reactiva para el estado de cierre contable
export const isCierreActivo = ref(false);

// Función para activar el cierre
export const activarCierre = () => {
  isCierreActivo.value = true;
};

// Función para desactivar el cierre (si es necesario)
export const desactivarCierre = () => {
  isCierreActivo.value = false;
};
