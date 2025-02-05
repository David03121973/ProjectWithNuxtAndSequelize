export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/robots',
    '@nuxtjs/seo',
    '@nuxt/image'
  ],
  css: ['~/assets/css/tailwind.css'],
  server: {
    port: process.env.PORT || 3000, // por defecto: 3000
    host: '0.0.0.0', // por defecto: localhost
  },
  plugins: [
    { src: '~/plugins/vue-lazyload.js', ssr: false }
  ],
  robots: {
    UserAgent: '*',
    Disallow: ''
  },
  seo: {
    site: {
      name: 'TCG Sell',
      title: 'TCG Sell - Tienda de cartas de Yu-Gi-Oh',
      description: 'Somos una tienda de cartas de Yu-Gi-Oh en Cuba en la que podrás encontrar cartas de todo tipo, desde las más comunes hasta las más raras.',
      canonical: 'auto',
      isForcedTrailingSlash: false,
      keywords: 'Yu-Gi-Oh, Cuba, Venta, cartas, Juego, TCG, Tienda, Cubana, Coleccionables, Duelos',
      openGraph: {
        type: 'website',
        image: 'https://projectwithnuxtandsequelize-1.onrender.com/favicon.ico',
        locale: 'es_ES',
        site_name: 'TCG Sell',
      },
    },
  },
  head: {
    title: 'TCG Sell - Tienda de cartas de Yu-Gi-Oh',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Somos una tienda de cartas de Yu-Gi-Oh en Cuba en la que podrás encontrar cartas de todo tipo, desde las más comunes hasta las más raras.' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', href: '/logo.png' },
      { rel: 'shortcut icon', href: '/favicon.ico' }
    ]
  }
})