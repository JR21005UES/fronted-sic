<template>
  <v-navigation-drawer
    :expand-on-hover="!display.xs.value"
    :rail="true"
    rail-width="60"
    :permanent="!display.xs.value"
    :model-value="drawer"
    app
    @mouseleave="closeAll"
  >
    <v-list color="indigo-darken-4">
      <v-list-item
        :title="auth?.user?.name"
        :subtitle="auth?.user?.email"
      >
        <template #prepend>
          <v-icon color="indigo-darken-4">mdi-account-circle</v-icon>
        </template>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>
    <v-list v-model:opened="open" color="indigo-darken-4">
      <span v-for="(route, i) in router" :key="i">
       <v-tooltip
         v-if="route.hijos && route.hijos.length"
         :text="route.name"
         color="primary"
       >
         <template #activator = "{ props }">
           <v-list-group
             v-bind="props"
             :key="route.id"
             :value="route.name"
             link
             color="indigo-darken-4"
           >
             <template #activator="{ props }">
               <v-list-item
                 v-bind="props"
                 color="indigo-darken-4"
                 :prepend-icon="route.icono"
                 :title="route.name"
                 :exact="true"
               />
             </template>
             <v-list-item
               v-for="(child, j) in router[i].hijos"

               :key="j"
               :title="child.name"
               :prepend-icon="child.icono"
               :to="{ name: child.uriName }"
               :exact="true"
             />
           </v-list-group>
         </template>
       </v-tooltip>
        <v-tooltip v-else :text="route.name">
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                :key="i"
                :prepend-icon="route.icono"
                :title="route.name"
                :to="{ name: route.uriName }"
                :exact="true"
              />
            </template>
          </v-tooltip>
      </span>
    </v-list>
  </v-navigation-drawer>
</template>
<script setup>
import { useDisplay } from 'vuetify'
import {computed, ref} from "vue";
import {useAuthStore} from "@/store/auth";

const display = useDisplay()

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})

const router = [
  {
    id: 1,
    name: 'Home',
    uri: '/',
    uriName: 'dashboard',
    icono: 'mdi-home',
  },
  {
    id: 2,
    name: 'Cuentas',
    uri: 'listado-cuentas',
    uriName: 'listado_cuentas',
    icono: 'mdi-book-multiple',
  },
  {
    id: 3,
    name: 'Reportes',
    uri: '/reportes',
    icono: 'mdi-alert-box',
    hijos: [
      {
        id: 1,
        name: 'Libro Diario',
        uri: 'libro-diario',
        uriName: 'libro_diario',
        icono: 'mdi-book-open-variant',
      },
      {
        id: 2,
        name: 'Libro Mayor',
        uri: 'libro-mayor',
        uriName: 'libro_mayor',
        icono: 'mdi-account-credit-card',
      },
      {
        id: 3,
        name: 'Estado de resultado',
        uri: 'estado-resultado',
        uriName: 'estado_resultado',
        icono: 'mdi-equalizer',
      },
      {
        id: 4,
        name: 'Balance General',
        uri: 'balance-general',
        uriName: 'balance_general',
        icono: 'mdi-badge-account-horizontal',
      }
    ],
  },
]
const auth = useAuthStore()
const open = ref(['Usuario'])


const drawer = computed(() => {
  if (display.xs.value || display.sm.value) {
    return props.modelValue
  }
  return true
})
const closeAll = () => {
  open.value = []
}

defineExpose({
  closeAll,
})

</script>
