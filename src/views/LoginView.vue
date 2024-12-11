<template>
  <v-app>
    <v-main>
      <v-spacer class="my-10"></v-spacer>
      <v-container fluid fill-height>
        <v-row justify="center">
          <v-col xs="12" sm="7" md="5" lg="3">
            <LogoComponent/>
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-col xs="12" sm="7" md="5" lg="4">
            <v-card class="mt-5 pa-2 pa-10">
              <p class="text-h5 text-center mb-10 mt-5 primary--text">
                Iniciar sesión
              </p>

              <v-form>
                <v-text-field
                  :error-messages="$vLogin.email.$error ? $vLogin.email.$errors[0].$message : ''"
                  v-model="form.email"
                  append-inner-icon="mdi-account"
                  label="Usuario / Correo Electrónico *"
                ></v-text-field>
                <v-text-field
                  :error-messages="$vLogin.password.$error ? $vLogin.password.$errors[0].$message : ''"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  label="Contraseña *"
                  @click:append-inner="showPassword = !showPassword"
                ></v-text-field>
                <v-btn
                  color="primary"
                  class="my-10"
                  block
                  @click="submit"
                >
                  Iniciar sesión
                </v-btn>

                <v-row class="justify-center">
                  <v-col cols="12" class="text-center">
                    <v-btn variant="text" color="primary">
                      ¿Olvidaste tu contraseña?
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-spacer class="mt-10"></v-spacer>
    <v-footer class="bg-primary text-white text-center">
      <v-row>
        <v-col
          sm="2"
          cols="12"
          class="d-sm-flex justify-sm-start d-flex justify-center"
        >
          <LogoComponent />
        </v-col>
        <v-col sm="8" cols="12">
          <p>ENCOM</p>
          <p>© 2024 Sistema de Contabilidad - Ciclo Contable.</p>
          <p>Todos los derechos reservados. | Política de Privacidad | Términos y Condiciones | Soporte Técnico</p>
        </v-col>
        <v-col sm="2" cols="12" class="d-none d-sm-flex justify-end">
          <LogoComponent />
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>
<script setup>
import LogoComponent from "@/components/LogoComponent.vue";
import {useAuthStore} from "@/store/auth";
import {computed, ref} from "vue";
import useVuelidate from "@vuelidate/core";
import { required, helpers, minLength } from '@vuelidate/validators'
import useNoti from "@/composables/useNoti";

const useAuth = useAuthStore()

const form = ref({
  email: 'admin@admin.com',
  password: 'admin'
})

const showPassword = ref(false)
const {notify} = useNoti()

const rules = computed(() => {
  return {
    email: {
      minLength: helpers.withMessage(
        'El email es requerido',
        minLength(4),
      ),
      required: helpers.withMessage(
        'El nombre de usuario es requerido',
        required,
      ),
    },
    password: {
      required: helpers.withMessage(
        'La contraseña es requerida',
        required,
      ),
    },
  }
})

const $vLogin = useVuelidate(rules, form)
const submit = async() => {
  $vLogin.value.$validate()
  if($vLogin.value.$invalid){
    notify('Hay campos inválidos', 'error')
  }
  if(!$vLogin.value.$invalid){
    useAuth.login(form.value.email, form.value.password)
  }
}

</script>
