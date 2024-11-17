<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    location="end"

  >
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        icon="mdi-cog"
        density="compact"
        color="primary"
      >
      </v-btn>
    </template>

    <v-card min-width="300">
      <v-list>
        <v-list-item
          :title="auth.user.name"
          subtitle="Example for something"
        >
          <template v-slot:prepend>
            <v-icon color="secondary" size="50">mdi-badge-account-outline</v-icon>
          </template>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list>
        <v-list-item @click="logout">
          <template #prepend>

            <v-icon >mdi-logout</v-icon>
          </template>
          <v-list-item-title>Cerrar Sesión</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>
<script setup>
import {ref} from "vue";
import {useAuthStore} from "@/store/auth";

const auth = useAuthStore()

const fav = ref(true)
const menu = ref(false)
const message = ref(false)
const hints = ref(true)

const logout = () => {
  console.log('llegue')
  auth.logout()
}
</script>
