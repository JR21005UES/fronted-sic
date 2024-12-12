<template>
  <div class="d-flex justify-center">
    <v-card width="70%">
      <v-card-title>
        <h1 class="text-center">Agregar Dato</h1>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-row>
          <!-- Combo de Libro Diario (Partidas) -->
          <v-col cols="6">
            <multiselect
              v-model="partidaSeleccionada"
              :options="partidas"
              :label="'nombre'"
              :track-by="'id'"
              placeholder="Seleccione una partida"
              :searchable="true"
              :clear-on-select="true"
              :close-on-select="true"
            />
          </v-col>

          <!-- Combo de Catálogo -->
          <v-col cols="6">
            <multiselect
              v-model="catalogoSeleccionado"
              :options="catalogos"
              :label="'nombre'"
              :track-by="'codigo'"
              placeholder="Seleccione un catálogo"
              :searchable="true"
              :clear-on-select="true"
              :close-on-select="true"
            />
          </v-col>

          <!-- Campos de Débito y Crédito -->
          <v-col cols="4">
            <v-text-field
              variant="outlined"
              density="compact"
              label="Debe"
              v-model="montoDebe"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              variant="outlined"
              density="compact"
              label="Haber"
              v-model="montoHaber"
            />
          </v-col>

          <!-- Checkbox: Es del Diario -->
          <v-col cols="4">
            <v-checkbox
              v-model="esDiario"
              label="¿Es del Diario?"
            />
          </v-col>

          <!-- Botones de acción -->
          <v-col cols="12" class="d-flex justify-space-between">
            <v-btn variant="tonal" color="red" @click="cancelar">
              Cancelar
            </v-btn>
            <v-btn variant="tonal" color="blue" @click="guardar">
              Guardar
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";
import useNoti from "@/composables/useNoti";
import catalogoServices from "@/services/catalogos";
import reporteServices from "@/services/reportes";

export default {
  components: {
    Multiselect,
  },
  data() {
    return {
      partidas: [],
      catalogos: [],
      partidaSeleccionada: null,
      catalogoSeleccionado: null,
      montoDebe: null,
      montoHaber: null,
      esDiario: false,
    };
  },
  created() {
    this.fetchCatalogos();
    this.fetchPartidas();
  },
  methods: {
    cancelar() {
      this.$router.push({ name: "libro_diario" });
    },
    async guardar() {
      const { notify } = useNoti();
      if (!this.partidaSeleccionada || !this.catalogoSeleccionado) {
        notify("Debe seleccionar una partida y un catálogo", "error");
        return;
      }
      //valida que no vayan los campos debe y haber vacios
      if (!this.montoDebe && !this.montoHaber) {
        notify("Debe ingresar un monto en el campo Debe o Haber", "error");
        return;
      }

      const nuevoDato = {
        id_partida: this.partidaSeleccionada.id,
        id_catalogo: this.catalogoSeleccionado.codigo,
        es_diario: this.esDiario,
        debe: this.montoDebe || 0,
        haber: this.montoHaber || 0,
      };

      try {
        const response = await reporteServices.crearDato(nuevoDato);
        if (response.status === 201) {
          this.limpiarFormulario();
          this.$router.push({ name: "libro_diario" });
        } else {
          notify("Respuesta inesperada del servidor", "warning");
        }
      } catch (error) {
        if (error.response) {
          notify(error.response.data.message || "Error al procesar la solicitud", "error");
        } else {
          notify("Ocurrió un error al comunicarse con el servidor", "error");
        }
      }
    },
    async fetchCatalogos() {
      const { notify } = useNoti();
      try {
        const response = await catalogoServices.getCuentas();
        this.catalogos = response.data.map((catalogo) => ({
          nombre: catalogo.nombre || "Sin nombre",
          codigo: catalogo.codigo || null,
        }));
      } catch (error) {
        notify("Error al cargar los catálogos", "error");
      }
    },
    async fetchPartidas() {
      const { notify } = useNoti();
      try {
        const response = await reporteServices.getLibroDiario();
        this.partidas = response.data.map((partida) => ({
          nombre: `Partida ${partida.numero_partida}`,
          id: partida.numero_partida || null,
        }));
      } catch (error) {
        notify("Error al cargar las partidas", "error");
      }
    },
    limpiarFormulario() {
      this.partidaSeleccionada = null;
      this.catalogoSeleccionado = null;
      this.montoDebe = null;
      this.montoHaber = null;
      this.esDiario = false;
    },
  },
};
</script>

<style scoped>
.text-center {
  text-align: center;
}
</style>
