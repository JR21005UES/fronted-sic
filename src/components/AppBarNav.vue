<template>
  <v-app-bar
    app
    dark
    elevation="2"
  >

    <v-app-bar-title>Title</v-app-bar-title>

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
  components: {AppBarMenuComponent}
}
</script>
