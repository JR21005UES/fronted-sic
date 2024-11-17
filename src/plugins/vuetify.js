/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// composables
import {createVuetify} from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
const light = {
  dark: false,
  colors: {
    background: '#F4F7FD',
    primary: '#3d1957',
    secondary: '#111C4E',
    accent: '#FF4081', // Color de acento para resaltar elementos adicionales si es necesario
    // Otros colores secundarios para títulos, botones, subtitulos, etc.
    title: '#333333',
    button: '#009688',
    subtitle: '#757575',
    paragraph: '#666666',
  }
}

const dark = {
  dark: true,
  colors: {
    primary: '#3d1957',
    //creame paleta de colores estilo dark para el color de fondo
    background: '#333333',
    secondary: '#111C4E',
    accent: '#FF4081', // Color de acento para resaltar elementos adicionales si es necesario
    // Otros colores secundarios para títulos, botones, subtitulos, etc.
    title: '#FFFFFF',
    colorButton: '#009688',
    subtitle: '#757575',
    paragraph: '#666666',
  }
}

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light,
      dark,
    },
  },
})
