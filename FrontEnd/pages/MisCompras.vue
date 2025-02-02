<template>
  <div class="bg-gray-900 h-screen flex flex-col">
    <h1 class="text-sm text-gray-300 mx-4">TCG Cell - Mis Compras</h1>
    <NavBar @search="handleSearch" @vender="handleVender" @misVentas="handleMisVentas" @login="handleLogin"
      @misCompras="handleMisCompras" :showFilters="false" />
    <main class="container mx-auto p-4 pt-6 flex-1 overflow-y-auto">
      <div class="flex flex-col gap-4">
        <div v-for="compra in misCompras" :key="compra.id_venta"
          class="bg-gray-700 border border-purple-500 rounded-lg p-4 hover:bg-gray-600 flex">
          <nuxt-link :to="{ path: '/cartaDetails', query: { id: compra.carta.id_carta } }"
            class="flex flex-row justify-between">
            <div class="w-64 h-96 mr-5">
              <img :src="`${cerverHost}${compra.carta.imagen}`" alt="" class="w-full h-full object-cover rounded-lg" />
            </div>
            <div class="w-96 text-white text-lg">
              <h1 class="text-2xl font-bold mb-2">{{ compra.carta.nombre }}</h1>
              <p>Tipo: {{ compra.carta.tipo }}</p>
              <p>Descripción: {{ compra.carta.descripcion }}</p>
              <p>Raza: {{ compra.carta.raza }}</p>
              <p>Arquetipo: {{ compra.carta.arquetipo }}</p>
            </div>
          </nuxt-link>
          <div class="bg-gray-800 border border-purple-500 h-15 text-white font-bold text-center rounded-lg ml-4"
            style="width: 330px;">
            <p>Precio: {{ compra.precio_venta }}</p>
            <p>Estado: {{ compra.estado }}</p>
            <p>Fecha: {{ new Date(compra.fecha_venta).toLocaleDateString() }}</p>
            <div class="flex justify-between">
              <div v-if="compra.comprador === null" class="flex items-center">
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
            <p>Vendedor: {{ compra.vendedor.nombre_usuario }}</p>
            <!-- Formulario de reseña -->
            <div class="mt-4">
              <h2 class="text-xl font-bold mb-2">Agregar Reseña a {{ compra.vendedor.nombre_usuario }}</h2>
              <textarea class="w-full p-2 rounded-lg bg-gray-700 border border-purple-500 text-white" rows="3"
                placeholder="Escribe tu reseña aquí..." v-model="compra.resennaDescriptio"></textarea>
              <div class="flex justify-center mt-2">
                <button v-for="n in 5" :key="n"
                  :class="['h-8 w-8 mx-1 rounded-full border', n <= compra.selectedRating ? 'bg-purple-500 text-white' : 'bg-gray-700 text-white']"
                  @click="rate(compra, n)">
                  {{ n }}
                </button>
              </div>
              <button @click="addResenna(compra)"
                class="mt-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">Agregar
                Reseña
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div v-if="showDialog"
      class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity flex justify-center items-center">
      <div
        class="bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div
              class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10"
              :class="titleMesage === 'Error' ? 'bg-red-100' : 'bg-green-100'">
              <svg v-if="titleMesage === 'Error'" class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else class="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-white" id="modal-headline">
                {{ titleMesage }}
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-300">
                  {{ messageMesage }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-800 px-4 py-3 sm:px-6 sm:py-4 sm:flex sm:flex-row-reverse">
          <button type="button" @click="() => showDialog = false"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
            Aceptar
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
useHead({
  title: 'TCG Cell - Tienda de cartas de Yu-Gi-Oh',
  meta: [
    {
      name: 'description',
      content: 'Somos una tienda de cartas de Yu-Gi-Oh en Cuba en la que podrás encontrar cartas de todo tipo, desde las más comunes hasta las más raras.',
    },
    {
      name: 'keywords',
      content: 'Yu-Gi-Oh, Cuba, Venta, cartas, Juego, TCG, Tienda, Cubana, Coleccionables, Duelos',
    },
    {
      property: 'og:title',
      content: 'TCG Cell - Tienda de cartas de Yu-Gi-Oh',
    },
    {
      property: 'og:description',
      content: 'Somos una tienda de cartas de Yu-Gi-Oh en Cuba en la que podrás encontrar cartas de todo tipo, desde las más comunes hasta las más raras.',
    },
    {
      property: 'og:image',
      content: 'https://projectwithnuxtandsequelize-1.onrender.com/logo.png',
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:site',
      content: '@tu_usuario',
    },
    {
      name: 'twitter:creator',
      content: '@tu_usuario',
    },
  ],
})
import { createResenna } from '~/services/resennaServices';
import { getVentasByComprador } from '~/services/ventaServices';
const router = useRouter();
export default {
  data() {
    return {
      misCompras: [],
      cerverHost: "",
      selectedRating: 0,
      titleMesage: "",
      messageMesage: "",
      showDialog: false
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
        const resultVentasByUser = await getVentasByComprador(usuario.id_usuario)
        this.misCompras = resultVentasByUser
      } catch (error) {
        console.error('Error al obtener las ventas:', error);
      }
    },
    async addResenna(compra) {
      try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const resenna = {
          id_usuario: usuario.id_usuario,
          descripcion: compra.resennaDescriptio || "",
          valoracion: compra.selectedRating || 0,
        }
        if (resenna.descripcion !== "" && resenna.valoracion !== 0) {
          await createResenna(resenna);
          compra.resennaDescriptio = "";
          compra.selectedRating = 0;
          this.titleMesage = "Reseña agregada";
          this.messageMesage = "Se agregó la reseña con éxito";
          this.showDialog = true;
        } else {
          this.titleMesage = "Error";
          this.messageMesage = "Debe proporcionar una descripción y dar una valoración";
          this.showDialog = true;
        }
      } catch (error) {
        this.titleMesage = "Error";
        this.messageMesage = 'Error al agregar la reseña:', error;
        this.showDialog = true;
      }
    },
    rate(compra, n) {
      compra.selectedRating = n;
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