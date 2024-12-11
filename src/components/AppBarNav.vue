<template>
  <v-app-bar
    app
    dark
    elevation="2"
  >
    <v-app-bar-title>
      <v-row align="center" no-gutters>
        <v-col cols="auto">
          <img src='@/assets/LogoMaxMin.png' alt="Logo ENCOM" style="height: 50px; margin-right: 10px;" />
        </v-col>
        <v-col>
          ENCOM S.A. de C.V.
        </v-col>
      </v-row>
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <template #append>
      <app-bar-menu-component/>
    </template>
  </v-app-bar>
</template>

<script>
import AppBarMenuComponent from "@/components/AppBarMenuComponent.vue";

export default {
  name: 'app-bar-nav',
  components: { AppBarMenuComponent }
}
</script>



'@/assets/LogoMaxMin.png'