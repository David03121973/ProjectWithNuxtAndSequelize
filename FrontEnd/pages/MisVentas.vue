<template>
  <div class="bg-gray-900 h-screen flex flex-col">
    <NavBar @search="handleSearch" @vender="handleVender" @misVentas="handleMisVentas" @login="handleLogin"
      @misCompras="handleMisCompras" :showFilters="false" />
    <main class="container mx-auto p-4 pt-6 flex-1 overflow-y-auto">
      <div class="flex flex-col gap-4">
        <div v-for="venta in misVentas" :key="venta.id_venta"
        class="bg-gray-700 border border-purple-500 rounded-lg p-4 hover:bg-gray-600 mb-4">
        <nuxt-link :to="{ path: '/cartaDetails', query: { id: venta.carta.id_carta } }"
          class="flex flex-col md:flex-row justify-between">
          <div class="w-full h-48 md:w-1/3 md:h-96 mb-4 md:mb-0 md:mr-5">
            <img :src="`${cerverHost}${venta.carta.imagen}`" alt="Imagen" class="w-50 h-full object-cover rounded-lg" />
          </div>
          <div class="w-full md:w-96 text-white text-lg mb-4 md:mb-0">
            <h1 class="text-2xl font-bold mb-2">{{ venta.carta.nombre }}</h1>
            <p>Tipo: {{ venta.carta.tipo }}</p>
            <p>Descripción: {{ venta.carta.descripcion }}</p>
            <p>Raza: {{ venta.carta.raza }}</p>
            <p>Arquetipo: {{ venta.carta.arquetipo }}</p>
          </div>
          <div
            class="bg-gray-800 border border-purple-500 h-auto text-white font-bold text-center rounded-lg p-4 w-full md:w-80">
            <p>Precio: {{ venta.precio_venta }}</p>
            <p>Estado: {{ venta.estado }}</p>
            <p>Fecha: {{ new Date(venta.fecha_venta).toLocaleDateString() }}</p>
            <div class="flex justify-between mt-2">
              <div v-if="venta.comprador === null" class="flex items-center">
                <span class="text-red-600">No comprada</span>
                <svg class="h-6 w-6 text-red-600 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div v-else class="flex items-center">
                <span class="text-green-600">Comprada</span>
                <svg class="h-6 w-6 text-green-600 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        </nuxt-link>
      </div>
      </div>
    </main>
  </div>
</template>

<script>
import { getVentasByVendedor } from '~/services/ventaServices';
const router = useRouter();
export default {
  data() {
    return {
      misVentas: [],
      cerverHost: ``
    }
  },
  beforeMount() {
    if (typeof window !== 'undefined') {
      this.cerverHost = window.location.port ? `${window.location.protocol}//${window.location.hostname}:3000` : `${window.location.origin}:3000`;
    }
    this.getVentsByVendedorUsuario();
  },
  methods: {
    async getVentsByVendedorUsuario() {
      try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const resultVentasByUser = await getVentasByVendedor(usuario.id_usuario)
        this.misVentas = resultVentasByUser
      } catch (error) {
        console.error('Error al obtener las ventas:', error);
      }
    },
    handleVender() {
      router.push('/vender');
    },
    handleLogin() {
      router.push('/login');
    },
    handleMisVentas() {
      router.push('/MisVentas')
    },
    handleMisCompras() {
      router.push('/MisCompras')
    }
  }
}
</script>
