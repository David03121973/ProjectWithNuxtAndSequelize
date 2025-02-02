// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/tailwind.css'],
  server: {
    port: process.env.PORT || 3000, // por defecto: 3000
    host: '0.0.0.0', // por defecto: localhost
  },
  plugins: [
    { src: '~/plugins/vue-lazyload.js', ssr: false }
  ]
})