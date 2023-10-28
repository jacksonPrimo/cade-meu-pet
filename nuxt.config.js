require('dotenv').config();
import colors from 'vuetify/es5/util/colors'
import fs from 'fs'
import path from 'path'

export default {
  // server: {
  //   https: {
  //     key: fs.readFileSync(path.resolve(__dirname, 'server.key')),
  //     cert: fs.readFileSync(path.resolve(__dirname, 'server.crt'))
  //   }
  // },
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  // ssr: true,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: 'Cadê Meu Pet?',
    title: 'Cadê Meu Pet?',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/pwa',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/firebase'
  ],

  firebase: {
    config: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      measurementId: process.env.MEASUREMENT_ID
    },
    services: {
      auth: true,
      firestore: true
    },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  pwa: {
    meta: {
      title: 'cadê meu pet?',
      author: 'jackson aquino primo'
    },
    icon: {
      fileName: 'images/icon.png',
      sizes: [64, 120, 144, 152, 192, 384, 512]
    },
    manifest: {
      name: 'Cadê Meu Pet?',
      short_name: 'CMP',
      lang: 'pt-br',
      icons: [
        {
          src: 'images/icon.png',
          sizes: '315x315'
        }
      ],
      theme_color: '#fff',
      background_color: '#009688',
      display: 'fullscreen',
      useWebmanifestExtension: false
    },
    workbox: {
      dev: true,
      offline: true,
      offlineAssets: ['/*'],
      importScripts: [ 'custom-sw.js' ],
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
