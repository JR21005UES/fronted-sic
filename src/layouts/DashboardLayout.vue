<template>
  <v-app>
    <app-aside-bar-component
      ref="asideBar"
      v-model="drawer"
      @on-close="close"
    />
    <app-bar-nav/>
    <v-main>
      <v-container fluid class="py-8 mx-5">
        <router-view/>
      </v-container>
    </v-main>
  </v-app>
</template>
<script setup>
import {useDisplay} from 'vuetify'
import {ref} from "vue";
import AppAsideBarComponent from "@/components/AppAsideBarComponent.vue";
import AppBarNav from "@/components/AppBarNav.vue";
import AppBarMenuComponent from "@/components/AppBarMenuComponent.vue";

const display = useDisplay()

const drawer = ref(false)

const asideBar = ref(null)



const close = () => {
  if (display.xs.value) {
    drawer.value = !drawer.value
  }
}


</script>
